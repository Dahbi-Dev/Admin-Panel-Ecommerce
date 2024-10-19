/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin, onLogout }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${api}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("adminToken", data.token);
        onLogin(data.token);
      } else {
        alert(data.errors);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      // Ensure the spinner is visible for 1.5 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-left">
          <div className="admin-login-text">
            <h2>Welcome Back</h2>
            <p>Log in to access the admin dashboard</p>
          </div>
        </div>
        <div className="admin-login-right">
          <div className="admin-login-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  <>
                    <FaSignInAlt className="button-icon" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
