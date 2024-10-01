import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";
import AdminLogin from "./Components/AdminLogin/AdminLogin";

const App = () => {
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    // Check if there's a token in sessionStorage when the app loads
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token); // Set token in state if found
    }
  }, []);

  const handleLogin = (token) => {
    setAdminToken(token);
    sessionStorage.setItem("adminToken", token); // Store token in sessionStorage
  };

  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem("adminToken"); // Remove token from sessionStorage
  };

  return (
    <div>
      <Navbar isAdmin={!!adminToken} onLogout={handleLogout} />
      {adminToken ? <Admin /> : <AdminLogin onLogin={handleLogin} />}
    </div>
  );
};

export default App;
