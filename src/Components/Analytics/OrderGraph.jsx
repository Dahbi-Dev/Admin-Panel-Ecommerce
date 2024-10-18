import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OrderGraph = () => {
  const [timeFrame, setTimeFrame] = useState("lastMonth");
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = "https://backend-ecommerce-gibj.onrender.com"


  useEffect(() => {
    const fetchOrderCounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${api}/api/orders-count?timeFrame=${timeFrame}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setOrderData(result);
      } catch (err) {
        console.error("Error fetching order counts:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderCounts();
  }, [timeFrame]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const timeFrameLabels = {
    lastWeek: "Last Week",
    lastMonth: "Last Month",
    lastSixMonths: "Last 6 Months",
    lastYear: "Last Year",
  };

  // Calculate total orders
  const totalOrders = orderData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Order Growth</h2>
      <div className="mb-4">
        <label htmlFor="timeFrame" className="mr-2">
          Select Time Frame:
        </label>
        <select
          id="timeFrame"
          value={timeFrame}
          onChange={handleTimeFrameChange}
          className="p-2 border rounded"
        >
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastSixMonths">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <>
          <p>
            Total orders in {timeFrameLabels[timeFrame]}: {totalOrders}
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={orderData}
              barSize={orderData.length > 10 ? 20 : 60}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                interval={orderData.length > 7 ? "preserveStartEnd" : 0}
                angle={orderData.length > 7 ? -45 : 0}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default OrderGraph;