import React from 'react';
import Downarrow from '../../../assets/img/screen-icons/arrow-down.svg'; 

const DropdownSignup = ({ options, onSelect, disabled, text }) => {
  return (
    <div className="signup-select-wrapper">
    <select className='signup-select' onChange={(e) => onSelect(e.target.value)} disabled={disabled}>
      <option value="state" disabled selected>
        {text}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    <div className="arrow">
        <img src={Downarrow} alt="Dropdown Arrow" />
      </div>
    </div>
  );
};

export default DropdownSignup;