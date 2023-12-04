import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import Notfound from "../assets/NotFound.png";
import "../styles.css";

export default function Chart({ chartUrl }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(chartUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.status === 200) {
          const data = response.data.Data;
          setChartData(data);
        } else {
          console.error("Failed to fetch data from API");
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
    };

    fetchData();
  }, [chartUrl, setChartData]);

  const options = {
    chart: {
      height: "auto",
      type: "area",
      group: "social",
      width: "100%",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB", "#FEB019", "#00E396"],
    legend: {
      show: false,
    },
  };

  let series = [];

  if (Array.isArray(chartData) && chartData.length > 0) {
    series = [
      {
        name: "Amount Spent",
        data: chartData.map((item) =>
          parseFloat(item.amountspent.replace(/[^0-9.]/g, ""))
        ),
      },
      {
        name: "RAR",
        data: chartData.map((item) =>
          parseFloat(item.rar.replace(/[^0-9.]/g, ""))
        ),
      },
      {
        name: "CTR",
        data: chartData.map((item) =>
          parseFloat(item.ctr.replace(/[^0-9.]/g, ""))
        ),
      },
    ];
  }

  return (
    <div className="w-[100%] h-fit">
      {chartData ? (
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={"300px"}
        />
      ) : (
        <div className="w-full font font-medium h-80 flex items-center justify-center">
          <span className="flex items-center justify-between">
            <span>
              {/* <h1>PLEASE !!!</h1>
            <h2>select campaign data first</h2> */}
            </span>
            <img className="h-72" src={Notfound} />
          </span>
        </div>
      )}
    </div>
  );
}
