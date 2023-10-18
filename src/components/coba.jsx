<div className='flex mx-5 mt-10 gap-10 justify-around'>
<h1 className='text-gray-700 font-medium'>Language:</h1>
<div className='relative left-1'>
  <div className="custom-select">
    <select onChange={toggleLanguage} value={selectedLanguage}>
      <option value="english">
        <img src={us} className="w-6 h-6" alt="English Flag" />
        English
      </option>
      <option value="indonesia">
        <img src={indonesia} className="w-6 h-6" alt="Indonesia Flag" />
        Indonesia
      </option>
    </select>
  </div>
</div>
</div>