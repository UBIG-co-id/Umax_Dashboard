import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles.css';
import { google, meta, tiktok } from "../assets";
import { BiSearch } from 'react-icons/bi';
import { Context } from '../context';
import { useLanguage } from '../LanguageContext'; // Import the useLanguage hook
import Translation from '../translation/Translation.json';

const Sidebar = ({ updateSelectedName, setMetricId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  let { state, dispatch } = useContext(Context);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [campaigns, setCampaigns] = useState([]);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([])
  const { selectedLanguage } = useLanguage(); // Get selectedLanguage from context
  const translations = Translation[selectedLanguage];
  const [searchKeyword, setSearchKeyword] = useState('');

  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  useEffect(() => {
    // Fungsi ini akan dipanggil setiap kali activeTab atau campaigns berubah
    filterCampaignsByStatus();
  }, [activeTab, data]);

  const filterCampaignsByStatus = () => {
    if (activeTab === 'all') {
      setFilteredCampaigns(data);
    } else {
      const filtered = data.filter((item) => {
        if (activeTab === 'draft' && item.campaign_status === 2) {
          return true;
        }
        if (activeTab === 'active' && item.campaign_status === 1) {
          return true;
        }
        if (activeTab === 'completed' && item.campaign_status === 3) {
          return true;
        }
        return false;
      });
      setFilteredCampaigns(filtered);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('https://umaxdashboard-1-w0775359.deta.app/metrics', {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData = await response.json(); // Rename to avoid conflict with 'data' state
        setData(responseData); // Set the response data
      } else {
        console.error('Gagal mengambil data');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = () => {
    const container = document.querySelector('.lebar-list');
    if (container) {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        setItemsToShow(itemsToShow + 10);
      }
    }
  };

  useEffect(() => {
    const container = document.querySelector('.lebar-list');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [itemsToShow]);

  const handleItemClick = (itemName) => {
    // Find the campaign that matches the clicked name
    const selectedData = data.find((data) => data.campaign_name === itemName);
  
    if (selectedData) {
      setActiveItem(itemName);
      updateSelectedName(itemName);
      setSelectedData(selectedData);
  
      // Add this part to set metric_id based on selectedData
      const metricIdFromSelectedData = selectedData._id;
      setMetricId(metricIdFromSelectedData);
    }
  };


  // menyimpan warna array
  const customCircleColors = ['#8F8F8F', '#00FF00', '#00FF00', '#FF8A00', '#FF8A00'];
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveItem(null);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const tabStyle = {
    all: {
      backgroundColor: activeTab === 'all' ? '#008FFB' : '#EBECF000',
      color: activeTab === 'all' ? '#ffff' : '#6b7280',
      circleColor: activeTab === 'all' ? '#000' : '#00FF00',
    },
    draft: {
      backgroundColor: activeTab === 'draft' ? '#008FFB' : '#EBECF000',
      color: activeTab === 'draft' ? '#ffff' : '#6b7280',
      circleColor: activeTab === 'draft' ? '#8F8F8F' : '#8F8F8F',
    },
    active: {
      backgroundColor: activeTab === 'active' ? '#008FFB' : '#EBECF000',
      color: activeTab === 'active' ? '#ffff' : '#6b7280',
      circleColor: activeTab === 'active' ? '#00FF00' : '#00FF00',
    },
    completed: {
      backgroundColor: activeTab === 'completed' ? '#008FFB' : '#EBECF000',
      color: activeTab === 'completed' ? '#ffff' : '#6b7280',
      circleColor: activeTab === 'completed' ? '#FF8A00' : '#FF8A00',
    },
  };

  const filteredItems = (items) => {
    if (searchText === '') {
      return items;
    }

    return items.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const nonActiveHoverClass = 'hoverable';

  const renderItems = (items) => {
    const filtered = filteredItems(items);

    if (filtered.length === 0) {
      return <li className="mb-6 text-center">Tidak ada hasil</li>;
    }
  
    // Tambahkan baris berikut untuk melakukan filtering berdasarkan kata kunci pencarian
    const filteredByKeyword = filtered.filter((item) =>
    item.campaign_name ? item.campaign_name.toLowerCase() : ''
    );
  
    return filteredByKeyword.slice(0, itemsToShow).map((item, index) => {
      let circleColor;

      // Tambahkan pemeriksaan status item dan atur warna lingkaran sesuai dengan status
      if (item.campaign_status === 1) { // campaign_status 'active'
        circleColor = '#00FF00'; // Hijau
      } else if (item.campaign_status === 2) { // campaign_status 'draft'
        circleColor = '#8F8F8F'; // Abu-abu
      } else if (item.campaign_status === 3) { // campaign_status 'completed'
        circleColor = '#FF8A00'; // Orange
      } else {
        circleColor = '#8F8F8F'; // Default: Abu-abu
      }

      const isItemActive = activeItem === item.campaign_name; // Menggunakan 'name' alih-alih 'title'
      const listItemClasses = `flex flex-col h-24 mb-0 -ml-2 ${isItemActive ? 'bg-blue-200 ' : ''
        } ${!isItemActive ? nonActiveHoverClass : ''}`;

      return (
        <li
          key={index}
          className={listItemClasses}
          onClick={() => handleItemClick(item.campaign_name)}
        >
          {index > 0 && <hr className="border-gray-300 " />}
          <div
            className={`${activeTab === item.campaign_name.toLowerCase() ? 'bg-blue-200' : ''}`}
          />
          <div className="relative mt-2 pl-3 flex items-center w-20">
            <div className="flex items-center">
              <img
                src={
                  item.campaign_platform === 1
                    ? meta // Import meta from assets when campaign_platform is 1
                    : item.campaign_platform === 2
                      ? google // Import google from assets when campaign_platform is 2
                      : item.campaign_platform === 3
                        ? tiktok // Import tiktok from assets when platform is 3
                        : '' // Default value if platform doesn't match 1, 2, or 3
                }
                alt="icon"
                className="w-6 mr-2"
              />

              <span
                className={`truncate w-52 ${activeItem === item.campaign_name ? 'text-black' : ''
                  }`}
                title={item.campaign_name}
              >
                {item.campaign_name}
              </span>
            </div>
            <div className="absolute left-64 flex items-center">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: circleColor }}
              ></span>
            </div>
          </div>

          <div className="aside__container-list_information mt-1">
            <div>
              <p >{translations['Amount Spent']}</p>
              <p >{item.amountspent}</p>
            </div>
            <div>
              <p >{translations['Reach']}</p>
              <p >{item.reach}</p>
            </div>
            <div>
              <p >{translations['Start Date']}</p>
              <p >{formatDate(item.campaign_startdate)}</p>
            </div>
          </div>
        </li>
      );
    });
  };
  return (
    <div className="relative flex max-sm:absolute max-sm:left-0 z-20">
      <button
        className={`relative top-2 right-2 sm:hidden text-gray-600 z-10`}
        onClick={toggleSidebar}
      >
        <div className={`transition-transform duration-300 ease-in-out transform ${state.toggleNavbar ? 'block' : 'hidden'}`}>

        </div>
      </button>
      <div className={`relative bayangan max-w-70 top-5 -left-1  w-72 max-h-full bg-white  rounded-t-xl  max-sm:left-0 text-slate-500 p-4 transform ${state.toggleNavbar ? 'block' : 'hidden'} transition-transform duration-300 ease-in-out`}>

        <div className=" bg-gray-200 mx-1 p-1 rounded-lg flex justify-center mb-4 ">
          <button
            style={tabStyle.all}
            className="px-2  py-1 rounded-md"
            onClick={() => handleTabChange('all')}
          >
            {translations['All']}
          </button>
          <button
            style={tabStyle.draft}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('draft')}
          >
            {translations['Draft']}
          </button>
          <button
            style={tabStyle.active}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('active')}
          >
            {translations['Active']}
          </button>
          <button
            style={tabStyle.completed}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('completed')}
          >
            {translations['Completed']}
          </button>
        </div>


        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <BiSearch />
          </span>
          <input
            type="text"
            placeholder={translations['Search']}
            className="w-full pl-8 px-2 py-1 bg-white border-searc border focus:outline-none focus:border-gray-500 text-slate-600 rounded-lg"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>


        <div className="relative lebar-list -left-2 border-slate-500 pt-2  overflow-y-scroll max-h-[50rem]">
          <ul className="cursor-pointer mt-2 ">
            {renderItems(filteredCampaigns)} {/* Menampilkan data yang sudah difilter */}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
