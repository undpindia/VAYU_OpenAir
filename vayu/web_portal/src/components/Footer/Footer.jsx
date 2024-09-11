const Footer = () => {
  return (
    <footer className="h-10 w-full flex justify-between items-center bg-white pb-6 footer-section">
      <div className="flex flex-col">
        <div className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343]">
          &copy; VAYU 2024 - All rights reserved
        </div>
        {/* <div className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343]">
          Maintained & managed by mistEO Pvt. Ltd.
        </div> */}
      </div>

      <div className="flex space-x-4">
        {/* <a
          href="/terms"
          className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343] hover:underline"
        >
          Terms & Conditions
        </a>
        <a
          href="/privacy"
          className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343] hover:underline"
        >
          Privacy
        </a> */} 
        <span className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343]"> Developed by 
         {' '}
         <a href="https://misteo.co/" target="_blank"
           className="font-normal text-[20px] leading-[25.1px] text-justify text-[#434343] hover:underline"
        >
           mistEO
        </a> </span>
       
      </div>
    </footer>
  );
};

export default Footer;
