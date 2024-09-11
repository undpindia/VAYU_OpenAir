import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row, Card } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { getDeviceData, getDevice, logIn } from '../../api/ApiService';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import vayu from '../../assets/img/images/vayu.svg';
import {
  // selectIsAuthenticated,
  setIsAuthenticated,
  setRole,
  setUid,
} from '../../redux/auth/authSlice';
import pm25 from '../../assets/img/screen-icons/PM2.5.svg';
import pm10 from '../../assets/img/screen-icons/PM10.svg';
import ch4 from '../../assets/img/screen-icons/CH4.svg';
import co from '../../assets/img/screen-icons/CO.svg';
import co2 from '../../assets/img/screen-icons/CO2.svg';
import no2 from '../../assets/img/screen-icons/NO2.svg';
import temp from '../../assets/img/screen-icons/Temperature.svg';
import rh from '../../assets/img/screen-icons/Humidity.svg';
import {
  selectOfflineData,
  setofflineData,
} from '../../redux/offlineData/offlineDataSlice';
// import { useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsDevAvailable } from '../../redux/device/deviceSlice';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [device, setDevice] = useState({});
  const offlineData = useSelector(selectOfflineData);

  // const isAuthenticated = useSelector(selectIsAuthenticated);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const fetchDevice = useRef(async () => {
    const bodyparam = {
      user_id: localStorage.getItem('user_id'),
    };
    try {
      const res = await getDevice(
        localStorage.getItem('access_token'),
        bodyparam
      );
      if (res.data.code === 200 && Object.keys(res.data.data).length > 0) {
        setDevice(res.data.data);
        localStorage.setItem('device_name', res.data.data.device_name);
        localStorage.setItem('device_id', res.data.data.device_id);
        dispatch(setIsDevAvailable(true));
      } else {
        dispatch(setIsDevAvailable(false));
        setDevice({});
      }
    } catch (error) {
      console.log('Error fetching profile', error);
    }
  });

  const fetchDeviceData = useRef(async () => {
    const bodyparam = {
      device_id: localStorage.getItem('device_name'),
    };

    try {
      const response = await getDeviceData(
        localStorage.getItem('access_token'),
        bodyparam
      );
      // console.log('response', response.data.data.length > 0);
      // Check if data is present in the response
      if (response.data.data.length > 0) {
        // setdeviceData(response.data[0]);
        const lastDeviceData =
          response.data.data[0];

        const deviceData = lastDeviceData;
        localStorage.setItem("data_id", deviceData.id)
        // Transform device data into parameter cards format
        const parameterCards = [
          {
            icon: pm25,
            label: 'PM 2.5',
            value: deviceData.pm_25 === null ? 'N/A' : deviceData.pm_25,
            color: deviceData.pm_25 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: pm10,
            label: 'PM 10',
            value: deviceData.pm_10 === null ? 'N/A' : deviceData.pm_10,
            color: deviceData.pm_10 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: ch4,
            label: 'CH4',
            value: deviceData.ch4 === null ? 'N/A' : deviceData.ch4,
            color: deviceData.ch4 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: co,
            label: 'CO',
            value: deviceData.co === null ? 'N/A' : deviceData.co,
            color: deviceData.co === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: co2,
            label: 'CO2',
            value: deviceData.co2 === null ? 'N/A' : deviceData.co2,
            color: deviceData.co2 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: no2,
            label: 'NO2',
            value: deviceData.no2 === null ? 'N/A' : deviceData.no2,
            color: deviceData.no2 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: temp,
            label: 'Temperature',
            value: deviceData.temp === null ? 'N/A' : `${deviceData.temp}°C`,
            color: deviceData.temp === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: rh,
            label: 'Humidity',
            value: deviceData.rh === null ? 'N/A' : deviceData.rh,
            color: deviceData.rh === null ? '#ebebe4' : '#FFFFFF',
          },
        ];

        // Set the parameter cards state
        // setParameterCards(parameterCards);

        dispatch(
          setofflineData({
            ...offlineData,
            deviceData: deviceData,
            parameterCards: parameterCards,
          })
        );
        // return navigate(`${import.meta.env.VITE_REACT_BASE_URL}/home`);
      } else {
        // toast.error('No data found');
        // setdeviceData([]);
        console.log();
      }
    } catch (error) {
      console.error('Error fetching profile', error);
    }
    return navigate('/home');
  });

  const signinHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await logIn({
        username,
        password,
      });
      if (response.data.code === 200) {
        console.log(response.data);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user_role', response.data.role_name);
        localStorage.setItem('user_id', response.data.user_id);
        dispatch(setRole(response.data.role_name));
        dispatch(setUid(response.data.user_id));
        dispatch(setIsAuthenticated(true));

        fetchDevice.current();
        setTimeout(function () {
          fetchDeviceData.current();
        }, 500);
      } else if (response.status === 400) {
        console.log();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // After dispatch actions are complete, navigate to home page
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(`${import.meta.env.VITE_REACT_BASE_URL}/home`);
  //   }
  // }, [isAuthenticated, navigate]);
  const handleSignup = () => {
    navigate('/sign-up');
  };
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userRole = localStorage.getItem('user_role');
    const userId = localStorage.getItem('user_id');
    console.log(userId);

    if (accessToken && refreshToken && userRole) {
      dispatch(setRole(userRole));
      dispatch(setUid(userId));
      dispatch(setIsAuthenticated(true));
      navigate('/home');
    }
  }, [dispatch, navigate]);
  return (
    <div className="signin-container d-block py-0">
      <div className="signin-container__logo-text">
        {/* <h1>VAYU</h1> */}
        <img src={vayu} alt="icon" />
      </div>

      <div className="signin-container__signin-card">
        <h1 className="signin-container__signin-card--title-sign">Sign in</h1>

        <Row className="g-0 w-100">
          <Col md="12" lg="5" xl="4" className="col-wrapper">
            <Card className="card-sign">
              <Card.Body>
                <Form onSubmit={signinHandler}>
                  <div className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Enter your email address"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      inputMode="password"
                    />

                    <div
                      type="button"
                      className="signin-container__signin-card--toggle-password-btn"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        style={{ color: 'black' }}
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="signin-container__signin-card--forgot-password" > 
                      <span onClick={handleForgotPassword}>Forgot Password?</span>
                    </span>
                  </div>

                  <Row className="g-3">
                    <Col md="12">
                      <Button
                        type="submit"
                        className="signin-container__signin-card--btn-sign"
                      >
                        Sign In
                      </Button>
                    </Col>
                    <div className="mb-4">
                      <span
                        className="signin-container__signin-card--sign-up"
                      >
                       <span  onClick={handleSignup}>New User ? Sign Up</span>
                      </span>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default Signin;
