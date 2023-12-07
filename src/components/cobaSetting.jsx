import React, { useState, useEffect } from 'react';
import { AiOutlinePercentage, AiOutlineClose } from 'react-icons/ai';

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
    <div className="flex md:items-center gap-4 flex-row max-md:flex-col">
      <div className="w-1/2  max-md:w-max  flex flex-col">
        <span className="text-md font-medium">
          {label}
        </span>
        <span className="text-md">
          {label2}
        </span>
      </div>
      <div className="relative w-52 ">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          placeholder={placeholder}
          aria-label={label}
          className={`block w-full px-3 py-2 text-gray-500 bg-white border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded transition-colors duration-300 ${disabled ? "bg-gray-200" : ""
            } ${inputClassName}`}
          disabled={disabled}
        />
        <div
          className={`absolute top-1/2 -right-1 transform -translate-y-1/2 flex items-center rounded-tl-none rounded-bl-none rounded px-3 py-3 text-gray-600 border bg-slate-300 border-gray-400 border-l-0 ${disabled ? "bg-gray-200" : ""
            } ${decorationClassName}`}
        >
          {decoration}
        </div>
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
    <div className="flex md:items-center gap-4 flex-row max-md:flex-col">
      <div className="relative bottom-2 w-1/2  max-md:w-max  flex flex-col">
        <span className="text-md font-medium">
          {label}
        </span>
        <span className="text-md">
          {label2}
        </span>
      </div>
      <div className="relative pt-5 w-52">
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          placeholder={placeholder}
          aria-label={label}
          className={`block absolute top-1/2 -right-1 transform -translate-y-1/2 w-44 px-3 py-2 text-gray-500 bg-white border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded transition-colors duration-300 ${disabled ? "bg-gray-200" : ""
            } ${inputClassName}`}
          disabled={disabled}
        />
        <select
          id={`${name}-select`}
          name={name}
          value={value}
          onChange={onChange}
          className={`block absolute top-1/2 -left-1 transform -translate-y-1/2 rounded-l px-3 py-2 text-gray-500 bg-slate-300 border border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 appearance-none rounded-r-none ${disabled ? "bg-gray-200" : ""
            } ${decorationClassName}`}
          disabled={disabled}
        >
          <option value="option1">Rp</option>
          {/* <option value="option2" disabled>$</option> */}
        </select>
      </div>
    </div>
  );
}

const baseUrl = 'https://umaxx-1-v8834930.deta.app';
const Setting = () => {
  const [metricsData, setMetricsData] = useState({
    RASR: '',
    CTR: '',
    OCLP: '',
    ROAS: '',
    CPC: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `${baseUrl}/metrics-settings-by?campaign_id=656404d2d0fe018977020031`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
          console.log('berhasil ambil setting',response)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setMetricsData({
          RASR: data.RASR || '',
          CTR: data.CTR || '',
          OCLP: data.OCLP || '',
          ROAS: data.ROAS || '',
          CPC: data.CPC || '',
        });
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (name, newValue) => {
    setMetricsData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  return (
    <div>
      <div className='bg-white border-2 rounded-lg p-20 h-Setting relative'>
        <div className="relative right-20 -top-20 flex flex-col w-full p-5 gap-8 rounded-md">
          <InputGroup1
            name="RASR"
            label="Reach Amount Spent Ratio (RASR)"
            label2="Nilai yang direkomendasikan > 5%"
            decoration={<AiOutlinePercentage size="1rem" />}
            value={metricsData.RASR}
            onChange={(e) => handleInputChange('RASR', e.target.value)}
          />
          <InputGroup1
            name="CTR"
            label="Click Through Rate (CTR)"
            label2="Nilai yang direkomendasikan > 1.5%"
            decoration={<AiOutlinePercentage size="1rem" />}
            value={metricsData.CTR}
            onChange={(e) => handleInputChange('CTR', e.target.value)}
          />
          <InputGroup1
            name="OCLP"
            label="Outbound Click Landing Page (OCLP)"
            label2="Nilai yang direkomendasikan > 80%"
            decoration={<AiOutlinePercentage size="1rem" />}
            value={metricsData.OCLP}
            onChange={(e) => handleInputChange('OCLP', e.target.value)}
          />
          <InputGroup1
            name="ROAS"
            label="Return on AD Spent (ROAS)"
            label2="Nilai yang direkomendasikan > 3.0x"
            decoration={<AiOutlineClose size="1rem" />}
            value={metricsData.ROAS}
            onChange={(e) => handleInputChange('ROAS', e.target.value)}
          />

          <InputGroup2
            name="CPC"
            label="Cost per Result (CPR)"
            label2="Nilai yang direkomendasikan < Rp 5.000"
            value={metricsData.CPC}
            onChange={(e) => handleInputChange('CPC', e.target.value)}
          />
          <InputGroup2
            name="CPC"
            label="Cost per Click (CPC)"
            label2="Nilai yang direkomendasikan < Rp 1.000"
            value={metricsData.CPC}
            onChange={(e) => handleInputChange('CPC', e.target.value)}
          />
        </div>
        <button className='absolute bottom-0 right-0 mb-4 mr-4 bg-sky-600 px-4 py-1 rounded-md text-white'>
          Simpan
        </button>
      </div>
    </div>
  );
};

export default Setting;
