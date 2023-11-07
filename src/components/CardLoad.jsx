import React from "react";
import { useState } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import "../styles.css";

const data = [
  { title: "Card 1", value: "Value 1", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },

  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },

  { title: "Card 1", value: "Value 1", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },

  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  { title: "Card 2", value: "Value 2", spanBackgroundColor: "#D5D4DA", persenTextColor: "white", width: "30%" },
  // Add data for more cards here
];

const CardLoad = ({ data }) => {
  const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    const borderRadius = 1.6;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={borderRadius}
          ry={borderRadius}
        />
      </g>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
    const rect = event.target.getBoundingClientRect();
    const top = rect.top + rect.height;
    const left = rect.left;
    setPopoverPosition({ top, left });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setAnchorEl(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-wrap">
      {data.map((item, index) => (
        <div key={index} className="bg-gray-200 border animate-pulse border-gray-300 p-2 mt-5 my-10 mx-4 flex flex-col rounded-lg h-32 " style={{ width: item.width }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <h2 className="h-4 w-24 relative top-2 bg-[#D5D4DA]"></h2>
            </div>
            <button
              className="ml-auto text-gray-500 mt-1 relative"
              onClick={handleOpenModal}
            >
              {/* Icon */}
            </button>
          </div>
          <div className="flex mt-1">
            <div className="relative top-6 bg-[#D5D4DA] h-4 w-16">
            </div>
          </div>
          <div className="relative -top-5 flex justify-end">
            <div style={{ width: "40%", height: 40 }}>
              {/* Custom content here */}
            </div>
          </div>
          <div className="flex">
            <div
              className="w-14 h-4 text-xs px-3 relative top-2 font-medium"
              style={{
                backgroundColor: item.spanBackgroundColor,
              }}
            >
            </div>
            <span className=" bg-[#D5D4DA] relative top-2 h-4 px-40 pb-4 pl-2 ml-3 truncate cursor-pointer">
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <CardLoad data={data} />
    </div>
  );
}