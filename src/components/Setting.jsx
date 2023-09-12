import React from 'react';
import { AiOutlinePercentage } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';


function InputGroup1({
  label,
  label2,
  name,
  value,
  onChange,
  decoration,
  placeholder,
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
    <div className="w-full sm:w-1/2 flex flex-col">
      <span className="text-md font-medium">{label}</span>
      <span className="text-md">{label2}</span>
    </div>
    <div className="relative w-full sm:w-52 flex items-center">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        aria-label={label}
        className={`block w-full sm:w-44 px-3 py-2 text-gray-500 bg-white border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded transition-colors duration-300 ${
          disabled ? 'bg-gray-200' : ''
        } ${inputClassName}`}
        disabled={disabled}
      />
      {decoration && (
        <div
          className={`absolute top-1/2 -right-1 transform -translate-y-1/2 flex items-center rounded-tl-none rounded-bl-none rounded px-3 py-3 text-gray-600 border bg-slate-300 border-gray-400 border-l-0 ${
            disabled ? 'bg-gray-200' : ''
          } ${decorationClassName}`}
        >
          {decoration}
        </div>
      )}
    </div>
  </div>
  );
}


function InputGroup2({
  label,
  label2,
  name,
  value,
  onChange,
  placeholder,
  inputClassName = "",
  decorationClassName = "",
  disabled,
}) {
  return (
    <div className="flex items-center gap-4">
    <div className="w-1/2 flex flex-col">
      <span className="text-md font-medium">
        {label}
      </span>
      <span className="text-md">
        {label2}
      </span>
    </div>
    <div className="relative w-52">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type="number"
        placeholder={placeholder}
        aria-label={label}
        className={`block absolute top-1/2 -right-1 transform -translate-y-1/2 w-44 px-3 py-2 text-gray-500 bg-white border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded transition-colors duration-300 ${
          disabled ? "bg-gray-200" : ""
        } ${inputClassName}`}
        disabled={disabled}
      />
      <select
        id={`${name}-select`} 
        name={name}
        value={value}
        onChange={onChange}
        className={`block absolute top-1/2 -left-1 transform -translate-y-1/2 rounded-l px-3 py-2 text-gray-500 bg-slate-300 border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded-r-none ${
          disabled ? "bg-gray-200" : ""
        } ${decorationClassName}`}
        disabled={disabled}
      >
        <option value="option1">Rp</option>
        <option value="option2">$</option>
      </select>
    </div>
  </div>
  
  );
}

function Setting() {
  return (
    <div>
    <div className="bg-white border-2 rounded-lg p-5 sm:p-20 h-Setting relative">
      <div className="relative right-0 sm:right-20 -top-0 sm-top-20 flex flex-col w-full p-5 gap-8 rounded-md">
      <InputGroup1
        name="RASR"
        placeholder="5"
        label="Reach Amount Spent Ratio (RASR)"
        label2="Recommended value > 5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup1
        name="CTR"
        placeholder="1.5"
        label="Click Through Rate (CTR)"
        label2="Recommended value > 1.5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup1
        name="OCLP"
        placeholder="80"
        label="Outbound Click Landing Page (OCLP)"
        label2="Recommended value > 1.5%"
        decoration={<AiOutlinePercentage size="1rem" />}
      />
      <InputGroup1
        name="ROAS"
        placeholder="3.0"
        label="Return on AD Spent (ROAS)"
        label2="Recommended value > 3.0x"
        decoration={<AiOutlineClose size="1rem" />}
      />


<div className="sm:flex">
            <InputGroup2
              name="CPC"
              placeholder="5.000"
              label="Cost per Click (CPC)"
              label2="Recommended value > Rp. 5.000"
              decoration={<AiOutlineClose size="2rem" />}
            />
            <InputGroup2
              name="CPC"
              placeholder="1.000"
              label="Cost per Click (CPC)"
              label2="Recommended value > Rp. 1.000"
              decoration={<AiOutlineClose size="1rem" />}
            />
          </div>

      

    </div>

    <button className="absolute bottom-0 right-0 mb-4 mr-4 bg-sky-600 px-4 py-1 rounded-md text-white">
          Save
        </button>
        </div>
    </div>
  );
}

export default Setting;
