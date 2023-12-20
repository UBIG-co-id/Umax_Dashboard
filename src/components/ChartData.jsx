import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  datasets: [
    {
      label: 'Data 1',
      data: [12, 79, 3, 5, 2, 3, 8],
      fill: true,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
    {
      label: 'Data 2',
      data: [3, 7, 8, 12, 6, 5, 10],
      fill: true,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'Data 3',
      data: [8, 2, 6, 10, 15, 12, 9],
      fill: true,
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const AreaChart = () => {
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Area Chart Example</h2>
      <div className="bg-white p-4 shadow-md">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default AreaChart;
