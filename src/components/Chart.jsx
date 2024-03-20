import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import Notfound from "../assets/NotFound.png";
import "../styles.css";

export default function Chart({ chartUrl }) {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

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
          setChartData(data.reverse());
          
          // Update categories based on month if available
          if (chartUrl.includes("last-year")) {
            const months = data.map(item => item.month);
            setCategories(months);
          } else if (chartUrl.includes("last-month")) {
            // Generate numeric categories if month data is not available
            setCategories(data.map((_, index) => index + 1));
          } else if (chartUrl.includes("last-week")) {
            // Generate numeric categories if month data is not available
            setCategories(data.map((_, index) => index + 1));
          } 
        } else {
          console.error("Failed to fetch data from API");
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
    };

    fetchData();
  }, [chartUrl]);

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
    xaxis: {
      type: 'date',
      categories: categories.length > 0 ? categories : ["No Data Available"],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
    }
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
            <img className="h-72" src={Notfound} />
          </span>
        </div>
      )}
    </div>
  );
}
