import React from "react";
import { useState } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "../styles.css";
import { Popover, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Metrics = ({
  title,
  titleBig,
  value,
  chartData,
  icon,
  description,
  persen,
  spanBackgroundColor,
  persenTextColor,
  descModal,
}) => {
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
    <div className="bg-slate-100 border border-gray-300 p-2 mt-5 flex flex-col rounded-lg md:w-[40%] lg:w-[30%]">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-500">{title}</h2>
          <h2 className="text-sm font-medium text-gray-500">{titleBig}</h2>
        </div>

        <button
          className="ml-auto text-gray-500 mt-1 relative"
          onClick={handleOpenModal}
        >
          {icon}
        </button>

        <Popover
          open={isModalOpen}
          onClose={handleCloseModal}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            top: "top",
            horizontal: "center",
          }}
        >
          {/* modal */}
          <div className=" p-4 flex flex-col max-w-xs rounded-lg bg-white">
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{
                alignItems: "center",
                fontSize: "15px",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "6px",
                margin: "-16px",
                borderRadius: "5px 5px 0 0 ",
              }}
            >
              {title}
              <span
                className="bg-gray-300 rounded-full hover:bg-slate-100"
                style={{
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={handleCloseModal} aria-label="close">
                  <CloseIcon style={{ fontSize: "16px", color: "#3B82F6" }} />
                </IconButton>
              </span>
            </Typography>
            <div
              id="modal-modal-description"
              className="mt-6 text-gray-500 leading-5"
              style={{
                maxHeight: "80px",
                overflowY: "auto",
              }}
            >
              {descModal}
            </div>
          </div>
        </Popover>
      </div>

      <div className="flex mt-1">
        <div className="relative top-4 text-gray-600 text-xl font-bold">
          {value}
        </div>
      </div>
      <div className="relative -top-5 flex justify-end">
        <div style={{ width: "40%", height: 40 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <Bar dataKey="value" shape={<CustomBar />}>
                {chartData &&
                  chartData.length > 0 &&
                  chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === chartData.length - 1
                          ? entry.value > chartData[chartData.length - 2].value
                            ? "#1CD14F"
                            : "#FF3636"
                          : "#8690A2"
                      }
                    />
                  ))}
              </Bar>
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex">
        <div
          className="w-14 h-6 text-xs px-3 py-1 font-medium rounded-full"
          style={{
            backgroundColor: spanBackgroundColor,
            color: persenTextColor,
          }}
        >
          {persen}
        </div>
        <span className="text-gray-400 kecil font-medium pl-2 truncate cursor-pointer ">
          {description}
        </span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="tooltip relative bg-white shadow-xl border border-gray-700 p-2 -top-10 z-50 rounded-md text-gray-600">
        <span>{`${payload[0].value}`}</span>
      </div>
    );
  }

  return null;
};

export default Metrics;
