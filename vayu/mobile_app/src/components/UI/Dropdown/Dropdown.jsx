import React from 'react';
import Downarrow from '../../../assets/img/screen-icons/arrow-down.svg'; 

const Dropdown = ({ options, onSelect, disabled }) => {
  return (
    <div className="select-wrapper">
    <select className='select' onChange={(e) => onSelect(e.target.value)} disabled={disabled}>
      <option value="Select Category" disabled selected>
        Category
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

export default Dropdown;