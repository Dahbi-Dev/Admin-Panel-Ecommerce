import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaProductHunt,
  FaUsers,
  FaListAlt,
  FaShoppingCart,
  FaPhotoVideo,
  FaTags,
  FaCopyright,
  FaImage,
  FaSignOutAlt,
  FaHome,
  FaUpload,
  FaChartBar,
} from "react-icons/fa";
import './Sidebar.css'

const Sidebar = ({ isOpen, onLogout, toggleSidebar }) => {
  const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
    <Link 
      to={to} 
      className="sidebar-link" 
      onClick={(e) => {
        toggleSidebar();
        if (onClick) onClick(e);
      }}
    >
      <Icon className="sidebar-icon" />
      <span>{children}</span>
    </Link>
  );

  const SidebarCategory = ({ title, children }) => (
    <div className="sidebar-category">
      <h3 className="category-title">{title}</h3>
      <div className="category-items">{children}</div>
    </div>
  );

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? '' : 'open'}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isOpen ? "" : "open"}`}>
        <nav className="sidebar-navbar">
          <h1 className="navbar-title">Admin Dashboard</h1>
        </nav>
        <div className="sidebar-content">
          <SidebarCategory title="Main">
            <SidebarLink to="/" icon={FaHome}>
              Dashboard
            </SidebarLink>
          </SidebarCategory>
          <SidebarCategory title="Products">
            <SidebarLink to="/addproduct" icon={FaProductHunt}>
              Add Product
            </SidebarLink>
            <SidebarLink to="/listproduct" icon={FaListAlt}>
              List Products
            </SidebarLink>
          </SidebarCategory>
          <SidebarCategory title="Users">
            <SidebarLink to="/addusers" icon={FaUsers}>
              Add Users
            </SidebarLink>
            <SidebarLink to="/listusers" icon={FaUsers}>
              List Users
            </SidebarLink>
          </SidebarCategory>
          <SidebarCategory title="Orders">
            <SidebarLink to="/orders" icon={FaShoppingCart}>
              Manage Orders
            </SidebarLink>
          </SidebarCategory>
          <SidebarCategory title="Content">
            <SidebarLink to="/uploadbanner" icon={FaImage}>
              Upload Banner
            </SidebarLink>
            <SidebarLink to="/uploadlogo" icon={FaPhotoVideo}>
              Upload Logo
            </SidebarLink>
            <SidebarLink to="/addhero" icon={FaUpload}>
              Upload Hero
            </SidebarLink>
            <SidebarLink to="/addoffer" icon={FaTags}>
              Upload Offer
            </SidebarLink>
            <SidebarLink to="/addfooter" icon={FaCopyright}>
              Upload Footer
            </SidebarLink>
          </SidebarCategory>
        </div>
        <div className="sidebar-footer">
          <SidebarLink to="/" icon={FaSignOutAlt} onClick={onLogout}>
            Logout
          </SidebarLink>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;