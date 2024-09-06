const AboutUs = () => {
  const statsData = [
    { id: 1, title: '2', subtitle: 'Cities' },
    { id: 2, title: '100+', subtitle: 'Sensors' },
    { id: 3, title: '150+', subtitle: 'Volunteers' },
    { id: 4, title: '1000+', subtitle: 'Records collected' },
    { id: 5, title: '~10M', subtitle: 'Data points' },
  ];

  return (
    <div className="w-full flex justify-center items-start flex-col sm:relative sm:top-[5%] md:mt-[40%] lg:mt-[10%]">
      <h1 className="font-bold text-[20px] md:text-[14px] md:leading-[20px]  lg:text-[24px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[10px] p-[10px] text-justify">
        Hyperlocal Mapping of Air Pollution and GHG emissions
      </h1>

      <span className="font-normal text-[20px] md:text-[14px] md:leading-[20px]  lg:text-[24px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[10px] p-[10px] text-justify">
        Hyperlocal Mapping of Air Pollution project is part of the Climate &amp;
        Energy Lacuna Fund cohort of 2023.
      </span>

      <span className="font-normal text-[20px] md:text-[14px] md:leading-[20px]  lg:text-[24px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[10px] p-[10px] text-justify">
        Under this initiative, a novel approach is employed by leveraging
        citizen scientists and IoT-based low-cost sensors to collect hyperlocal
        air quality data. This data is used to identify pollution sources and
        risk zones, facilitating targeted actions by regulatory authorities.
      </span>

      <span className="font-normal text-[20px] md:text-[14px] md:leading-[20px]  lg:text-[24px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[10px] p-[10px] text-justify">
        To showcase data outreach, the project features the VAYU Android-based
        application and the VAYU citizen portal digital stack, which support
        targeted interventions and customized solutions backed by AI/ML
        algorithms. These tools potentially develop new approaches in air
        pollution management while reducing public investment costs.
      </span>

      <div className="w-full">
        <div className="py-2 grid grid-cols-5 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 initial-dialog__mobile-grid">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-start"
            >
              <div className="text-[20px] md:text-[14px] md:leading-[20px] lg:text-[30px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[10px] p-[10px] text-justify font-semibold text-custom-light-green">
                {stat.title}
              </div>
              <div
                className="text-lg text-center md:text-[14px] md:leading-[20px]"
                style={{ color: '#626D7D' }}
              >
                {stat.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
