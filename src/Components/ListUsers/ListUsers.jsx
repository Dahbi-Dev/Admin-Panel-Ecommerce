import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListUsers.css';

function ListUsers() {
  const [users, setUsers] = useState([]);
  const [sortOption, setSortOption] = useState("latest"); // Default sort option
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const api = "https://backend-ecommerce-gibj.onrender.com"

  const navigate = useNavigate();

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${api}/api/users`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [api]);

  // Delete a user
  const deleteUser = async (id) => {
    await fetch(`${api}/api/users/${id}`, {
      method: 'DELETE',
    });
    setUsers(users.filter(user => user._id !== id)); // Update local state
  };

  // Edit user and navigate to EditUser route
  const editUser = (id) => {
    navigate(`/edituser/${id}`);
  };

  // Navigate to AddUser page
  const addUser = () => {
    navigate('/addusers');
  };

  // Sorting users based on the selected option
  const sortUsers = (users) => {
    const sortedUsers = [...users]; // Create a shallow copy
    switch (sortOption) {
      case "latest":
        return sortedUsers.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return sortedUsers.sort((a, b) => new Date(a.date) - new Date(b.date));
      default:
        return sortedUsers;
    }
  };

  // Filter users based on the search term (name, email, or ID)
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.toLowerCase().includes(searchTerm.toLowerCase()) // Search by ID
  );

  const sortedUsers = sortUsers(filteredUsers); // Sort after filtering

  return (
    <div className="list-users">
      <h1>List of Users</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name, email, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="latest">Latest Added</option>
          <option value="oldest">Oldest</option>
        </select>
        <button className="add-user-btn" onClick={addUser}>Create User</button>
      </div>
      <p>Total Users: <span style={{ color: 'green' }}>{sortedUsers.length}</span></p>
      <table>
        <thead>
          <tr>
            <th>ID</th> {/* Added ID column */}
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td> {/* Display user ID */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.date).toLocaleString()}</td>
              <td>
                <button style={{backgroundColor:'green'}} onClick={() => editUser(user._id)}>Edit</button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListUsers;
