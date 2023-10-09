import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles.css';
import { google, meta, tiktok } from "../assets";
import { BiSearch } from 'react-icons/bi';
import { Context } from '../context';

const Sidebar = ({ updateSelectedName }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  let { state, dispatch } = useContext(Context);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedData, setSelectedData] = useState([])

  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  useEffect(() => {
    // Fungsi ini akan dipanggil setiap kali activeTab atau campaigns berubah
    filterCampaignsByStatus();
  }, [activeTab, campaigns]);

  const filterCampaignsByStatus = () => {
    if (activeTab === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter((item) => {
        if (activeTab === 'draft' && item.status === 2) {
          return true;
        }
        if (activeTab === 'active' && item.status === 1) {
          return true;
        }
        if (activeTab === 'completed' && item.status === 3) {
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
      const response = await fetch('https://umax-1-z7228928.deta.app/campaignslistt', {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming that the API response includes an "id" field for each campaign
        const campaignsWithId = data.map((campaign, index) => ({ ...campaign, id: index + 1 }));
        setCampaigns(campaignsWithId);
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
    // Temukan kampanye yang sesuai dengan nama yang diklik
    const selectedCampaign = campaigns.find((campaign) => campaign.name === itemName);

    if (selectedCampaign) {
      setActiveItem(itemName);
      updateSelectedName(itemName);
      setSelectedData(selectedCampaign);
    }
  };


  // menyimpan warna array
  const customCircleColors = ['#8F8F8F', '#00FF00', '#00FF00', '#FF8A00', '#FF8A00'];


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
      backgroundColor: activeTab === 'all' ? '#ffff' : '#EBECF000',
      color: activeTab === 'all' ? '#494949' : '#6b7280',
      circleColor: activeTab === 'all' ? '#000' : '#00FF00',
    },
    draft: {
      backgroundColor: activeTab === 'draft' ? '#ffff' : '#EBECF000',
      color: activeTab === 'draft' ? '#494949' : '#6b7280',
      circleColor: activeTab === 'draft' ? '#8F8F8F' : '#8F8F8F',
    },
    active: {
      backgroundColor: activeTab === 'active' ? '#ffff' : '#EBECF000',
      color: activeTab === 'active' ? '#494949' : '#6b7280',
      circleColor: activeTab === 'active' ? '#00FF00' : '#00FF00',
    },
    completed: {
      backgroundColor: activeTab === 'completed' ? '#ffff' : '#EBECF000',
      color: activeTab === 'completed' ? '#494949' : '#6b7280',
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
      return <li className="mb-6 text-center ">Tidak ada hasil</li>
    }

    return filtered.slice(0, itemsToShow).map((item, index) => {
      let circleColor;

      // Tambahkan pemeriksaan status item dan atur warna lingkaran sesuai dengan status
      if (item.status === 1) { // Status 'active'
        circleColor = '#00FF00'; // Hijau
      } else if (item.status === 2) { // Status 'draft'
        circleColor = '#8F8F8F'; // Abu-abu
      } else if (item.status === 3) { // Status 'completed'
        circleColor = '#FF8A00'; // Orange
      } else {
        circleColor = '#8F8F8F'; // Default: Abu-abu
      }

      const isItemActive = activeItem === item.name; // Menggunakan 'name' alih-alih 'title'
      const listItemClasses = `flex flex-col h-24 mb-0 -ml-2 ${isItemActive ? 'bg-blue-200 ' : ''
        } ${!isItemActive ? nonActiveHoverClass : ''}`;

      return (
        <li
          key={index}
          className={listItemClasses}
          onClick={() => handleItemClick(item.name)}
        >
          {index > 0 && <hr className="border-gray-300 " />}
          <div
            className={`${activeTab === item.name.toLowerCase() ? 'bg-blue-200' : ''}`}
          />
          <div className="relative mt-2 pl-3 flex items-center w-20">
            <div className="flex items-center">
              <img
                src={
                  item.platform === 1
                    ? meta // Import meta from assets when platform is 1
                    : item.platform === 2
                      ? google // Import google from assets when platform is 2
                      : item.platform === 3
                        ? tiktok // Import tiktok from assets when platform is 3
                        : '' // Default value if platform doesn't match 1, 2, or 3
                }
                alt="icon"
                className="w-6 mr-2"
              />

              <span
                className={`truncate w-52 ${activeItem === item.name ? 'text-black' : ''
                  }`}
                title={item.name}
              >
                {item.name}
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
              <p >Amount Spent</p>
              <p >{item.amountspent}</p>
            </div>
            <div>
              <p >Reach</p>
              <p >{item.reach}</p>
            </div>
            <div>
              <p >Start Date</p>
              <p >{item.startdate}</p>
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
      <div className={`relative bayangan max-w-70 top-5 -left-1  w-72 max-h-full bg-white  rounded-t-xl  max-sm:left-0 text-slate-700 p-4 transform ${state.toggleNavbar ? 'block' : 'hidden'} transition-transform duration-300 ease-in-out`}>

        <div className=" bg-gray-200 mx-1 p-1 rounded-lg flex justify-center mb-4 ">
          <button
            style={tabStyle.all}
            className="px-2  py-1 rounded-md"
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
          <button
            style={tabStyle.draft}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('draft')}
          >
            Draft
          </button>
          <button
            style={tabStyle.active}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('active')}
          >
            Active
          </button>
          <button
            style={tabStyle.completed}
            className="px-2 py-1 rounded-md"
            onClick={() => handleTabChange('completed')}
          >
            Completed
          </button>
        </div>


        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <BiSearch />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 px-2 py-1 bg-white border-searc text-slate-600 rounded-lg"
            value={searchText}
            onChange={handleSearchChange}
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
