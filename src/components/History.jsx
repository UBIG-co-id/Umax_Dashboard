import React, { useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";

const History = () => {
  const [DataV2, DataSelect2] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [buka, setBuka] = useState(false);
  const [resultsFound, setResultsFound] = useState(true); 

  const dumySementara = [
    { name: "CONTOH 1" },
    { name: "CONTOH 2" },
    { name: "CONTOH 3" },
  ];

  const DumyData = true;
  useEffect(() => {
    if (DumyData) {
      DataSelect2(dumySementara);
    }
  }, [DumyData]);

  useEffect(() => {
    // Cek apakah ada hasil pencarian
    const isResultFound = DataV2 && DataV2.some(country =>
      country.name.toLowerCase().startsWith(inputValue)
    );
    setResultsFound(isResultFound);
  }, [DataV2, inputValue]);

  return (
   <>
   
   </>
  );
};

export default History;
