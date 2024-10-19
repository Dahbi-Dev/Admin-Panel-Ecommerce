import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserGraph = () => {
  const [timeFrame, setTimeFrame] = useState("lastMonth");
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = import.meta.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchUserCounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${api}/api/users-count?timeFrame=${timeFrame}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setUserData(result);
      } catch (err) {
        console.error("Error fetching user counts:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCounts();
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

  // Calculate total users
  const totalUsers = userData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Growth</h2>
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
            Total users in {timeFrameLabels[timeFrame]}: {totalUsers}
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={userData} barSize={userData.length > 10 ? 20 : 60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                interval={userData.length > 7 ? "preserveStartEnd" : 0}
                angle={userData.length > 7 ? -45 : 0}
                textAnchor="end"
                height={60}
              />{" "}
              <YAxis />
                <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default UserGraph;
