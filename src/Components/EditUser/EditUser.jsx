import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';

function EditUser() {
  const api = import.meta.env.REACT_APP_API_URL;

  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '', // New password state
    date: '', // Date state to hold the created date
    currentPassword: '', // State for current password input
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State for current password visibility

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${api}/api/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser({
          name: data.name || '',
          email: data.email || '',
          password: '', // Do not set the password here for security
          date: data.date || '', // Set the date from the response
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated user data
    const updatedUser = {
      name: user.name,
      email: user.email,
      ...(user.password && { password: user.password }), // Send the new password if entered
      date: new Date().toISOString(), // Update the date to the current time
    };

    // Validate current password
    const response = await fetch(`${api}/api/users/validate-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, currentPassword: user.currentPassword }),
    });

    if (response.ok) {
      // Proceed to update the user
      const updateResponse = await fetch(`${api}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (updateResponse.ok) {
        navigate('/listusers'); // Redirect after successful update
      } else {
        console.error('Failed to update user');
      }
    } else {
      console.error('Current password is incorrect');
      alert('Current password is incorrect'); // Alert user
    }
  };

  return (
    <div className="edit-user" style={{ marginTop: '80px' }}>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
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
          <label>Current Password:</label>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            name="currentPassword"
            value={user.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter your current password"
          />
          <input
            type="checkbox"
            checked={showCurrentPassword}
            onChange={() => setShowCurrentPassword((prev) => !prev)} // Toggle checkbox
          />
          <label>Show Current Password</label>
        </div>
        <div>
          <label>New Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={user.password} // Leave it blank for security
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)} // Toggle checkbox
          />
          <label>Show New Password</label>
        </div>
        <div>
          <label>Created At:</label>
          <input
            type="text"
            value={new Date(user.date).toLocaleString()} // Show formatted date
            disabled
          />
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default EditUser;
