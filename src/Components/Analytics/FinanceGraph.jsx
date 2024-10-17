import  { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FinanceGraph = () => {
  const [timeFrame, setTimeFrame] = useState("lastMonth");
  const [financeData, setFinanceData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinanceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:4000/api/finance-data?timeFrame=${timeFrame}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setFinanceData(result.data);
        setTotalBalance(result.totalBalance);
      } catch (err) {
        console.error("Error fetching finance data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinanceData();
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

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Financial Growth</h2>
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
          <p className="mb-4">
            Total Balance: ${totalBalance.toFixed(2)}
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval={financeData.length > 7 ? "preserveStartEnd" : 0}
                angle={financeData.length > 7 ? -45 : 0}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default FinanceGraph;