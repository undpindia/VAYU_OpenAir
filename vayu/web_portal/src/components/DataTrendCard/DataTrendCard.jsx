import DataTrendGraph from '../DataTrendGraph/DataTrendGraph';
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip';

const DataTrendCard = ({ data, graphData }) => {
  // const firstTwoPoints = graphData.slice(0, 2);
  return (
    <div className="flex flex-col items-start p-3 bg-white rounded-lg shadow-md border">
      <div className="flex justify-start items-center space-x-2 mb-0">
        <div className="w-12 h-12 bg-[#EDF6EC] rounded-md flex items-center justify-center">
          <img src={data.icon} alt="icon" className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{data.data}</h2>
          <p className="text-sm text-gray-500">{data.desc}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:justify-between w-full mb-0">
        <div className="w-full md:w-[40%] text-center mb-0 md:mb-0">
          <p className="text-sm text-gray-500 break-words">AVG</p>
          <p className="text-4xl font-bold text-gray-900 break-words">
            {/* {data.avg > 0 ? data.avg : 'N/A'}  */}
            {data?.avg}
          </p>
          <span className="text-sm text-gray-500 break-words font-semibold">
            {data.unit}
          </span>
        </div>

        <div className="w-full md:w-[60%] h-full">
          <DataTrendGraph data={graphData} />
        </div>
      </div>

      <div className="flex flex-wrap w-full items-start">
        <div className="flex-1 min-w-[50px] text-center mb-1">
          <p className="inline-flex font-medium text-black text-sm">Min</p>
          <span style={{ position: 'absolute', width: 15, height: 15 }}>
            <CustomTooltip dataTooltip="Minimum" />
          </span>
          <p className="text-gray-900 break-words">
            {/* {data.min > 0 ? data.min : 'N/A'} */}
            {data.min}
          </p>
        </div>
        <div className="flex-1 min-w-[50px] text-center mb-1">
          <p className="inline-flex font-medium text-black text-sm">Max</p>
          <span style={{ position: 'absolute', width: 15, height: 15 }}>
            <CustomTooltip dataTooltip="Maximum" />
          </span>
          <p className="text-gray-900 break-words">
            {/* {data.max > '0k' ? data.max : 'N/A'} */}
            {data.max}
          </p>
        </div>
        <div className="flex-1 min-w-[50px] text-center mb-1">
          <p className="inline-flex font-medium text-black text-sm">Med</p>
          <span style={{ position: 'absolute', width: 15, height: 15 }}>
            <CustomTooltip dataTooltip="Median" />
          </span>
          <p className="text-gray-900 break-words">
            {/* {data.med > 0 ? data.med : 'N/A'} */}
            {data.med}
          </p>
        </div>
        <div className="flex-1 min-w-[50px] text-center mb-1">
          <p className="inline-flex font-medium text-black text-sm">Stdev</p>
          <span style={{ position: 'absolute', width: 15, height: 15 }}>
            <CustomTooltip dataTooltip="Standard Deviation" />
          </span>
          <p className="text-gray-900 break-words">
            {/* {data.stdev > 0 ? data.stdev : 'N/A'} */}
            {data.stdev}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataTrendCard;
