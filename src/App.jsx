import { useState, useEffect } from "react";
import Admin from "./Pages/Admin/Admin";
import AdminLogin from "./Components/AdminLogin/AdminLogin";

const App = () => {
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
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
      {adminToken ? <Admin onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />}
    </div>
  );
};

export default App;
