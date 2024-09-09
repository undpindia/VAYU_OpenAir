const Feedback = () => {
  return (
    <div className="w-full flex flex-col items-start p-0 space-y-6">
      <span className="font-normal text-[20px] sm:p-0 md:text-[14px] md:leading-[20px]  lg:text-[24px] lg:leading-[28.16px] leading-[28.16px] md:p-2 lg:p-[20px] text-justify">
        If you have any questions or comments about Vayu, please leave a comment
        on the Discussions tab of our <span></span>
        <a
          href="https://github.com/undpindia/VAYU_OpenAir"
          target="_blank"
          className="font-normal text-decoration-line: underline"
        >
          {' '}
          GitHub repository
        </a>{' '}
        or send an email to{' '}
        <a
          href="mailto:acceleratorlab.in@undp.org"
          className="font-normal text-decoration-line: underline"
        >
          {' '}
          acceleratorlab.in@undp.org{' '}
        </a>
      </span>
    </div>
  );
};

export default Feedback;
