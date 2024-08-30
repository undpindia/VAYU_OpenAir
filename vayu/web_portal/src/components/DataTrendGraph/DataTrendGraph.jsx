import Chart from 'react-apexcharts';
import { chartConfig } from './chartConfig';

const DataTrendGraph = ({ data }) => {
  // console.log('data', data);
  // Extracting values and dates
  const values = data.map((entry) => entry.value);
  const dates = data.map((entry) => entry.date);

  // Configure the series
  const graphSeries = [
    {
      name: 'Parameters',
      data: values,
    },
  ];
  // Configure the chart options
  const graphOptions = {
    ...chartConfig,
    colors: ['#31572C'],
    xaxis: {
      ...chartConfig.xaxis,
      categories: dates,
      show: false,
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  return data.length > 0 ? (
    <Chart
      width={'100%'}
      height={180}
      options={graphOptions}
      series={graphSeries}
      type="line"
    />
  ) : (
    <div className="flex items-center justify-center h-[200px]">
      <p className="text-center text-gray-500">No trend data available</p>
    </div>
  );
};

export default DataTrendGraph;
