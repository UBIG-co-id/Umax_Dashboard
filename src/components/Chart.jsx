import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

export default function Chart({ metricId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(metricId, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          setChartData(data);
        } else {
          console.error('Failed to fetch data from API');
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    fetchData();
  }, [metricId]);

  const options = {
    chart: {
      height: 'auto',
      type: 'area',
      group: 'social',
      width: '100%',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB', '#FEB019', '#00E396'],
    legend: {
      show: false,
    },
  };

  let series = [];

  if (Array.isArray(chartData) && chartData.length > 0) {
    series = [
      {
        name: 'Amount Spent',
        data: chartData.map((item) => parseFloat(item.amountspent.replace(/[^0-9.]/g, ''))),
      },
      {
        name: 'RAR',
        data: chartData.map((item) => parseFloat(item.rar.replace(/[^0-9.]/g, ''))),
      },
      {
        name: 'CTR',
        data: chartData.map((item) => parseFloat(item.ctr.replace(/[^0-9.]/g, ''))),
      },
    ];
  }

  return (
    <div className='w-[99%] h-fit'>
      {chartData ? (
        <ReactApexChart options={options} series={series} type='area' height={'420px'} />
      ) : (
        <div class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
     </div>  
        )}
    </div>
  );
}
