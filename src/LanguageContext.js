import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english'); 

  const toggleLanguage = () => {
    setSelectedLanguage(selectedLanguage === 'english' ? 'indonesia' : 'english');
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
