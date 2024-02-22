import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import apiUrl from "./apiConfig";

function SalesChart() {
  const [modal, setModal] = useState({});
  const [untungkotor, setUntungKotor] = useState({});
  const [untungbersih, setUntungBersih] = useState({});

  useEffect(() => {
    // Simulate fetching data from the database
    fetchDataFromDatabase();
  }, []);

  const fetchDataFromDatabase = async () => {
    try {
      const response = await fetch(
        apiUrl +
          "/detail/detailed" +
          "/2024-01-02T08:17:02.635Z/2024-02-31T08:17:02.635Z",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("session_id"),
          },
        },
      );
      const data = await response.json();
      
      // Process the data
      const processedModal = modalData(data);
      const processedUntungKotor = untungKotorData(data);
      const processedUntungBersih = untungBersihData(data);

      // Set chart data
      setModal(processedModal);
      setUntungKotor(processedUntungKotor);
      setUntungBersih(processedUntungBersih);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const modalData = (data) => {
    // Process your data here, calculate the total for each transaction
    const chartData = {
      labels: [],
      series: [[]],
    };

    data.forEach((transaction) => {
      const total = transaction.detailed_transactions.reduce((acc, curr) => {
        if (curr.qty_stock_change > 0)
          return acc + curr.qty_stock_change * curr.item.cogs * -1; // berarti modal
        else return 0;
      }, 0);

      chartData.labels.push(formatDate(transaction.createdAt));
      chartData.series[0].push(total);
    });

    return chartData;
  };

  const untungKotorData = (data) => {
    // Process your data here, calculate the total for each transaction
    const chartData = {
      labels: [],
      series: [[]],
    };

    data.forEach((transaction) => {
      const total = transaction.detailed_transactions.reduce((acc, curr) => {
        if (curr.qty_stock_change < 0)
          return acc + curr.qty_stock_change * curr.item.price * -1;
        else return 0;
      }, 0);

      chartData.labels.push(transaction.transaction_id);
      chartData.series[0].push(total);
    });

    return chartData;
  };

  const untungBersihData = (data) => {
    // Process your data here, calculate the total for each transaction
    const chartData = {
      labels: [],
      series: [[]],
    };

    data.forEach((transaction) => {
      const total = transaction.detailed_transactions.reduce((acc, curr) => {
        if (curr.qty_stock_change < 0)
          return (
            acc +
            curr.qty_stock_change * (curr.item.price - curr.item.cogs) * -1
          );
        else return 0;
      }, 0);

      chartData.labels.push(transaction.transaction_id);
      chartData.series[0].push(total);
    });

    return chartData;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Format the date as desired
    const formattedDate = date.toLocaleString(); // Adjust locale and options as needed

    return formattedDate;
  };

  return (
    <div>
      <div style={{ overflow: "hidden", width: "100vw" }}>
        {modal.labels && modal.series && modal.labels.length > 0 && (
          <Chart
            options={{
              chart: {
                type: "area",
                height: 350,
                zoom: {
                  enabled: false, // Disable zoom
                },
              },
              xaxis: { categories: modal.labels },
              title: {
                // Add title here
                text: "untung rugi", // Title text
                align: "center", // Title alignment
                margin: 10, // Title margin
                offsetX: 0, // Title horizontal offset
                offsetY: 0, // Title vertical offset
                floating: false, // Whether the title is floating (i.e., it overlaps the chart)
                style: {
                  fontSize: "18px", // Title font size
                  fontWeight: "bold", // Title font weight
                  fontFamily: "Arial", // Title font family
                  color: "#333", // Title color
                },
              },
              stroke: {
                curve: "straight",
              },
              dataLabels: {
                enabled: false,
              },
            }}
            series={[
              {
                name: "modal", // Provide a name for the series
                data: modal.series[0], // Assuming you have only one series
              },
              {
                name: "untung kotor", // Provide a name for the series
                data: untungkotor.series[0], // Assuming you have only one series
              },
              {
                name: "untung bersih", // Provide a name for the series
                data: untungbersih.series[0], // Assuming you have only one series
              },
            ]}
            type="area"
            width="100%"
            height="500"
          />
        )}
      </div>
    </div>
  );
}

export default SalesChart;
