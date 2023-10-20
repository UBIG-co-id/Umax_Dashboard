import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function Chart({ metricId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch data from the dynamic URL using metricId
    fetch(`https://umaxdashboard-1-w0775359.deta.app/history/${metricId}`)
      .then((response) => response.json())
      .then((data) => {
        setChartData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
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

  // Extracting data with decimal values
  const series = Array.isArray(chartData) && chartData.length > 0
  ? [
    {
      name: 'Amount Spent',
      data: chartData.map((item) =>
        parseFloat(item.perubahan.amountspent.replace(/[^0-9.]/g, ''))
      ),
    },
    {
      name: 'RAR',
      data: chartData.map((item) =>
        parseFloat(item.perubahan.rar.replace(/[^0-9.]/g, ''))
      ),
    },
    {
      name: 'CTR',
      data: chartData.map((item) =>
        parseFloat(item.perubahan.ctr.replace(/[^0-9.]/g, ''))
      ),
    },
  ]
  : [];

  return (
    <div className='w-[99%] h-fit'>
      {chartData ? (
        <ReactApexChart options={options} series={series} type='area' height={'350px'} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}