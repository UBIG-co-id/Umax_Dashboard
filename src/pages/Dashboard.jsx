import React,  { useState, useEffect  }  from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ContainerCard from '../components/ContainerCard';
import { BiRefresh } from 'react-icons/bi';
import CardInfo from '../components/CardInfo';
import Chart from '../components/Chart';
import Card from '../components/Card';
import Setting from '../components/Setting';
import Metrics from '../components/Metrics';
import History from '../components/History';
import { FiAlertTriangle } from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { google} from "../assets";
import '../styles.css';

import axios from 'axios';



const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('performance'); 
  const [state, setState] = useState({
    toggleNavbar: false,
  });

  const toggleSidebar = () => {
    setState({ ...state, toggleNavbar: !state.toggleNavbar });
  };

  const contentStyles = {
    marginLeft: state.toggleNavbar ? '72px' : '0',
  };


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [metricsData, setMetricsData] = useState([]);
  
//Data Baru
  //Backend tinggal ikutin ini aja
  const metrixDatas = [
    {
      title: "Amount Spent",
      value: 4000000,
      chart: [
        { name: "Day1", value: 5 },
        { name: "Day2", value: 10 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Amount spent compared to last 7 day",
      descModal:
        "Jumlah total biaya yang kita keluarkan untuk pemasangan iklan",
    },
    {
      title: "Reach",
      value: 97000,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 20 },
        { name: "Day5", value: 10 },
        { name: "Day6", value: 15 },
        { name: "Day7", value: 5 },
      ],
      persen: -2.0,
      description: "Total Reach compared to last 7 day",
      descModal:
        "Jumlah user yang melihat iklan kita pada platform iklan yang kita pasang",
    },
    {
      title: "Impression",
      value: 230000,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: -2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Jumlah iklan kita ditayangkan. Bedanya dengan Reach, user yang sama bisa dihitung melihat iklan yang sama lebih dari satu kali",
    },
    {
      title: "Frequency",
      value: 2.3,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 20 },
        { name: "Day5", value: 10 },
        { name: "Day6", value: 15 },
        { name: "Day7", value: 5 },
      ],
      persen: -2.0,
      description: "Total Impression compared to last 7 day",
      descModal:
        "Berapa kali rata-rata seorang user melihat iklan kita ditampilkan dalam rentang waktu tertentu. Dihitung dari jumlah Impressions dibagi dengan jumlah Reach",
    },
    {
      title: "Reach Amount Ratio",
      value: 6.1,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 20 },
        { name: "Day5", value: 10 },
        { name: "Day6", value: 15 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Reach Amount ratio compared to last 7 day",
      descModal:
        "Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut",
    },
    {
      title: "Cost Per Click",
      value: 2000,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Cost per Click compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap Link Clicks. Dihitung dari jumlah Amount Spent dibagi dengan jumlah Link Clicks",
    },
    {
      title: "Click Through Rate",
      value: 1.0,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 15 },
      ],
      persen: 2.0,
      description: "Total Click Through Rate compared to last 7 day",
      descModal:
        "Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan. Dihitung dari jumlah Link Click dibagi dengan jumlah Impressions",
    },
    {
      title: "Outbont Click Landing Page",
      value: 30,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 5 },
      ],
      persen: -2.0,
      description: "Total OCLP compared to last 7 day",
      descModal:
        "Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan",
    },
    {
      title: "Cost per Result",
      value: 5000,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Cost per Result compared to last 7 day",
      descModal:
        "Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan",
    },
    {
      title: "Add to Cart",
      value: 2.5,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Add to Cart compared to last 7 day",
      descModal:
        "Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online",
    },
    {
      title: "Return on ADD Spent",
      value: 3.1,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total ROAS to last 7 day",
      descModal:
        "Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan",
    },
    {
      title: "Real ROAS",
      value: 3.0,
      chart: [
        { name: "Day1", value: 10 },
        { name: "Day2", value: 15 },
        { name: "Day3", value: 7 },
        { name: "Day4", value: 12 },
        { name: "Day5", value: 15 },
        { name: "Day6", value: 10 },
        { name: "Day7", value: 20 },
      ],
      persen: 2.0,
      description: "Total Real ROAS to last 7 day",
      descModal:
        "Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan",
    },
  ];

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
    });

  //prettier-ignore
  //format value metrix
  const formatValueMetrix = (metrixData) => {
    const formatMap = {
      "Amount Spent": rupiah,
      "Cost per Click": rupiah,
      "Cost per Result": rupiah,
      "Reach": (value) => `${formattedNumber(value)} `,
      "Impression": (value) => `${formattedNumber(value)} `,
      "Frequency": (value) => `${formattedKoma1(value)}`,
      "Return on ADD Spent": (value) => `${formattedKoma1(value)}x`,
      "Real ROAS": (value) => `${formattedKoma1(value)}x`,
      "Reach Amount Ratio": (value) => `${formattedKoma1(value)} %`,
      "Outbont Click Landing Page": (value) => `${formattedKoma1(value)} %`,
      "Click Through Rate": (value) => `${formattedKoma1(value)} %`,
      "Add to Cart": (value) => `${formattedKoma1(value)} %`,
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
      "Amount Spent": (description) => (
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
      "Reach Amount Ratio": (description) => (
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
      "Cost per Click": (description) => (
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
      "Click Through Rate": (description) => (
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

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div >
            {/* bagian filter */}
            <div className='flex justify-end'>
                <div className='flex gap-5 items-center'>
                  <div className='flex gap-2 text-gray-500'>
                    <BiRefresh size={25} />
                    Feb 4, 20:12
                  </div>
                  <select name="" id="" className='focus:outline-none p-2 px-5 border border-gray-300 text-gray-500 rounded-md'>
                    <option value="">Last Week</option>
                    <option value="">Last Month</option>
                    <option value="">Last Year</option>
                  </select>
                </div>
              </div>
              {/* end */}

              {/* bagian content */}
              <div>
        <div className='flex flex-col md:flex-row mt-5 md:gap-5'>
          {/* Card Info */}
          <div className='md:w-8/12 w-full flex flex-col h-full gap-5'>
            {renderCardInfo()}
          </div>
          {/* Chart */}
          <div className='w-full md:w-full flex flex-col gap-5 justify-between'>
            <Chart />
            
            <div className='flex flex-col md:flex-row gap-5 -mt-4'>
              {renderCardInfo2()}
            </div>
          </div>
        </div>
      </div>
              {/* end */}


                {/* bagian sugesti */}
            <div>
              <div className='relative top-5 border-t-2 border-gray-600 p-5 px-10 pb-5'>
                <h1 className='text-xl font-bold text-gray-700'>Suggestion</h1>
                <div className='flex flex-col mt-5 md:flex-row gap-5'>
                  <Card color='yellow'>
                    <div className='max-w-sm'>
                      <div className='flex gap-3'>
                        <div>
                          <FiAlertTriangle size={25} className='text-yellow-500' />
                        </div>
                        <div>
                          <div className='font-medium mb-2'>Nilai CTR rendah</div>
                          <p>Pastikan iklan atau tautan Anda memiliki judul atau gambar yang menarik</p>
                        </div>
                      </div>
                      <a href="https://chat.openai.com/share/3bb35f6a-4b3b-4182-b6f9-c880722b3c72" target="_blank" rel="noopener noreferrer">
                      <div className='mt-2 hover:underline  text-end text-sm'>
                        learn more
                      </div>
                      </a>
                    </div>
                  </Card>
                  <Card color='red'>
                    <div className='max-w-sm'>
                      <div className='flex gap-3'>
                        <div>
                          <AiOutlineCloseCircle size={25} className='text-red-500' />
                        </div>
                        <div>
                          <div className='font-medium mb-2'>Nilai OCL rendah</div>
                          <p>Pastikan bahwa landing page Anda memiliki konten yang relavan, menarik, dan informatif</p>
                        </div>
                      </div>
                      <a href="https://chat.openai.com/share/cb290ced-08a9-4153-93dc-470a1e0fd126" target="_blank" rel="noopener noreferrer">
                      <div className='mt-2 hover:underline  text-end text-sm'>
                        learn more
                      </div>
                      </a>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
            {/* end */}
          </div>
        );
      case 'metrics':
        return (
          <div>
            {/* bagian filter */}
            <div className='flex justify-end'>
              <div className='flex gap-5 items-center'>
                <div className='flex gap-2 text-gray-500'>
                  <BiRefresh size={25} />
                  Feb 4, 20:12
                </div>
              </div>
            </div>
            {/* end */}

            {/* bagian content */}
            <div className="flex flex-wrap justify-center gap-4 px-2 md:gap-8 max-sm:flex-col">
              {metrixDatas.map((metrixData, index) => (
                <Metrics
                  key={index}
                  title={metrixData.title}
                  value={formatValueMetrix(metrixData)}
                  chartData={metrixData.chart}
                  icon={<AiOutlineInfoCircle size={20} />}
                  persen={`${formattedKoma1(metrixData.persen)}%`}
                  description={formatDescMetrix(metrixData)}
                  persenTextColor={
                    metrixData.persen < 0 ? "#D40B0B" : "#656F84"
                  }
                  spanBackgroundColor={
                    metrixData.persen < 0 ? "#FF6D6D" : "#1CD14F"
                  }
                  descModal={metrixData.descModal}
                />
              ))}
            </div>

            </div>
        );
      case 'history':
        return (
          <div>

            <History />

          </div>
        );
      case 'setting':
        return (
         
          
  <Setting />
 
        );
      default:
        return null;
    }
  };

 
  const cardData = [
    {
      title: 'Amount Spent',
      value: 'Rp. 4.000.000',
      color: 'text-sky-500',
      popupContent: 'Jumlah total biaya yang kita keluarkan untuk pemasangan iklan' 
    },
    {
      title: 'Reach Amount Ratio',
      value: '6.1%',
      color: 'text-yellow-500',
      popupContent: 'Mengukur hubungan antara jumlah orang yang melihat iklan dengan jumlah uang yang dihabiskan untuk iklan tersebut' 
    },
    {
      title: 'Click Through Rate',
      value: '1.0%',
      color: 'text-green-500',
      popupContent: 'Rasio jumlah klik pada iklan kita dibandingkan dengan jumlah iklan ditayangkan' 
    },
    {
      title: 'OCLP',
      value: '30%',
      popupContent: 'Mendorong pengunjung untuk mengklik tautan atau tombol yang mengarahkan mereka ke halaman atau situs web eksternal yang relevan' 
    }
  ];

  
  const cardData2 = [
    {
      title: 'CPR',
      value: 'Rp. 5.000',
      popupContent: ' Perhitungan biaya yang kita keluarkan untuk setiap hasil yang kita dapatkan' 
    },
    {
      title: 'ATC',
      value: '2,5%',
      popupContent: ' Menambahkan produk atau barang ke dalam keranjang belanja saat berbelanja secara online di situs web e-commerce atau toko online' 
    },
    {
      title: 'ROAS',
      value: '1.0%',
      popupContent: 'Mengukur seberapa banyak pendapatan atau hasil yang dihasilkan dari setiap unit pengeluaran iklan' 
    },
    {
      title: 'Real ROAS',
      value: '1.0%',
      popupContent: 'Mengukur banyak pendapatan asli yang di hasilkan tiap pengeluaran iklan' 
    },
  ];


 
  const renderCardInfo = () => {
    return cardData.map((item, index) => {
      return <CardInfo key={index} title={item.title} value={item.value} color={item.color} className='relative flex top-5 flex-col justify-between h-24'          
      popupContent={item.popupContent}
      />
    })
  }

  const renderCardInfo2 = () => {
    return cardData2.map((item, index) => {
      return <CardInfo  key={index} title={item.title} value={item.value} color={item.color} className='w-full  flex flex-col justify-between h-24' 
      popupContent={item.popupContent} 
      />
    })
  }

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://umax-1-z7228928.deta.app/metrics/');
        if (response.status === 200) {
          const data = response.data;
          console.log(data); 
          setMetricsData(data);
        } else {
          console.error('Failed to fetch data from API');
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
      
    };

    fetchData();
  }, []);

  return (
    <main className='bg-slate-100 min-h-screen ' >
      <div>
        <Navbar />
        </div>
        <div className='flex gap-5  px-5'>
        <Sidebar state={state} toggleSidebar={toggleSidebar} />
          
          <ContainerCard >
            
            {/* Header */}
            <div className='border-b-2  border-gray-600'>
              <div className='flex p-4 ml-3 pb-1 items-center'>
               <img src={google} alt="google" width={50} />
                <h1 className='text-2xl pl-3 font-bold text-gray-700'>Campaign Tahfidz</h1>
              </div> 


                  <div className="flex justify-center">
                  <ul className=" flex -mb-1 flex-wrap  sm:flex-row">
                  <li
                  className={`p-3 px-5 ${activeTab === 'performance' ? 'atas text-sky-500 cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                  }`}
                  onClick={() => handleTabClick('performance')}
                  >
                  Performance
                  </li>
                  <li
                  className={`p-3 px-5 ${activeTab === 'metrics' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                  }`}
                  onClick={() => handleTabClick('metrics')}
                  >
                  Metrics
                  </li>
                  <li
                  className={`p-3 px-5 ${activeTab === 'history' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                  }`}
                  onClick={() => handleTabClick('history')}
                  >
                  History
                  </li>
                  <li
                  className={`p-3 px-5 ${activeTab === 'setting' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                  }`}
                  onClick={() => handleTabClick('setting')}
                  >
                  Setting
                  </li>
                  </ul>
                  </div>

            </div>
                {/* Body */}
            <div className='px-5 py-5 flex flex-col '>
             
                    {/* pemanggil */}
              {renderContent()}
            </div>
          

          </ContainerCard>
        </div>
      
      
    </main>
  );

}

export default Dashboard