import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "../../../assets/img/screen-icons/calendar.svg";

const Datepicker = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onSelectDate(date); 
    toggleDatePicker();
  };

  const toggleDatePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event) => {
    const numericKeys = /^[0-9-]*$/;
    if (!(numericKeys.test(event.key) || event.key === "Backspace")) {
      event.preventDefault();
    } else if (event.key === "Backspace" && event.target.value === "" && selectedDate !== null) {
      handleDateChange(null);
    }
  };
  
  return (
    <div className="calendar-wrapper" ref={datePickerRef}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText="Date of Birth"
        className="form-control"
        open={isOpen}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={60}
        maxDate={new Date()}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
      />
      <span className="calender-icon">
        <img src={CalendarIcon} alt="calendar-icon" onClick={toggleDatePicker} />
      </span>
    </div>
  );
};

export default Datepicker;
