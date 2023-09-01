import React,  { useState }  from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ContainerCard from '../components/ContainerCard';
import { BiRefresh } from 'react-icons/bi';
import CardInfo from '../components/CardInfo';
import Chart from '../components/Chart';
import Card from '../components/Card';
import Setting from '../components/Setting';
import Metrics from '../components/Metrics';
import { FiAlertTriangle } from 'react-icons/fi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { google} from "../assets";
import '../styles.css';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('performance'); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // bagian chart metrix
  const chartData1 = [
    { name: 'Day1', value: 5, color: '#8690A2' },
    { name: 'Day2', value: 10, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData2 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 20, color: '#8690A2' },
    { name: 'Day5', value: 10, color: '#8690A2' },
    { name: 'Day6', value: 15, color: '#8690A2' },
    { name: 'Day7', value: 5, color: '#FF3636' },
  ];

  const chartData3 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData4 = [
    { name: 'Day1', value: 5, color: '#8690A2' },
    { name: 'Day2', value: 10, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 15, color: '#8690A2' },
    { name: 'Day5', value: 6, color: '#8690A2' },
    { name: 'Day6', value: 9, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData5 = [
    { name: 'Day1', value: 20, color: '#8690A2' },
    { name: 'Day2', value: 16, color: '#8690A2' },
    { name: 'Day3', value: 10, color: '#8690A2' },
    { name: 'Day4', value: 20, color: '#8690A2' },
    { name: 'Day5', value: 10, color: '#8690A2' },
    { name: 'Day6', value: 16, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData6 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData7 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 6, color: '#FF3636' },
  ];

  const chartData8 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 5, color: '#FF3636' },
  ];

  const chartData9 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData10 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData11 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];

  const chartData12 = [
    { name: 'Day1', value: 10, color: '#8690A2' },
    { name: 'Day2', value: 15, color: '#8690A2' },
    { name: 'Day3', value: 7, color: '#8690A2' },
    { name: 'Day4', value: 12, color: '#8690A2' },
    { name: 'Day5', value: 15, color: '#8690A2' },
    { name: 'Day6', value: 10, color: '#8690A2' },
    { name: 'Day7', value: 20, color: '#1CD14F' },
  ];


// end


  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div>
            {/* bagian filter */}
            <div className='flex justify-end'>
                <div className='flex gap-5 items-center'>
                  <div className='flex gap-2 text-gray-500'>
                    <BiRefresh size={25} />
                    Feb 4, 20:12
                  </div>
                  <select name="" id="" className='focus:outline-none p-2 px-5 border border-gray-300 text-gray-500 rounded-md'>
                    <option value="">Last Week</option>
                  </select>
                </div>
              </div>
              {/* end */}

              {/* bagian content */}
            <div clas>
                <div className='flex mt-5 gap-5'>
                  {/* Card Info */}
                  <div className='w-2/6 flex flex-col h-full gap-5'>
                    {renderCardInfo()}
                  </div>
                  {/* Chart */}
                  <div className='w-full flex flex-col gap-5 justify-between'>
                    <Chart />
                    <div className=' flex w-full gap-5 -mt-4'>
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
                <div className='flex mt-5 gap-5'>
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
            <div className='flex'>
          <div className='w-full justify-center flex flex-row gap-3 md:w-full '>
          <Metrics title="Amount Spent" value="Rp. 4.000.000" chartData={chartData1} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description="Total Amount spent compared to last 7 day"  persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          <Metrics title="Reach" value="97.000" chartData={chartData2} icon={<AiOutlineInfoCircle size={20}  />} persen="-2,0%" description="Total Reach compared to last 7 day"  persenTextColor="#D40B0B" spanBackgroundColor="#FF6D6D" />
          <Metrics title="Impression" value="230.000" chartData={chartData3} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description="Total Impression compared to last 7 day"  persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          </div>
            </div>

            <div className='flex'>
          <div className='w-full justify-center flex flex-row gap-3 md:w-full '>
          <Metrics title="Frequency" value="2,3" chartData={chartData4} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description={<span style={{ fontSize: '12.3px', whiteSpace: 'nowrap'}}>Total Frequency compared to last 7 day</span>}
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          <Metrics title="Reach Amount Ratio" value="6,1%" chartData={chartData5} icon={<AiOutlineInfoCircle size={20} />} persen="-2,0%" description={<span style={{ fontSize: '7.9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Reach Amount Ratio compared to last 7 day</span>}
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          <Metrics title="Cost per Click" value="Rp. 2.000" chartData={chartData6} icon={<AiOutlineInfoCircle size={20} />} persen="+2,0%" description={<span style={{ fontSize: '10.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Cost per Click compared to last 7 day</span>}
          persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          </div>
          </div>

          <div className='flex'>
          <div className='w-full justify-center flex flex-row gap-3 md:w-full '>
          <Metrics title="Click Through Rate" value="1,0%" chartData={chartData7} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description={<span style={{ fontSize: '10.1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Click Through Rate compared to last 7 day</span>} 
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          <Metrics titleBig="Outbont Click Landing Page" value="30%" chartData={chartData8} icon={<AiOutlineInfoCircle size={20} />} persen="-2,0%" description={<span style={{ fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total OCLP compared to last 7 day</span>}
            persenTextColor="#D40B0B" spanBackgroundColor="#FF6D6D" />
          <Metrics title="Cost per Result" value="Rp. 5.000" chartData={chartData9} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description={<span style={{ fontSize: '10.1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Cost per Result compared to last 7 day</span>}
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          </div>
          </div>
          <div className='flex'>
          <div className='w-full justify-center flex flex-row gap-3 md:w-full '>
          <Metrics title="Add to Cart" value="2,5%" chartData={chartData10} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%" description={<span style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Add to Cart compared to last 7 day</span>}
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          <Metrics title="Return on AD Spent" value="3,1x" chartData={chartData11} icon={<AiOutlineInfoCircle size={20}  />} persen="-2,0%" description={<span style={{ fontSize: '11.6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total ROAS compared to last 7 day</span>} 
            persenTextColor="#D40B0B" spanBackgroundColor="#FF6D6D" />
          <Metrics title="Real ROAS" value="3,0x" chartData={chartData12} icon={<AiOutlineInfoCircle size={20}  />} persen="+2,0%"description={<span style={{ fontSize: '11.4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total Real ROAS compared to last 7 day</span>}
            persenTextColor="#656F84" spanBackgroundColor="#1CD14F" />
          </div>
          </div>

            </div>
        );
      case 'history':
        return (
          <div>
      </div>
        );
      case 'setting':
        return (
         
          <div >
           <div className='bg-white border-2 rounded-lg p-20 h-Setting relative'>
  <Setting />
  <button className='absolute bottom-0 right-0 mb-4 mr-4 bg-sky-600 px-4 py-1 rounded-md text-white'>
    Save
  </button>
</div>

          </div>
        );
      default:
        return null;
    }
  };

 
  const cardData = [
    {
      title: 'Amount Spent',
      value: 'Rp. 4.000.000',
      color: 'text-sky-500'
    },
    {
      title: 'Reach Amount Ratio',
      value: '6.1%',
      color: 'text-yellow-500'
    },
    {
      title: 'Click Through Rate',
      value: '1.0%',
      color: 'text-green-500'
    },
    {
      title: 'OCLP',
      value: '30%',
    }
  ];

  const cardData2 = [
    {
      title: 'CPR',
      value: 'Rp. 5.000',
    },
    {
      title: 'ATC',
      value: '2,5%',
    },
    {
      title: 'ROAS',
      value: '1.0%',
    },
    {
      title: 'Real ROAS',
      value: '1.0%',
    },
  ];



  const renderCardInfo = () => {
    return cardData.map((item, index) => {
      return <CardInfo key={index} title={item.title} value={item.value} color={item.color} className='relative flex top-5 flex-col justify-between h-24' />
    })
  }

  const renderCardInfo2 = () => {
    return cardData2.map((item, index) => {
      return <CardInfo key={index} title={item.title} value={item.value} color={item.color} className='w-full  flex flex-col justify-between h-24' />
    })
  }

  return (
    <main className='bg-slate-100 min-h-screen ' >
      <div>
        <Navbar />
        <div className='flex gap-5  px-5'>
          <Sidebar />
          
          <ContainerCard>
            
            {/* Header */}
            <div className='border-b-2  border-gray-600'>
              <div className='flex p-4 ml-3 pb-1 items-center'>
               <img src={google} alt="google" width={50} /> <h1 className='text-2xl pl-3 font-bold text-gray-700'>Campaign Tahfidz</h1>
              </div> 


       <div className='flex justify-center'>
                <ul className='flex -mb-1'>
                  <li
                    className={`p-3 px-5  ${
                      activeTab === 'performance' ? ' atas text-sky-500 cursor-pointer font-semibold  border-b-4 border-sky-500 transition-colors ' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('performance')}
                  >
                    Performance
                  </li>
                  <li
                    className={`p-3 px-5  ${
                      activeTab === 'metrics' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('metrics')}
                  >
                    Metrics
                  </li>
                  <li
                    className={`p-3 px-5  ${
                      activeTab === 'history' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabClick('history')}
                  >
                    History
                  </li>
                  <li
                    className={`p-3 px-5  ${
                      activeTab === 'setting' ? 'text-sky-500 atas cursor-pointer font-semibold border-b-4 border-sky-500 transition-colors' : 'text-gray-500'
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
      </div>
      
    </main>
  );

}

export default Dashboard