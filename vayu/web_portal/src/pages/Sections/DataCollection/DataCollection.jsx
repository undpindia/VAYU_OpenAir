import Image from '../../../assets/images/common/dc.svg';

const DataCollection = () => {
  return (
    <div className="w-full flex justify-center items-start flex-col">
      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify invisible">
        <span className="font-semibold">Activity 1 :</span> Identification of
        Risk Zones: Use primary and secondary air quality data to identify
        high-risk zones within cities.
      </span>

      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <span className="font-semibold">Activity 1 :</span> Identification of
        Risk Zones: Use primary and secondary air quality data to identify
        high-risk zones within cities.
      </span>

      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <span className="font-semibold">Activity 2 :</span> Training Citizen
        Scientists - Recruit and train 100 citizen scientists (50 from each
        city) to collect air quality data.
      </span>

      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <span className="font-semibold">Activity 3 :</span> Data Collection -
        Utilize IoT-based low-cost air quality sensors and the VAYU Mobile App
        for data collection.
        <ul className="list-disc pl-5 mt-2">
          <li className="font-normal text-[18px] leading-[28.16px] text-justify">
            Install static sensors in major emission zones identified via
            satellite city maps.
          </li>
          <li className="font-normal text-[18px] leading-[28.16px] text-justify">
            Equip citizen scientists with mobile low-cost IoT sensors to measure
            hyperlocal air quality in high emission areas.
          </li>
          <li className="font-normal text-[18px] leading-[28.16px] text-justify">
            Collect data on pollutants (CO, CO2, NOx, PM2.5, PM10) every 15
            seconds and transfer via WiFi/Bluetooth to the Mobile App.
          </li>
          <li className="font-normal text-[18px] leading-[28.16px] text-justify">
            Upload collected data along with location information to UNDP’s VAYU
            API server.
          </li>
        </ul>
      </span>

      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <span className="font-semibold">Activity 4:</span> Data Processing -
        Process collected data for analysis and insights.
      </span>

      <span className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <span className="font-semibold">Activity 5:</span> Use Case Pathways -
        Collaborate with research partners (e.g., University of Nottingham) for
        data modeling using open data sources (satellite data from ESA/NASA, IoT
        data).
        <ul className="list-disc pl-5 mt-2">
          <li className="font-normal text-[18px] leading-[28.16px] text-justify">
          Establish data pipelines and automated data modeling to create India&#39;s first real-time digital
          stack on emissions, covering all emission sources in targeted cities.
          </li>
        </ul>
      </span>

      {/* <div className="font-normal text-[20px] leading-[28.16px] p-[20px] text-justify">
        <img src={Image} alt="Data Collection" className="w-full" />
      </div> */}
    </div>
  );
};

export default DataCollection;
