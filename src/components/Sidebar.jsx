import React, { useContext, useState, useRef, useEffect } from 'react';
import '../styles.css';
import { google, facebook, tiktok } from "../assets";
import { BiSearch } from 'react-icons/bi';
import { Context } from '../context';



const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('draft');
  const [searchText, setSearchText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  let { state, dispatch } = useContext(Context);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [campaigns, setCampaigns] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://umax-1-z7228928.deta.app/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data); // Memperbarui state campaigns dengan data yang diambil
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

  const handleItemClick = (item) => {
    setActiveItem(item === activeItem ? null : item);
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

  const renderItems = (campaigns) => {
    const filtered = filteredItems(campaigns);
  
    if (filtered.length === 0) {
      return <li className="mb-6 text-center ">Tidak ada hasil</li>;
    }
  
    return filtered.map((campaign, index) => {
      let circleColor;
  
      if (activeTab === 'all') {
        circleColor = customCircleColors[index % customCircleColors.length];
      } else {
        circleColor = tabStyle[activeTab]?.circleColor; // Use optional chaining (?.) to avoid errors
      }
  
      const isItemActive = activeItem === campaign.name;
      const listItemClasses = `flex flex-col h-20 mb-0 -ml-2 ${
        isItemActive ? 'bg-blue-200 ' : ''
      } ${!isItemActive ? nonActiveHoverClass : ''}`;
  
      return (
        <li
          key={index}
          className={listItemClasses}
          onClick={() => handleItemClick(campaign.name)}
        >
          {index > 0 && <hr className="border-gray-300 " />}
          <div
            className={`${activeTab === campaign.name?.toLowerCase() ? 'bg-blue-200' : ''}`}
            // Use optional chaining (?.) to avoid errors
          />
          <div className="relative mt-2 pl-3 flex items-center w-20">
            <div className="flex items-center">
              <img src={campaign.icon} alt="icon" className="w-6 mr-2" />
              <span
                className={`truncate w-52 ${activeItem === campaign.name ? 'text-black' : ''
                  }`}
                title={campaign.name}
              >
                {campaign.name}
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
              <p>Amount Spent</p>
              <p>{campaign.amountSpent}</p>
            </div>
            <div>
              <p>Reach</p>
              <p>{campaign.reach}</p>
            </div>
            <div>
              <p>Start Date</p>
              <p>{campaign.startDate}</p>
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


        <div className="relative lebar-list -left-2 border-slate-500 pt-2 overflow-y-scroll max-h-[50rem]">
          <ul className="cursor-pointer mt-2">
            {activeTab === 'all' && (
              <>
                <hr className="border-gray-300 mb-0" />
                {renderItems([
                  { name: 'Program Bimbingan Karir', icon: tiktok, amountSpent: 'Rp. 3.000.000', reach: '220.000', startDate: 'Sep 4, 14:09' },
                  { title: 'Santri Berwirausaha', icon: google, amountSpent: 'Rp. 2.000.000', reach: '97.000', startDate: 'Mart 1, 12:36' },
                  { title: 'Program Tahfidz', icon: facebook, amountSpent: 'Rp. 4.000.000', reach: '120.000', startDate: 'Feb 4, 12:36' },
                  { title: 'Campaign Tahfidz', icon: google, amountSpent: 'Rp. 3.000.000', reach: '250.000', startDate: 'Apr 12, 14:00' },
                  { title: 'Tahfidz Ramadhan', icon: facebook, amountSpent: 'Rp. 1.000.000', reach: '10.000', startDate: 'Agust 25, 11:19' },
                  { title: 'Bilingual - 15/10', icon: google, amountSpent: 'Rp. 2.000.000', reach: '100.000', startDate: 'May 21, 14:00' },
                  { title: 'Peduli Pangan', icon: google, amountSpent: 'Rp. 1.000.000', reach: '97.000', startDate: 'Apr 12, 12:36' },
                  { title: 'Retarget CA Web Visitor', icon: tiktok, amountSpent: 'Rp. 5.000.000', reach: '100.000', startDate: 'Mei 24, 09:36' },
                  { title: 'Pesantren Berkualitas', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Menginspirasi Hafidz', icon: facebook, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Pondok Pesantren Inklusif', icon: facebook, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Mengasah Potensi Pemi', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Merajut Masa Depan', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Pondok Pesantren Terdepan', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Menghormati Tradisi', icon: tiktok, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Transformasi Melalui Ilmu', icon: tiktok, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Menyentuh Hati dan Akal', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Generasi Unggul', icon: facebook, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                ]).slice(0, itemsToShow).map((campaign, index) => (
                  <li key={index}>
                    {campaign.name /* Menggunakan nilai 'name' dari objek kampanye */}
                    {/* Tambahkan ikon, jumlah yang dihabiskan, jangkauan, tanggal mulai, dll. sesuai kebutuhan */}
                  </li>
                ))}
              </>
            )}

            {activeTab === 'draft' && (
              <>
                <hr className="border-gray-300 mb-0" />

                {renderItems([

                  { title: 'Retarget VV 50-95% Tahfidz', icon: google, amountSpent: 'Rp. 2.000.000', reach: '100.000', startDate: 'May 21, 14:00' },
                  { title: 'Campaign Tahfidz FB IG EN', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Retarget CA Web Visitor Terbaru Update', icon: google, amountSpent: 'Rp. 4.000.000', reach: '97.000', startDate: 'Desc 22, 13:06' },
                  { title: 'Campaign Tahfidz', icon: facebook, amountSpent: 'Rp. 3.000.000', reach: '250.000', startDate: 'Apr 12, 14:00' },
                  { title: 'Program Tahfidz', icon: tiktok, amountSpent: 'Rp. 4.000.000', reach: '120.000', startDate: 'Feb 4, 02:12' },
                  { title: 'Kampung Pesantren Berkah', icon: google, amountSpent: 'Rp. 7.000.000', reach: '120.000', startDate: 'Feb 4, 07:26' },
                  { title: 'Tahfidz Ramadhan', icon: facebook, amountSpent: 'Rp. 1.000.000', reach: '10.000', startDate: 'Agust 25, 11:19' },
                  { title: 'Program Bimbingan Karir', icon: tiktok, amountSpent: 'Rp. 3.000.000', reach: '220.000', startDate: 'Sep 4, 14:09' },
                  { title: 'Santri Berwirausaha', icon: google, amountSpent: 'Rp. 2.000.000', reach: '97.000', startDate: 'Mart 1, 12:36' },


                ])}
              </>
            )}

            {activeTab === 'active' && (
              <>
                <hr className="border-gray-300 mb-0" />
                {renderItems([
                  { title: 'Bilingual - 15/10', icon: google, amountSpent: 'Rp. 2.000.000', reach: '100.000', startDate: 'May 21, 14:00' },
                  { title: 'Campaign Tahfidz FB IG EN', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Retarget CA Web Visitor', icon: google, amountSpent: 'Rp. 4.000.000', reach: '97.000', startDate: 'Apr 12, 12:36' },
                  { title: 'Campaign Tahfidz', icon: facebook, amountSpent: 'Rp. 3.000.000', reach: '250.000', startDate: 'Apr 12, 14:50' },
                  { title: 'Program Tahfidz', icon: tiktok, amountSpent: 'Rp. 4.000.000', reach: '120.000', startDate: 'Feb 4, 12:36' },

                ])}
              </>
            )}
            {activeTab === 'completed' && (
              <>
                <hr className="border-gray-300 mb-0" />
                {renderItems([
                  { title: 'Retarget VV 50-95% Tahfidz', icon: facebook, amountSpent: 'Rp. 2.000.000', reach: '100.000', startDate: 'May 21, 14:00' },
                  { title: 'Campaign Tahfidz FB IG EN', icon: google, amountSpent: 'Rp. 4.000.000', reach: '200.000', startDate: 'jan 24, 17:55' },
                  { title: 'Retarget CA Web Visitor', icon: tiktok, amountSpent: 'Rp. 5.000.000', reach: '100.000', startDate: 'Mei 24, 09:36' },
                  { title: 'Peduli Pangan', icon: google, amountSpent: 'Rp. 1.000.000', reach: '97.000', startDate: 'Apr 12, 12:36' },

                ])}
              </>
            )}
          </ul>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;
