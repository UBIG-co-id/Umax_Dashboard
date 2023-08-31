import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import '../styles.css';

const Metrics = ({ title, titleBig, value, chartData, icon, description, persen, spanBackgroundColor, persenTextColor }) => {
  const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    const borderRadius = 1.6;

    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} rx={borderRadius} ry={borderRadius} />
      </g>
    );
  };

  return (
    <div className='bg-slate-100 border border-gray-300 p-2 mt-5 flex flex-col rounded-lg'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center'>
          <h2 className='text-lg font-medium text-gray-500'>{title}</h2>
          <h2 className='text-sm font-medium text-gray-500'>{titleBig}</h2>
        </div>
        <div className='ml-auto text-gray-500 mt-1'>{icon}</div>
      </div>
      <div className='flex mt-1'>
        <div className='relative top-4 text-gray-600 text-xl font-bold'>{value}</div>
      </div>
      <div className='relative -top-5 flex justify-end'>
        <div style={{ width: '40%', height: 40 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <Bar dataKey='value' shape={<CustomBar />} >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex">
        <div className='w-14 h-6 text-xs px-3 py-1 font-medium rounded-full' style={{ backgroundColor: spanBackgroundColor, color: persenTextColor }}>
          {persen}
        </div>
        <span className='text-gray-400 kecil font-medium pl-2'>{description}</span>
      </div>
    </div>
  );
};

export default Metrics;
