import { useState } from "react";
import "./AdminLogin.css"; // Make sure to create this CSS file

// eslint-disable-next-line react/prop-types
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token); // Save token in localStorage
      onLogin(data.token);
    } else {
      alert(data.errors);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="col-left">
          <div className="login-text">
            <h2>Welcome Back</h2>
          </div>
        </div>
        <div className="col-right">
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <p>
                <label>
                  Username or email address<span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </p>
              <p>
                <label>
                  Password<span>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </p>
              <p>
                <input type="submit" value="Sign In" />
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
