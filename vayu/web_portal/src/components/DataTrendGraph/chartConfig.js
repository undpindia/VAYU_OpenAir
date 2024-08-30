export const chartConfig = {
  dataLabels: {
    enabled: false,
  },

  legend: { show: false },
  grid: {
    show: false,
    borderColor: '#E9EDF7',
    position: 'back',
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  markers: {
    size: 0,
    colors: '#fff',
    strokeColors: '#000',
    shape: 'circle',
    radius: 5,
    offsetY: -9,
    hover: {
      size: 5,
      sizeOffset: 3,
    },
  },
  tooltip: {
    enabled: false,
    followCursor: false,
    inverseOrder: false,
    shared: false,
    fillSeriesColor: true,
    style: {
      fontSize: '1.5rem',
    },
    x: {
      show: false,
    },
    y: {
      formatter: undefined,
      title: {
        formatter: () => {},
      },
    },
  },
  stroke: {
    curve: 'smooth',
    width: '2',
  },
  chart: {
    id: 'basic-bar',

    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
      type: 'x',
      autoScaleYaxis: true,
      zoomedArea: {
        fill: {
          color: '#90CAF9',
          opacity: 0.4,
        },
        stroke: {
          color: '#0D47A1',
          opacity: 0.4,
          width: 1,
        },
      },
    },
  },
  xaxis: {
    // tickPlacement: 'on',
    axisBorder: {
      show: false,
      color: '#E0E5F2',
      offsetX: 0,
      offsetY: 0,
      height: '0.5px',
    },
    axisTicks: {
      show: false,
      borderType: 'solid',
      color: '#78909C',
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
    crosshairs: {
      show: false,
      position: 'front',
    },
    categories: [],
    tooltip: {
      enabled: false,
    },

    labels: {
      // rotate: -45,
      // rotateAlways: false,
      hideOverlappingLabels: false,
      showDuplicates: false,
      style: {
        colors: '#445074',
        fontSize: '9.6px',
        fontFamily: 'font-regular',
        fontWeight: 500,
      },
      datetimeUTC: false,
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm',
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
      color: '#E0E5F2',
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
      borderType: 'solid',
      color: '#78909C',
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
    crosshairs: {
      show: false,
      position: 'front',
    },
    tooltip: {
      enabled: false,
    },

    labels: {
      style: {
        colors: '#445074',
        fontSize: '9.6px',
        fontFamily: 'font-regular',
        fontWeight: 500,
      },
    },
  },
};
