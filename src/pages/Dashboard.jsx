import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ContainerCard from "../components/ContainerCard";
import { BiRefresh } from "react-icons/bi";
import CardInfo from "../components/CardInfo";
import Chart from "../components/Chart";
import Card from "../components/Card";
import Setting from "../components/Setting";
import Metrics from "../components/Metrics";
import History from "../components/History";
import { FiAlertTriangle } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";
import { NotFound, google, meta, tiktok } from "../assets";
import "../styles.css";
import { setActiveItem, updateSelectedName } from "../components/Sidebar";
import { useLanguage } from "../LanguageContext"; // Import the useLanguage hook
import Translation from "../translation/Translation.json";
import axios from "axios";
import { formattedKoma1 } from "../helpers/formattedKoma1";
import { useNavigate } from "react-router-dom";
// import { getColorBySwaggerData } from "../Component/CardInfo";

const Dashboard = () => {
  const { selectedLanguage } = useLanguage(); // Get selectedLanguage from context
  const translations = Translation[selectedLanguage];

  const [metricsData, setMetricsData] = useState([]);
  const [campaignIdFromResponse, setCampaignIdFromResponse] = useState("");
  const [activeTab, setActiveTab] = useState("performance");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [data, setData] = useState([]);
  const [barr, setBarr] = useState([]);

  const [campaignId, setCampaignId] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [campaign_id, setMetricId] = useState("");
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("last-week");
  const [chartUrl, setChartUrl] = useState("");
  const [suggestionData, setSuggestionData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getColorBySwaggerData = (swaggerColor) => {
    switch (swaggerColor) {
      case 'Success':
        return 'text-green-500';
      case 'Danger':
        return 'text-red-500';
      // Tambahkan lebih banyak kasus sesuai kebutuhan
      default:
        return 'text-gray-500';
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const id = campaign_id;
      console.log("ID CAMPAIGN", id);

      try {
        
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `https://umaxxnew-1-d6861606.deta.app/suggestions?campaign_id=${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.Data;
          setSuggestionData(data);
        } else {
          console.error("Failed to fetch suggestion data from API");
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching suggestion data",
          error
        );
      }
    };

    fetchSuggestions();
  }, [setSuggestionData, campaign_id]);

  // wrap function pakai useCallback karena function ini dipakai di dalam useEffect
  const updateChartUrl = useCallback(
    (timeframe) => {
      if (selectedName && campaign_id) {
        const baseUrl = "https://umaxxnew-1-d6861606.deta.app/"; // URL dasar

        // Ganti ini sesuai kebutuhan
        const newUrl = `${baseUrl}${timeframe}?campaign_id=${campaign_id}`;
        setChartUrl(newUrl);

        console.log(`New URL: ${newUrl}`);
      }
    },
    [setChartUrl, selectedName, campaign_id]
  );

  /*
  const fetchHistoryData = async (campaign_id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiUrl = `https://umaxxnew-1-d6861606.deta.app/history?campaign_id=${campaign_id}`; // Updated URL with campaign_id

      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        // Handle non-OK status here
        const errorData = await response.json();
        setError(errorData.detail);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Terjadi kesalahan dalam mengambil data.");
    }
  };
  */

  useEffect(() => {
    if (campaign_id) {
      updateChartUrl(selectedTimeframe);
    } else {
      setSelectedData(null);
    }
  }, [campaign_id, setSelectedData, updateChartUrl, selectedTimeframe]);

  const handleItemClick = (item) => {
    // setSelectedTimeframe(item);

    setActiveItem(item.campaign_name);
    setSelectedName(item.campaign_name);
    setSuggestionData(suggestionData);
    setSelectedData(item);
    updateChartUrl(selectedTimeframe);
  };

  const updateSelectedName = (item) => {
    setSelectedName(item);
    console.log("Selected Name:", item);
  };

  const [state, setState] = useState({
    toggleNavbar: false,
  });

  const toggleSidebar = () => {
    setState({ ...state, toggleNavbar: !state.toggleNavbar });
  };

  const contentStyles = {
    marginLeft: state.toggleNavbar ? "72px" : "0",
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // data metrics
  useEffect(() => {
    const metricsChart = async () => {
      try {
        setLoading(true);
        const id = campaign_id;
        const token = localStorage.getItem("jwtToken");

        // pakai value dari selectedTimeFrame agar lebih dinamis
        // default value dari selectedTimeFrame: last-week
        const apiUrl = `https://umaxxnew-1-d6861606.deta.app/metrics-7?campaign_id=${id}`;

        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const barr = await response.json();
          setBarr(barr.Data);

          // Ambil campaign_id dari data (misalnya, dari item pertama).
          const metricIdFromData =
            barr.Data.length > 0 ? barr.Data[0].campaign_id : "";

          // Set campaign_id ke dalam state.
          setMetricId(metricIdFromData);
        } else {
          console.error("Gagal mengambil metrics");
        }
        setLoading(false);
        
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        setLoading(false);
      }
    };

    metricsChart();
  }, [setMetricId, setBarr, campaign_id, selectedTimeframe]);

  const metrixDatas = [
    {
      title: translations["Amount Spent"],
      value: selectedData
        ? selectedData.amountspent
        : barr.map((dayData) => dayData.amountspent), // Ambil semua amountspent dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.amountspent.replace(/\D/g, "")),
      })),
      persen: 2.0,
      description: "Total Amount spent compared to last 7 day",
      descModal:
        "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: translations["Reach"],
      value: selectedData
        ? selectedData.reach
        : barr.map((dayData) => dayData.reach), // Ambil semua reach dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.reach.replace(/\D/g, "")),
      })),
      persen: 2.0,
      description: "Total Amount spent compared to last 7 day",
      descModal:
        "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: translations["Impression"],
      value: selectedData
        ? selectedData.impressions
        : barr.map((dayData) => dayData.impressions), // Ambil semua impressions dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.impressions.replace(/\D/g, "")),
      })),
      persen: 2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Jumlah iklan kita ditayangkan. Bedanya dengan Reach, user yang sama bisa dihitung melihat iklan yang sama lebih dari satu kali",
    },
    {
      title: translations["Frequency"],
      value: selectedData
        ? selectedData.frequency
        : barr.map((dayData) => dayData.frequency), // Ambil semua frequency dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.frequency.replace(/\D/g, "")),
      })),
      persen: -2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Berapa kali rata-rata seorang user melihat iklan kita ditampilkan dalam rentang waktu tertentu. Dihitung dari jumlah Impressions dibagi dengan jumlah Reach",
    },
    {
      title: translations["Reach Amount Spent Ratio"],
      value: selectedData
        ? selectedData.rar && selectedData.rar.value // Check if selectedData.rar is defined
        : barr.map((dayData) => dayData.rar && dayData.rar.value), // Check if dayData.rar is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.rar && dayData.rar.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total Reach Amount Spent ratio compared to last 7 day",
      descModal:
        "Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut",
    },
    {
      title: translations["Cost Per Click"],
      value: selectedData
        ? selectedData.cpc && selectedData.cpc.value // Check if selectedData.cpc is defined
        : barr.map((dayData) => dayData.cpc && dayData.cpc.value), // Check if dayData.cpc is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.cpc && dayData.cpc.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total Cost per Click compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap Link Clicks. Dihitung dari jumlah Amount Spent dibagi dengan jumlah Link Clicks",
    },
    {
      title: translations["Click Through Rate"],
      value: selectedData
        ? selectedData.ctr && selectedData.ctr.value // Check if selectedData.ctr is defined
        : barr.map((dayData) => dayData.ctr && dayData.ctr.value), // Check if dayData.ctr is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.ctr && dayData.ctr.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total Click Through Rate compared to last 7 day",
      descModal:
        "Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan. Dihitung dari jumlah Link Click dibagi dengan jumlah Impressions",
    },
    {
      title: translations["Outbont Click Landing Page"],
      value: selectedData
        ? selectedData.oclp && selectedData.oclp.value // Check if selectedData.oclp is defined
        : barr.map((dayData) => dayData.oclp && dayData.oclp.value), // Check if dayData.oclp is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.oclp && dayData.oclp.value), // No need for .replace here
      })),
      persen: -2.0,
      description: "Total OCLP compared to last 7 day",
      descModal:
        "Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan",
    },
    {
      title: translations["Cost Per Result"],
      value: selectedData
        ? selectedData.cpr && selectedData.cpr.value // Check if selectedData.cpr is defined
        : barr.map((dayData) => dayData.cpr && dayData.cpr.value), // Check if dayData.cpr is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.cpr && dayData.cpr.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total Cost per Result compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan",
    },
    {
      title: translations["Add To Cart"],
      value: selectedData
        ? selectedData.atc
        : barr.map((dayData) => dayData.atc), // Ambil semua atc dari barr
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.atc.replace(/\D/g, "")),
      })),
      persen: 2.0,
      description: "Total Add to Cart compared to last 7 day",
      descModal:
        "Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online",
    },
    {
      title: translations["Return on Ad Spent"],
      value: selectedData
        ? selectedData.roas && selectedData.roas.value // Check if selectedData.roas is defined
        : barr.map((dayData) => dayData.roas && dayData.roas.value), // Check if dayData.roas is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.roas && dayData.roas.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total ROAS to last 7 day",
      descModal:
        "Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan",
    },
    {
      title: translations["Real ROAS"],
      value: selectedData
        ? selectedData.real_roas && selectedData.real_roas.value // Check if selectedData.real_roas is defined
        : barr.map((dayData) => dayData.real_roas && dayData.real_roas.value), // Check if dayData.real_roas is defined
      chart: barr.map((dayData) => ({
        name: dayData.TglUpdate,
        value: parseFloat(dayData.real_roas && dayData.real_roas.value), // No need for .replace here
      })),
      persen: 2.0,
      description: "Total Real ROAS to last 7 day",
      descModal:
        "Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan",
    },
  ];

  /*
  - Fungsi dibawah dipindahin ke folder /helpers biar reusable, kalo mau pake tinggal import aja
  //ubah integer dari BE ke rupiah
  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  //ubah nilai float dari BE ke 1 angka dibelakang koma
  const formattedKoma1 = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  //ubah nilai float dari BE ke format indonesia
  const formattedNumber = (number) =>
    number.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });*/

  //prettier-ignore
  //format value metrix
  const formatValueMetrix = (metrixData) => {
    const formatMap = {
      "Amount Spent": (value) => `${value}`,
      "Cost Per Click": (value) => `${value}`,
      "Cost Per Result": (value) => `${value}`,
      "Reach": (value) => `${value}`,
      "Impression": (value) => `${value}`,
      "Frequency": (value) => `${value}`,
      "Return on Ad Spent": (value) => `${value}`,
      "Real ROAS": (value) => `${value}`,
      "Reach Amount Spent Ratio": (value) => `${value}`,
      "Outbont Click Landing Page": (value) => `${value}`,
      "Click Through Rate": (value) => `${value}`,
      "Add To Cart": (value) => `${value}`,
    };

    const formatFunction = formatMap[metrixData.title];

    if (formatFunction) {
      return formatFunction(metrixData.value);
    }

    return metrixData.value;
  };

  //prettier-ignore
  //format style description
  const formatDescMetrix = (metrixData) => {
    const formatMap = {
      "Amount Spent":
        (description) => (
          <p
            style={{
              fontSize: "10.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        ),
      "Frequency": (description) => (
        <p
          style={{
            fontSize: "11px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Reach Amount Spent Ratio":
        (description) => (
          <p
            style={{
              fontSize: "9.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        ),
      "Cost per Click":
        (description) => (
          <p
            style={{
              fontSize: "10.4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        ),
      "Click Through Rate":
        (description) => (
          <p
            style={{
              fontSize: "9.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        ),
      "Outbont Click Landing Page": (description) => (
        <p
          style={{
            fontSize: "11.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
      "Cost per Result": (description) => (
        <p
          style={{
            fontSize: "10.1px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
      ),
    };

    const formatFunction = formatMap[metrixData.title];

    if (formatFunction) {
      return formatFunction(metrixData.description);
    }

    return metrixData.description;
  };

  const handleTimeframeChange = (event) => {
    const selectedTimeframe = event.target.value;
    setSelectedTimeframe(selectedTimeframe);
    updateChartUrl(selectedTimeframe);
  };

  // const getSuggestion = (suggestion) => {
  //   let suggestionStyle = {}; // Objek gaya status

  //   // CASE UNTUK STATUS
  //   switch (suggestion) {
  //     case succes:
  //         suggestionStyle = {
  //         backgroundColor: "#DFFFDF",
  //         color: '#00A600',
  //         border: '0.3px solid #00CA0090',
  //         padding: '5px 13px',
  //         fontSize: "12px",
  //         borderRadius: '6px',
  //         fontWeight: '500', 
  //       };
  //       return (
  //         <span style={statusStyle}>Active</span>
  //       );
  //     case 2:
  //       statusStyle = {
  //         backgroundColor: "#FFF2E8",
  //         color: '#D4380D', 
  //         border: '0.3px solid #FF0000',
  //         padding: '5px 15px',
  //         fontSize: "12px",
  //         borderRadius: '6px',
  //         fontWeight: '500', 
  //       };
  //       return (
  //         <span style={statusStyle}>Deactive</span>
  //       );

  //     default:
  //       return "Unknown";
  //   }
  // }
  // const getColorFromSwagger = (swaggerColor) => {
  //   switch (swaggerColor) {
  //     case "Danger":
  //       return "red";
  //     case "Warning":
  //       return "yellow";
  //     case "Success":
  //       return "green";
  //     default:
  //       return "white"; // Default color if not matched
  //   }
  // };

  // const getColor = (value) => {
  //   if (value && value.includes("danger")) {
  //     return "text-red-500"; // Warna merah untuk "danger"
  //   } else if (value && value.includes("warning")) {
  //   } else if (value && value.includes("success")) {
  //     return "text-green-500"; // Warna hijau untuk "success"
  //   } else {
  //     return "text-gray-500"; // Warna default jika tidak ada kategori yang sesuai
  //   }
  // };

  const renderContent = () => {
    switch (activeTab) {
      case "performance":
        return (
          <div>
            {/* bagian filter */}
            <div className="flex justify-end">
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 text-gray-500">
                  <BiRefresh size={25} />
                  Feb 4, 20:12
                </div>
                <select
                  defaultValue="last-week"
                  name=""
                  id=""
                  className="focus:outline-none p-2 px-5 border border-gray-300 text-gray-500 rounded-md"
                  onChange={handleTimeframeChange}
                  value={selectedTimeframe}
                >
                  <option hidden value="">
                    Filter Data
                  </option>
                  <option value="last-week">{translations["Last Week"]}</option>
                  <option value="last-month">
                    {translations["Last Month"]}
                  </option>
                  <option value="last-year">{translations["Last Year"]}</option>
                </select>
              </div>
            </div>
            {/* end */}

            {/* bagian content */}

            <div>
              <div className="flex flex-col md:flex-row mt-5 md:gap-5">
                <div className="md:w-8/12 w-full flex flex-col flex-wrap h-full gap-5">
                  {/* Card Info */}
                  <CardInfo
                    title={translations["Amount Spent"]}
                    value={selectedData ? selectedData.amountspent : "-%"}
                    color="text-sky-500"// Sesuaikan dengan properti yang sesuai
                    popupContent="Jumlah total biaya yang kita keluarkan untuk pemasangan iklan"
                  />
                  <CardInfo
                    title={translations["Reach Amount Spent Ratio"]}
                    value={selectedData ? selectedData.rar : "-%"}
                    color="text-yellow-500"
                    // color={getColorBySwaggerData(selectedData ? selectedData.rar.color : '')} // Sesuaikan dengan properti yang sesuai
                    popupContent="Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut"
                  />
                  <CardInfo
                    title={translations["Click Through Rate"]}
                    value={selectedData ? selectedData.ctr : "-%"}
                    color="text-green-500"
                    popupContent="Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan"
                  />
                  <CardInfo
                    title="OCLP"
                    value={selectedData ? selectedData.oclp : "-%"}
                    // color="text-sky-500"
                    popupContent="Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan"
                  />
                </div>

                {/* Chart */}
                <div className="flex justify-between flex-col w-full">
                  <div className="w-full mt-1 flex flex-col">
                    <Chart chartUrl={chartUrl} />
                  </div>

                  {selectedData && (
                    <div className="grid grid-cols-1 grid-rows-1 w-full xl:grid-cols-4 lg:grid-cols-2 gap-4 justify-center mx-auto xl:-mt-[13px]">
                      <div className="card-container ">
                        <CardInfo
                          title="CPR"
                          value={selectedData.cpr}
                          // color="text-sky-500"
                          popupContent="Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan"
                        />
                      </div>
                      <div className="card-container">
                        <CardInfo
                          title="ATC"
                          value={selectedData.atc}
                          popupContent="Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online"
                        />
                      </div>
                      <div className="card-container">
                        <CardInfo
                          title="ROAS"
                          value={selectedData.roas}
                          // color="text-sky-500"
                          popupContent="Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan"
                        />
                      </div>
                      <div className="card-container">
                        <CardInfo
                          title="Real ROAS"
                          value={selectedData.realroas}
                          popupContent="Mengukur banyak pendapatan asli yang dihasilkan tiap pengeluaran iklan"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* end */}

            {/* bagian sugesti */}
            <div>
              <div className="relative top-5 border-t-2 border-gray-600 p-5 px-0 pb-5">
                <h1 className="text-xl font-bold text-gray-700">
                  {translations["Suggestion"]}
                </h1>
                <div className="flex flex-col mt-5 gap-5 ">
                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.rar.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.rar.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>

                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.rar && suggestion.rar.id === 1)
                                  .map((suggestion, index) => (
                                    <div key={index} className="w-full max-sm:w-full">
                                      <h2 className="font-medium text-gray-900 ">{suggestion.rar.title}</h2>
                                      <p className="leading-5 ">{suggestion.rar.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.rar.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.rar.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.rar.massage}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="mt-flex justify-end items-end mt-3">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}

                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.oclp.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.oclp.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>
                                  <div>


                                  </div>
                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.cpc && suggestion.cpc.id === 6)
                                  .map((suggestion, index) => (
                                    <div key={index}>
                                      <h2 className="font-medium text-gray-900 ">{suggestion.oclp.title}</h2>
                                      <p className="leading-5 ">{suggestion.oclp.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.oclp.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.oclp.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.oclp.massage}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="flex justify-end items-end mt-3">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}

                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.cpc.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.cpc.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>
                                  {/* <AiOutlineCloseCircle
                              size={25}
                              className="text-red-500"
                            /> */}
                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.cpc && suggestion.cpc.id === 6)
                                  .map((suggestion, index) => (
                                    <div key={index}>
                                      <h2 className="font-medium text-gray-900 ">{suggestion.cpc.title}</h2>
                                      <p className="leading-5 ">{suggestion.cpc.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.cpc.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.cpc.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.cpc.message}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="mt-0">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}
                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.ctr.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.ctr.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>
                                  {/* <AiOutlineCloseCircle
                              size={25}
                              className="text-red-500"
                            /> */}
                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.ctr && suggestion.ctr.id === 3)
                                  .map((suggestion, index) => (
                                    <div key={index}>
                                      <h2 className="font-medium text-gray-900 ">{suggestion.ctr.title}</h2>
                                      <p className="leading-5 ">{suggestion.ctr.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.ctr.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.ctr.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.ctr.message}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="mt-0">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}
                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.roas.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.roas.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>
                                  {/* <AiOutlineCloseCircle
                              size={25}
                              className="text-red-500"
                            /> */}
                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.roas && suggestion.roas.id === 4)
                                  .map((suggestion, index) => (
                                    <div key={index}>
                                      <h2 className="font-medium text-gray-900 ">{suggestion.roas.title}</h2>
                                      <p className="leading-5 ">{suggestion.roas.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.roas.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.roas.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.roas.message}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="mt-0">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}
                  {["Danger", "Warning", "Success"].map((color) =>
                    suggestionData
                      .filter((suggestion) => suggestion.cpr.color === color)
                      .map((suggestion, index) => (
                        <div key={index}>
                          <Card color={suggestion.cpr.color}>
                            <div className="w-full">
                              <div className="flex gap-3">
                                <div>
                                  {/* <AiOutlineCloseCircle
                              size={25}
                              className="text-red-500"
                            /> */}
                                </div>
                                {suggestionData
                                  .filter((suggestion) => suggestion.cpr && suggestion.cpr.id === 5)
                                  .map((suggestion, index) => (
                                    <div key={index}>
                                      <h2 className="font-medium text-gray-900 ">{suggestion.cpr.title}</h2>
                                      <p className="leading-5 ">{suggestion.cpr.msg}</p>
                                      <hr className="border border-gray-500/30 w-full mt-3 " />

                                      <div className="flex gap-10 mt-3">
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans  "> Nilai:</h1>
                                          <p className="font-sans text-red-600 ">{suggestion.cpr.value}</p>
                                        </span>
                                        <span className="flex gap-2">
                                          <h1 className="font-medium font-sans "> Target:</h1>
                                          <p className="font-sans text-green-600 ">{suggestion.cpr.target}</p>
                                        </span>
                                      </div>

                                      <span className="flex relative top-3 gap-3">
                                        <h1 className="font-medium font-sans ">Pesan:</h1>
                                        <p className="">{suggestion.cpr.message}</p>
                                      </span>


                                    </div>
                                  ))}

                              </div>
                              <a
                                href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72"
                                target="_blank"
                              >
                                <div className="mt-0">
                                  <p className=" text-end hover:underline text-sm">
                                    {translations["Learn More"]}
                                  </p>
                                </div>
                              </a>
                            </div>
                          </Card>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
            {/* end */}
          </div>
        );
      case "metrics":
        return (
          <div>
            {/* bagian filter */}
            <div className="flex justify-end">
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 text-gray-500">
                  <BiRefresh size={25} />
                  Feb 4, 20:12
                </div>
              </div>
            </div>
            {/* end */}

            {/* bagian content */}
            <div className="flex flex-wrap justify-center gap-4 px-2 md:gap-8 max-sm:flex-col">
              {selectedData ? (
                metrixDatas.map((metrixData, index) => (
                  <Metrics
                    key={index}
                    title={metrixData.title}
                    value={formatValueMetrix(metrixData)}
                    chartData={metrixData.chart}
                    icon={<AiOutlineInfoCircle size={20} />}
                    persen={`${formattedKoma1(metrixData.persen)}%`}
                    description={formatDescMetrix(metrixData)}
                    persenTextColor={metrixData.persen < 0 ? "#ffff" : "#ffff"}
                    spanBackgroundColor={
                      metrixData.persen < 0 ? "#EF4444" : "#22C55E"
                    }
                    descModal={metrixData.descModal}
                  />
                ))
              ) : (
                <div>
                  <img src={NotFound} className="h-80" />
                </div>
              )}
            </div>
          </div>
        );

      case "history":
        return (
          <div>
            {campaign_id ? (
              <History campaign_id={campaign_id} />
            ) : (
              <p>Select a valid item</p>
            )}
          </div>
        );
      case "setting":
        return (
          <div>
            {campaign_id ? (
              <Setting campaign_id={campaign_id} />
            ) : (
              <p>Select a valid item</p>
            )}
          </div>
        )
      default:
        return null;
    }
  };

  const cardData = [
    {
      title: "Amount Spent",
      value: "Rp. 4.000.000",
      color: "text-sky-500",
      popupContent:
        "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: "Reach Amount Spent Ratio",
      value: "6.1%",
      color: "text-yellow-500",
      popupContent:
        "Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut",
    },
    {
      title: "Click Through Rate",
      value: "1.0%",
      color: "text-green-500",
      popupContent:
        "Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan",
    },
    {
      title: "OCLP",
      value: "30%",
      popupContent:
        "Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan",
    },
  ];

  const cardData2 = [
    {
      title: "CPR",
      value: "Rp. 5.000",
      popupContent:
        " Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan",
    },
    {
      title: "ATC",
      value: "2,5%",
      popupContent:
        " Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online",
    },
    {
      title: "ROAS",
      value: "1.0%",
      popupContent:
        "Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan",
    },
    {
      title: "Real ROAS",
      value: "1.0%",
      popupContent:
        "Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan",
    },
  ];

  const renderCardInfo = () => {
    return cardData.map((item, index) => {
      return (
        <CardInfo
          key={index}
          title={item.title}
          value={item.value}
          color={item.color}
          className="relative w-full flex top-5 flex-col justify-between h-24"
          popupContent={item.popupContent}
        />
      );
    });
  };

  const renderCardInfo2 = () => {
    return cardData2.map((item, index) => {
      return (
        <CardInfo
          key={index}
          title={item.title}
          value={item.value}
          color={item.color}
          className="w-full flex flex-col justify-between h-24"
          popupContent={item.popupContent}
        />
      );
    });
  };

  // get barr metrics
  useEffect(() => {
    const fetchData = async () => {
      try {
         setLoading(true);
        const id = campaign_id;
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `https://umaxxnew-1-d6861606.deta.app/metrics-7?campaign_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          console.log("response data", data);

          if (data.Data && data.Data.length > 0) {
            const campaignId = data.Data[0].campaign_id;
            setCampaignIdFromResponse(campaignId);

            const nextResponse = await axios.get(
              `https://umaxxnew-1-d6861606.deta.app/metrics-7?campaign_id=${campaignId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            );

            if (nextResponse.status === 200) {
              const nextData = nextResponse.data.Data;
              console.log("next data metric", nextData);
              setMetricsData(nextData);
            } else {
              console.error("Failed to fetch data from API");
            }
          } else {
            console.error("No campaign data found in the response");
          }
        } else {
          console.error("Failed to fetch data from API");
        }
        setLoading(false);
      } catch (error) {
        console.error("An error occurred", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [campaign_id, setMetricsData, setCampaignIdFromResponse]);

  return (
    <main className="bg-slate-100 max-sm:overflow-hidden max-h-full">
      <div>
        <Navbar />
      </div>
      <div className="flex gap-5 px-3">
        <Sidebar
          state={state}
          toggleSidebar={toggleSidebar}
          updateSelectedName={handleItemClick}
          setMetricId={setMetricId}
        />

        <ContainerCard>
          {/* Header */}
          <div className="border-b-2  border-gray-600">
            <div className="flex p-4 ml-3 pb-1 items-center">
              {selectedData && (
                <img
                  src={
                    selectedData.campaign_platform === 1
                      ? meta
                      : selectedData.campaign_platform === 2
                        ? google
                        : selectedData.campaign_platform === 3
                          ? tiktok
                          : ""
                  }
                  alt="icon"
                  width={30}
                />
              )}
              <h1
                className={`text-2xl max-sm:text-base pl-3 font-bold ${selectedName
                  ? "text-gray-600"
                  : "left-10 bg-gray-200 top-3 w-44 h-5 animate-pulse rounded-md relative"
                  }`}
              >
                {selectedName ? (
                  selectedName
                ) : (
                  <h1 className="w-5 h-5 relative -left-12 rounded-md  bg-gray-200"></h1>
                )}
              </h1>
            </div>

            <div className="flex items-center text-center justify-center">
              <ul className="grid -mb-1 max-sm:grid-cols-2 cursor-pointer grid-cols-4">
                <li
                  className={`p-3 px-4 ${activeTab === "performance"
                    ? "atas text-sky-500 cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleTabClick("performance")}
                >
                  {translations["Performance"]}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === "metrics"
                    ? "text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleTabClick("metrics")}
                >
                  {translations["Metrics"]}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === "history"
                    ? "text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleTabClick("history")}
                >
                  {translations["History"]}
                </li>
                <li
                  className={`p-3 px-5 ${activeTab === "setting"
                    ? "text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleTabClick("setting")}
                >
                  {translations["Setting"]}
                </li>
              </ul>
            </div>
          </div>
          {/* Body */}
          <div className="px-5 py-5 flex flex-col ">
          {loading ? (
          // Render a loading spinner or message while loading
          <div className="text-center">Loading...</div>
        ) : (
            
            renderContent()
            )}
          </div>
        </ContainerCard>
      </div>
    </main>
  );
};

export default Dashboard;