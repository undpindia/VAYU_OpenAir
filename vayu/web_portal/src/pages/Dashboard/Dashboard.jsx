import ActivityGraph from '@/components/ActivityGraph/ActivityGraph';
import DataTrendCard from '@/components/DataTrendCard/DataTrendCard';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useRef, useState } from 'react';
import MarkerRed from '../../assets/images/icons/marker-red.png';
import Home from '../../assets/images/icons/home.svg';
import {
  getActivityData,
  getTrendData,
  getTrendGraphData,
  getDeviceCount,
  dataDownload,
  getMonth,
} from '@/api/ApiService';
import { useMutation, useQuery } from 'react-query';
import MapLibreHeatmap from '@/components/HeatMap/MapLibreHeatmap';
import { Skeleton } from '@/components/ui/skeleton';
import {
  convertTrendDataResponse,
  processTrendGraphApiResponse,
  transformActivityDataResponse,
} from '@/utils/conversionFunctions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { dateWithOrdinal, forecastDate } from '@/utils/dateUtils';
import { ReloadIcon } from '@radix-ui/react-icons';
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip';
import Footer from '@/components/Footer/Footer';

import './Dashboard.scss';
import toast, { Toaster } from 'react-hot-toast';
import Tippy from '@tippyjs/react';
import EyeShow from '../../assets/images/icons/eye-show.svg';
import EyeHide from '../../assets/images/icons/eye-hide.svg';
import MarkerGreen from '../../assets/images/icons/marker-green.svg';
import Close from '../../assets/images/icons/close.svg';
import image from '../../assets/images/common/image-popup.png';
import Undp from '../../assets/images/partners/undp.svg';
import Vayu from '../../assets/images/partners/vayu-white.svg';

const Dashboard = () => {
  const isInitialLoad = useRef(true);
  const today = new Date();
  const previousday = new Date(today);
  previousday.setDate(today.getDate() - 1);
  const [formValues, setFormValues] = useState({
    city: 'patna',
    device_type: 'dynamic', // Fixed value
    from_date: '2024-06-01', // Fixed value
    to_date: forecastDate(previousday), // Current date in YYYY-MM-DD format
    device_id: 'all', // Empty or dynamic as needed
  });
  const [formDownload, setFormDownload] = useState({
    name: '',
    email: '',
    usage_type: '',
    purpose: '',
    city: '',
    device_type: '',
  });
  const [formDownloadMonths, setFormDownloadMonths] = useState({
    from_month: '',
    year: '',
  });
  const queryParams = {
    from_date: formValues.from_date,
    to_date: formValues.to_date,
    city: formValues.city,
    device_type: formValues.device_type,
  };
  const [heatMapActivityPoints, setHeatMapActivityPoints] = useState([]);
  const [trendDataPoints, setTrendDataPoints] = useState([]);
  const [trendGraphDataPoints, setTrendGraphDataPoints] = useState([]);
  const [updateMap, setUpdateMap] = useState(false);
  const [pointData, setPointData] = useState(false);
  const [selectedSensorType, setSelectedSensorType] = useState('dynamic');
  const [emailError, setEmailError] = useState('');
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [countDevice, setCountDevice] = useState('');
  const [zoom, setZoom] = useState(false);
  const [isDensityVisible, setIsDensityVisible] = useState(true);
  const [isRecordVisible, setIsRecordVisible] = useState(true);
  const [isStaticVisible, setIsStaticVisible] = useState(true);
  const [months, setMonths] = useState([]);
  const [isSensorClose, setIsSensorClose] = useState(false);
  const [isContentVisible, setContentVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // const [formValuesError, setFormValuesError] = useState('');

  // Combined loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  // Function to fetch activity data
  const fetchActivityData = (values) => getActivityData(values);

  // Function to fetch trend data
  const fetchTrendData = (values) => getTrendData(values);

  // Function to fetch trend graph data
  const fetchTrendGraphData = (values) => getTrendGraphData(values);

  const fetchCountData = (values) => getDeviceCount(values);
  useEffect(() => {
    if (isInitialLoad.current) {
      // Call the APIs only on the initial page load
      refetchActivityData();
      refetchTrendData();
      refetchTrendGraphData();
      refetchCountData();

      // Set the ref to false after the initial load
      isInitialLoad.current = false;

      console.log('zoom, emailError', zoom, emailError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UseQuery for initial data load (page load only)
  const { refetch: refetchCountData, isLoading: isCountLoading } = useQuery(
    ['countData'],
    () => fetchCountData(queryParams),
    {
      enabled: false, // Disable automatic query on mount
      onSuccess: (data) => {
        if (data.status === 200 && data.data.success === true) {
          setCountDevice(data.data);
        }
      },
    }
  );
  const {
    refetch: refetchActivityData,
    isLoading: isActivityDataLoading,
    isRefetching: isActivityDataRefetching,
  } = useQuery(['activityPointsData'], () => fetchActivityData(formValues), {
    enabled: false, // Disable automatic query on mount
    onSuccess: (data) => {
      if (data.data.data.length > 0) {
        const result = transformActivityDataResponse(data.data.data);
        setHeatMapActivityPoints(result);
      }
    },
  });
  const {
    refetch: refetchTrendData,
    isLoading: isDataTrendLoading,
    isRefetching: isDataTrendRefetching,
  } = useQuery(['trendPointsData'], () => fetchTrendData(formValues), {
    enabled: false, // Disable automatic query on mount
    onSuccess: (data) => {
      if (data.status === 200 && data.data.success === true) {
        const result = convertTrendDataResponse(data.data.data);
        setTrendDataPoints(result);
      }
    },
  });

  const { refetch: refetchTrendGraphData, isLoading: isDataTrendGraphLoading } =
    useQuery(['trendGraphPointsData'], () => fetchTrendGraphData(formValues), {
      enabled: false, // Disable automatic query on mount
      onSuccess: (data) => {
        if (data.status === 200 && data.data.success === true) {
          const result = processTrendGraphApiResponse(data.data.data);
          setTrendGraphDataPoints(result);
        }
      },
    });

  // UseMutation to handle form submission for all APIs
  const activityMutation = useMutation(() => fetchActivityData(formValues), {
    onSuccess: (data) => {
      if (data.data.data.length > 0) {
        const result = transformActivityDataResponse(data.data.data);
        setHeatMapActivityPoints(result);
      }
    },
  });

  const trendMutation = useMutation(() => fetchTrendData(formValues), {
    onSuccess: (data) => {
      if (data.status === 200 && data.data.success === true) {
        const result = convertTrendDataResponse(data.data.data);
        setTrendDataPoints(result);
      }
    },
  });

  const trendGraphMutation = useMutation(
    () => fetchTrendGraphData(formValues),
    {
      onSuccess: (data) => {
        if (data.status === 200 && data.data.success === true) {
          const result = processTrendGraphApiResponse(data.data.data);
          setTrendGraphDataPoints(result);
        }
      },
    }
  );
  const countMutation = useMutation(() => fetchCountData(queryParams), {
    onSuccess: (data) => {
      if (data.status === 200 && data.data.success === true) {
        setCountDevice(data.data);
      }
    },
  });

  const handleZoomToBounds = () => {
    setZoom((prev) => !prev);
  };

  const checkSensor = () => {
    setIsSensorClose(true);
    if (formValues.device_type === 'static' && formValues.device_id !== 'all') {
      setFormValues((prevValues) => ({
        ...prevValues,
        device_id: 'all',
      }));
    }
    setTimeout(() => {
      refetchActivityData();
      refetchTrendData();
      refetchTrendGraphData();
    }, 100);
  };

  // Handle form submit
  const handleSubmit = async () => {
    // e.preventDefault();
    setUpdateMap((prev) => !prev);

    // Set the loading state to true before calling the APIs
    setIsSubmitting(true);

    // Execute all mutations sequentially or in parallel as needed
    try {
      await Promise.all([
        activityMutation.mutateAsync(),
        trendMutation.mutateAsync(),
        trendGraphMutation.mutateAsync(),
        countMutation.mutateAsync(),
      ]);
    } finally {
      // Set the loading state to false after all API calls are completed
      setIsSubmitting(false);
    }
  };

  // console.log('trendDatapoibnts', trendDataPoints);
  const handleSelectChange = (field, value) => {
    // setFormValuesError(''); // Clear any previous error
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleDateChange = (id, date) => {
    // setFormValuesError(''); // Clear any previous error
    if (date) {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      setFormValues((prev) => ({
        ...prev,
        [id]: forecastDate(localDate.toISOString()),
      }));
    }
  };

  const fetchMonths = async () => {
    try {
      const response = await getMonth();
      if (response.data.code === 200 && response.data.success === true) {
        const sortedDevices = response.data.device_count.sort(
          (a, b) => a.id - b.id
        );
        const formattedMonths = sortedDevices.map((device) => ({
          label: `${device.month} ${device.year}`,
          month: device.month,
          year: device.year,
        }));
        setMonths(formattedMonths);
      }
    } catch (error) {
      console.error('Error fetching months', error);
    }
  };

  const downloadData = useRef(async (data) => {
    try {
      setIsDownload(true);
      const response = await dataDownload(data);
      if (response.data.code === 200) {
        const fetchurl = await fetch(response.data.data);
        const text = await fetchurl.text();
        if (text.includes('BlobNotFound')) {
          toast.error('No Data Found');
          setIsDownload(false);
        } else {
          const link = document.createElement('a');
          link.href = response.data.data;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsDownloadOpen(false);
          setIsDownload(false);
          setFormDownload({});
          setFormDownloadMonths([]);
          setCurrentStep(1);
        }
      } else {
        console.error('Download failed:', response.message);
      }
    } catch (error) {
      console.error('Error downloading data', error);
    }
  });
  const [isInitailDialogBoxOpen, setIsInitailDialogBoxOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hasOpened = sessionStorage.getItem('dialogOpened');
    if (!hasOpened) {
      setIsInitailDialogBoxOpen(true);
      sessionStorage.setItem('dialogOpened', 'true');
    }
  }, []);

  const handleDialogButtonClick = (city) => {
    // Update the formValues state with the new city
    setFormValues((prevValues) => ({
      ...prevValues,
      city: city,
    }));

    handleClick();
  };

  const handleClick = async () => {
    setError(''); // Clear any previous error
    setIsInitailDialogBoxOpen(false); // Close the dialog after selection
    setUpdateMap((prev) => !prev);

    // Set the loading state to true before calling the APIs
    setIsSubmitting(true);

    // Execute all mutations with the updated formValues
    try {
      await Promise.all([
        activityMutation.mutateAsync(),
        trendMutation.mutateAsync(),
        trendGraphMutation.mutateAsync(),
        countMutation.mutateAsync(),
      ]);
    } finally {
      // Set the loading state to false after all API calls are completed
      setIsSubmitting(false);
    }
  };

  // console.log('formValues', formValues);

  const handleDialogClose = (isOpen) => {
    if (!isOpen && !formValues.city) {
      setError('Please select a city before closing the dialog box.');
      setIsInitailDialogBoxOpen(true); // Prevent dialog from closing
    } else {
      setIsInitailDialogBoxOpen(isOpen);
    }
  };

  const handleDialogOpenChange = (Open) => {
    if (!Open) {
      setErrors('');
      setFormDownload({});
      setFormDownloadMonths([]);
      setCurrentStep(1);
    }
    if (Open) {
      fetchMonths();
    }
    setIsDownloadOpen(Open);
  };

  const handleMarkerClick = (point) => {
    // console.log('Marker clicked in Dashboard:', point.device_id);
    setIsSensorClose(false);
    setPointData(point.device_id);
    setFormValues((prevValues) => ({
      ...prevValues,
      device_id: point.device_id,
    }));
    setTimeout(() => {
      refetchActivityData();
      refetchTrendData();
      refetchTrendGraphData();
    }, 1000);
  };

  useEffect(() => {
    if (formValues.device_type === 'static') {
      setSelectedSensorType('static');
    }
    if (formValues.device_type === 'dynamic') {
      setSelectedSensorType('dynamic');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMap]);

  const handleSelect = (field, value) => {
    setFormDownload((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const handleSelectMonths = (field, value) => {
    const [month, year] = value.split('-');

    setFormDownloadMonths({
      ...formDownload,
      from_month: month,
      year: year,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: '',
    }));
  };
  const handleUsageType = (type) => {
    setFormDownload((prevValues) => ({
      ...prevValues,
      usage_type: type,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      usage_type: '',
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDownload((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleNextStep = () => {
    // Add validation
    if (currentStep === 1) {
      let step1Errors = {};
      if (!formDownloadMonths.from_month && !formDownloadMonths.year)
        step1Errors.from_month = 'Month is required';
      if (!formDownload.city) step1Errors.city = 'City is required';
      if (!formDownload.device_type)
        step1Errors.device_type = 'Device type is required';
      if (Object.keys(step1Errors).length > 0) {
        setErrors(step1Errors);
        return;
      }
    }
    // Move to next step
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleDataDownload = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let errors = {};

    if (!formDownload.email || !emailRegex.test(formDownload.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formDownload.name) {
      errors.name = 'Name is required';
    }

    if (!formDownload.usage_type) {
      errors.usage_type = 'Usage type is required';
    }

    if (!formDownload.purpose) {
      errors.purpose = 'Purpose is required';
    }

    if (!formDownloadMonths.from_month && !formDownloadMonths.year) {
      errors.from_month = 'Month is required';
    }
    if (!formDownload.city) {
      errors.city = 'City is required';
    }

    if (!formDownload.device_type) {
      errors.device_type = 'Device type is required';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    const params = {
      from_month: formDownloadMonths.from_month,
      year: formDownloadMonths.year,
      city: formDownload.city,
      device_type: formDownload.device_type,
      name: formDownload.name,
      email: formDownload.email,
      usage_type: formDownload.usage_type,
      purpose: formDownload.purpose,
    };
    downloadData.current(params);
  };
  const handleDensityClick = () => {
    setIsDensityVisible(!isDensityVisible);
  };
  const handleRecordClick = () => {
    setIsRecordVisible(!isRecordVisible);
  };
  const handleStaticClick = () => {
    setIsStaticVisible(!isStaticVisible);
  };

  useEffect(() => {
    if (
      formValues.device_type === 'dynamic' &&
      formValues.device_id !== 'all'
    ) {
      setFormValues((prevValues) => ({
        ...prevValues,
        device_id: 'all',
      }));
    }
  }, [formValues.device_type, formValues.device_id]);

  const statsData = [
    { id: 1, title: '2', subtitle: 'Cities' },
    { id: 2, title: '100+', subtitle: 'Sensors' },
    { id: 3, title: '150+', subtitle: 'Volunteers' },
    { id: 4, title: '1000+', subtitle: 'Records collected' },
    { id: 5, title: '~10M', subtitle: 'Data points' },
  ];
  const handleToggleColorScale = () => {
    setContentVisible(!isContentVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const displayStyle =
    windowWidth < 500 ? (isContentVisible ? 'block' : 'none') : 'block';
  return (
    <div className="relative top-[102px] flex flex-col gap-4 min-h-screen md:max-h-screen xl:max-h-screen thin-scrollbar">
      <div className="flex flex-col border rounded-sm p-4">
        <div className="flex flex-wrap w-full  gap-2 items-end">
          <div className="flex flex-col flex-1 min-w-[200px]">
            <Label className="font-medium text-[20px] leading-[28px] mb-2">
              City
            </Label>
            <Select
              value={formValues.city}
              onValueChange={(value) => handleSelectChange('city', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full font-normal text-[18px]">
                <SelectValue placeholder={formValues.city || 'Select a city'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="patna">Patna</SelectItem>
                  <SelectItem value="gurugram">Gurugram</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col flex-1 min-w-[200px]">
            <Label className="font-medium text-[20px] leading-[28px] mb-2">
              Sensor Type
            </Label>
            <Select
              value={formValues.device_type}
              onValueChange={(value) =>
                handleSelectChange('device_type', value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full font-normal text-[18px]">
                <SelectValue
                  placeholder={formValues.device_type || 'Select a sensor type'}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col flex-1 ">
            <Label className="font-medium text-[20px] leading-[28px] mb-2">
              Date Range
            </Label>
            <DatePicker
              label={dateWithOrdinal(formValues.from_date) || 'Start Date'}
              onSelect={(date) => handleDateChange('from_date', date)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col flex-1 ">
            <DatePicker
              label={dateWithOrdinal(formValues.to_date) || 'End Date'}
              onSelect={(date) => handleDateChange('to_date', date)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-1 min-w-[200px]">
            <Button
              className="w-full text-[20px] font-normal"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </div>

        {/* <div className="mt-4">
          {formValuesError && (
            <div style={{ color: 'red' }}>{formValuesError}</div>
          )}
        </div> */}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-1">
          <h1 className="font-[500] text-[28px] leading-[28px] text-[#11263C] mb-1">
            Map
          </h1>

          <CustomTooltip dataTooltip="This heatmap shows the density of data points collected by the sensors. The color gradient represents the intensity of data points collected in a specific area." />
        </div>

        <div className="rounded-sm h-[450px] xl:h-[600px] w-full">
          {/* <HeatMapLeaflet heatMapPoints={heatMapPoints} /> */}
          {/* {isHeatMapPointsLoading ? (
            <Skeleton className="h-[425px] w-full rounded-xl bg-border" />
          ) : ( */}
          {/* )} */}
          <div className="relative">
            <div className="zoom-bounds" onClick={handleZoomToBounds}>
              <Tippy
                placement={'right-end'}
                theme={'dark'}
                content={' Reset View'}
                arrow={false}
                className="zoom-bounds-tooltip"
              >
                <img src={Home} />
                {/* <img className="info-icon" src={infoIconWhite} alt="info.svg"></img> */}
              </Tippy>
            </div>
          </div>
          <MapLibreHeatmap
            startDate={formValues.from_date}
            endDate={formValues.to_date}
            updateMap={updateMap}
            selectedCity={formValues.city}
            selectedType={formValues.device_type}
            onMarkerClick={handleMarkerClick}
            // onRecordMarkerClick={handleRecordMarkerClick}
            handleZoomToBounds={handleZoomToBounds}
            handleStaticClick={handleStaticClick}
            handleDensityClick={handleDensityClick}
            handleRecordClick={handleRecordClick}
            isDensityVisible={isDensityVisible}
            isRecordVisible={isRecordVisible}
            isStaticVisible={isStaticVisible}
            isSensorClose={isSensorClose}
          />
          <div className="relative">
            <div
              className="toggle-button"
              onClick={handleToggleColorScale}
              style={{
                bottom: isContentVisible ? '45px' : '',
                backgroundColor: isContentVisible ? '' : '#fff',
                left: isContentVisible ? '-10px' : '10px',
              }}
            >
              {isContentVisible ? (
                <img src={Close} className="h-7" />
              ) : (
                'Show legend'
              )}
            </div>
            {selectedSensorType === 'static' ? (
              ''
            ) : (
              <div
                className="color-scale-container"
                style={{ display: displayStyle }}
              >
                <div className="color-scale-card">
                  <div className="data-density-div">
                    <div className="data-density">
                      <span>Data Density</span>
                    </div>
                    <div
                      className="data-density-show"
                      onClick={handleDensityClick}
                    >
                      <Tippy
                        placement={'right-end'}
                        theme={'dark'}
                        content={'Show/Hide'}
                        arrow={false}
                        className="zoom-bounds-tooltip"
                      >
                        <img src={isDensityVisible ? EyeShow : EyeHide} />
                      </Tippy>
                    </div>
                  </div>
                  <div className="color-scale">
                    <div className="gradient-bar"></div>
                    <div className="labels">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div>
                    <hr />
                  </div>
                  <div className="recorded-data-div">
                    <div className="recoded-data">
                      <img src={MarkerGreen} />
                      <span>Recorded Data</span>
                    </div>
                    <div
                      className="recorded-data-show"
                      onClick={handleRecordClick}
                    >
                      <Tippy
                        placement={'right-end'}
                        theme={'dark'}
                        content={'Show/Hide'}
                        arrow={false}
                        className="zoom-bounds-tooltip"
                      >
                        <img src={isRecordVisible ? EyeShow : EyeHide} />
                      </Tippy>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSensorType === 'static' ? (
              <div
                className="static-sensor-container"
                style={{ display: displayStyle }}
              >
                <div className="static-sensor-card">
                  <div className="static-sensor-div">
                    <div className="static-sensor">
                      <img
                        src={MarkerRed}
                        className="static-sensot-icon"
                        alt="static-sensor"
                        style={{ width: '25px' }}
                      />
                      <span>Static Data Points</span>
                    </div>
                    <div
                      className="static-sensor-show"
                      onClick={handleStaticClick}
                    >
                      <Tippy
                        placement={'right-end'}
                        theme={'dark'}
                        content={'Show/Hide'}
                        arrow={false}
                        className="zoom-bounds-tooltip"
                      >
                        <img src={isStaticVisible ? EyeShow : EyeHide} />
                      </Tippy>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {isCountLoading || isSubmitting ? (
              ''
            ) : (
              <div className="device-card-div">
                <div className="devices-card">
                  <span className="label">Devices: </span>
                  <span>{countDevice.device_count}</span>
                </div>
                <div className="data-points-card">
                  <span className="label">Data Points: </span>
                  <span>{countDevice.data_count}</span>
                </div>
                {pointData &&
                  !isSensorClose &&
                  formValues.device_type === 'static' && (
                    <div className="device-data-card">
                      <span className="label">Sensor name: </span>
                      <span>{pointData}</span>
                      <span onClick={checkSensor}>
                        {' '}
                        <img src={Close} className="device-close-btn" />
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-1">
          <h1 className="font-[500] text-[28px] leading-[28px] text-[#11263C] mb-1">
            Data Trend
          </h1>

          <CustomTooltip dataTooltip="This section shows the trend of data points collected by the sensors over a specific period. The graph represents the data points collected over time for each sensor type." />
        </div>

        {isDataTrendLoading ||
        isDataTrendRefetching ||
        isDataTrendGraphLoading ||
        isSubmitting ? (
          <Skeleton className="h-[250px] w-[100%] rounded-xl bg-border" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendDataPoints &&
              trendDataPoints.length > 0 &&
              trendDataPoints.map((data) => {
                // Access the graph data for the specific key directly
                const filteredGraphData = trendGraphDataPoints[data.key] || [];
                return (
                  <DataTrendCard
                    key={data.id}
                    data={data}
                    graphData={filteredGraphData}
                  />
                );
              })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-1">
          <h1 className="font-[500] text-[28px] leading-[28px] text-[#11263C] mb-1">
            Activity
          </h1>

          <CustomTooltip dataTooltip="This section shows the activity graph of data points collected by the sensors over a specific period. The graph represents the data points collected over time for each sensor type." />
        </div>

        {isActivityDataLoading || isSubmitting || isActivityDataRefetching ? (
          <Skeleton className="h-[250px] w-full rounded-xl bg-border" />
        ) : (
          heatMapActivityPoints &&
          heatMapActivityPoints.length > 0 && (
            <div className="border shadow-md rounded-sm p-4">
              <ActivityGraph data={heatMapActivityPoints} />
            </div>
          )
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Dialog open={isDownloadOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="text-[20px] font-normal"
              onClick={() => setIsDownloadOpen(true)}
            >
              Download Data
            </Button>
          </DialogTrigger>
          <DialogContent className="w-4/5 max-w-[auto] rounded-md border-none sm:max-w-[425px] p-6">
            <DialogHeader>
              <DialogTitle>
                <h1 className="font-[500] text-[24px] leading-[28px] text-[#11263C]">
                  Download Data
                </h1>
              </DialogTitle>
              <DialogDescription>
                <span className="text-[16px] font-normal">
                  Download data for the selected month, city and device type
                </span>
              </DialogDescription>
            </DialogHeader>

            {currentStep === 1 && (
              <div className="w-full space-y-4">
                <div className="flex flex-col ">
                  <Label className="font-medium text-[16px] leading-[28px] mb-2">
                    Month
                  </Label>
                  <Select
                    value={formDownload.from_month}
                    onValueChange={(value) =>
                      handleSelectMonths('from_month', value)
                    }
                  >
                    <SelectTrigger className="font-normal text-[14px]">
                      <SelectValue placeholder="Select a month for download" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {months.map((month) => (
                          <SelectItem
                            key={month.label}
                            value={`${month.month}-${month.year}`}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {errors.from_month && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.from_month}
                  </p>
                )}
                <div className="flex flex-col w-full">
                  <Label className="font-medium text-[16px] leading-[28px] mb-2">
                    City
                  </Label>
                  <Select
                    value={formDownload.city}
                    onValueChange={(value) => handleSelect('city', value)}
                  >
                    <SelectTrigger className="w-full font-normal text-[14px]">
                      <SelectValue placeholder="Select a City for download" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="patna">Patna</SelectItem>
                        <SelectItem value="gurugram">Gurugram</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
                <div className="flex flex-col w-full">
                  <Label className="font-medium text-[16px] leading-[28px] mb-2">
                    Device Type
                  </Label>
                  <Select
                    value={formDownload.device_type}
                    onValueChange={(value) =>
                      handleSelect('device_type', value)
                    }
                  >
                    <SelectTrigger className="w-full font-normal text-[14px]">
                      <SelectValue placeholder="Select a device for download" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="dynamic">Dynamic</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {errors.device_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.device_type}
                  </p>
                )}
                <DialogFooter>
                  <Button
                    className="w-full text-[20px] font-normal"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                </DialogFooter>
              </div>
            )}

            {currentStep === 2 && (
              <div className="w-full space-y-4">
                <Input
                  name="name"
                  label="Name"
                  placeholder="Name"
                  className="w-full h-[40px] text-[16px] leading-[28px]"
                  value={formDownload.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}

                <Input
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="email"
                  className="w-full h-[40px] text-[16px] leading-[28px]"
                  value={formDownload.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                <div className="w-full space-y-2 flex flex-col justify-center">
                  <Label className="font-medium text-[16px]">Usage Type</Label>
                  <div className="flex gap-3 ml-2" style={{ marginTop: '3px' }}>
                    <Input
                      name="usagetype"
                      type="radio"
                      className="text-[16px] accent-[#31572C]"
                      value="commercial"
                      style={{ width: '22px' }}
                      onClick={() => handleUsageType('Commercial')}
                    />
                    <Label className="flex flex-warp gap-2 font-medium text-[14px] mt-2">
                      Commercial
                    </Label>
                    <Input
                      name="usagetype"
                      type="radio"
                      className="text-[14px] accent-[#31572C]"
                      value="commercial"
                      style={{ width: '22px' }}
                      onClick={() => handleUsageType('Non-commercial')}
                    />
                    <Label className="flex flex-warp gap-2 font-medium text-[14px] mt-2">
                      Non-commercial
                    </Label>
                  </div>
                  {errors.usage_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.usage_type}
                    </p>
                  )}
                </div>
                <div
                  className="flex flex-col w-full"
                  style={{ marginTop: '6px' }}
                >
                  <Label className="font-medium text-[16px] leading-[28px] mb-2">
                    Purpose
                  </Label>
                  <Select
                    value={formDownload.purpose}
                    onValueChange={(value) => handleSelect('purpose', value)}
                  >
                    <SelectTrigger className="w-full font-normal text-[14px]">
                      <SelectValue placeholder="Select a purpose for download" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="government">
                          Government Use
                        </SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="rnd">R & D</SelectItem>
                        <SelectItem value="journalistic">
                          Journalistic
                        </SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                )}
                <DialogFooter>
                  <Button
                    className="w-full text-[20px] font-normal bg-[#ffff] text-custom-green border border-custom-green hover:bg-custom-green hover:text-white focus:ring-4"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                  <Button
                    className="w-full text-[20px] font-normal"
                    onClick={handleDataDownload}
                    disabled={isDownload}
                  >
                    {isDownload ? (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Download'
                    )}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        <Dialog open={isInitailDialogBoxOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="w-4/5 xl:w-9/12 max-w-[auto] p-0 border-none initial-dialog ">
            <div className="w-full max-w-[auto] h-[200px] sm:h-auto sm:w-full sm:max-h-full xl:h-auto">
              <div className="relative w-full h-[200px] initial-dialog__heading">
                <img
                  src={image}
                  className="w-full h-full object-cover z-0 image-card"
                  alt="cover image"
                />
                <div className="absolute inset-0 opacity-50 image-color"></div>
              </div>
              <div>
                <div className="absolute top-0 left-0 flex flex-row gap-2 ml-5">
                  <img src={Undp} className="h-16 w-auto" alt="Logo 1" />
                  <img
                    src={Vayu}
                    className="h-7 w-auto self-center"
                    alt="Logo 2"
                  />
                </div>
                <h1 className="absolute flex top-[12%] ml-5 text-white text-[28px] font-semibold initial-dialog__fontsSize">
                  <span className="w-4/5 py-4">
                    Hyperlocal Mapping of Air Pollution and GHG emissions
                  </span>
                </h1>
              </div>
            </div>
            <div className="w-full h-[230px] overflow-y-auto px-6 thin-scrollbar initial-dialog__contentHeight">
              <div className="w-full flex flex-col justify-center items-start">
                <span className="font-normal text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[26px] mb-4 text-justify">
                  Hyperlocal Mapping of Air Pollution project is part of the
                  Climate &amp; Energy Lacuna Fund cohort of 2023.
                </span>

                <div className="mb-4 w-full">
                  <div className="grid grid-cols-5 gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 initial-dialog__mobile-grid">
                    {statsData.map((stat) => (
                      <div
                        key={stat.id}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="text-[25px] sm:text-[20px] md:text-[22px] lg:text-[25px] font-semibold text-custom-light-green">
                          {stat.title}
                        </div>
                        <div className="text-sm" style={{ color: '#626D7D' }}>
                          {stat.subtitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <span className="font-normal text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[26px] mb-4 text-justify">
                  Under this initiative, a novel approach is employed by
                  leveraging citizen scientists and IoT-based low-cost sensors
                  to collect hyperlocal air quality data. This data is used to
                  identify pollution sources and risk zones, facilitating
                  targeted actions by regulatory authorities.
                </span>

                <span className="font-normal text-[16px] sm:text-[14px] md:text-[16px] lg:text-[18px] leading-[26px] mb-4 text-justify">
                  To showcase data outreach, the project features the VAYU
                  Android-based application and the VAYU citizen portal digital
                  stack, which support targeted interventions and customized
                  solutions backed by AI/ML algorithms. These tools potentially
                  develop new approaches in air pollution management while
                  reducing public investment costs.
                </span>

                {error && (
                  <div className="flex justify-center items-center w-full gap-4">
                    <p className="text-red-600 text-center mt-4">{error}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 xs:p-6 initial-dialog__footer-section">
              <DialogFooter>
                <div
                  className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 p-4 md:mb-6 xl:mb-0"
                  style={{ background: '#3D944E', borderRadius: '6px' }}
                >
                  <span className="text-[18px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-white leading-[26px] font-normal text-justify">
                    Select any of the two cities to view data
                  </span>

                  <div className="flex flex-col gap-4 w-1/4 sm:flex-row sm:w-2/6 initial-dialog__footer-btn">
                    <Button
                      variant="outline"
                      className="w-full text-custom-green rounded-sm border-none h-[50px] text-[16px] sm:w-1/2 sm:text-[18px]"
                      onClick={() => {
                        handleDialogButtonClick('patna');
                        setIsInitailDialogBoxOpen(false);
                      }}
                    >
                      Patna
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-custom-green rounded-sm border-none h-[50px] text-[16px] sm:w-1/2 sm:text-[18px]"
                      onClick={() => {
                        handleDialogButtonClick('gurugram');
                        setIsInitailDialogBoxOpen(false);
                      }}
                    >
                      Gurugram
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

/**
 * FOR STATIC SENSOR TYPE:
 * 1. show static sensor in map (location points)
 * 2. show city boundary in map (show always)
 *
 *
 * FOR DYNAMIC SENSOR TYPE:
 * 1. show heat map when sensor type is dynamic
 */
