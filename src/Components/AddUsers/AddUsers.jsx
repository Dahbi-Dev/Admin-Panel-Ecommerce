import  { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AddUsers.css';

function AddUsers() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  
  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch(`${api}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.errors || 'Failed to register user');
    } else {
      setSuccess('User registered successfully!');
      setUser({ username: '', email: '', password: '' });
      
      // Navigate to ListUsers after successful registration
      navigate('/listusers'); // Adjust the route as per your routing configuration
    }
  };

  return (
    <div className="add-users">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label>Show Password</label>
          </div>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

export default AddUsers;
