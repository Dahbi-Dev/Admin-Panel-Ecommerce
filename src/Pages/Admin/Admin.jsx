import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import EditProduct from "../../Components/EditProduct/EditProduct";
import UploadBanner from "../../Components/AddImages/UploadBanner";
import AddLogo from "../../Components/AddLogo/AddLogo";
import AddHero from "../../Components/AddHero/AddHero";
import AddOffer from "../../Components/AddOffer/AddOffer";
import AddFooter from "../../Components/AddFooter/AddFooter";
import ListUsers from "../../Components/ListUsers/ListUsers";
import EditUser from "../../Components/EditUser/EditUser";
import AddUsers from "../../Components/AddUsers/AddUsers";
import Orders from "../../Components/Orders/Orders";
import Analytics from "../../Components/Analytics/Analytics";
import './Admin.css'

const Admin = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={onLogout}
      />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addusers" element={<AddUsers />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/listusers" element={<ListUsers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/edituser/:id" element={<EditUser />} />
          <Route path="/uploadbanner" element={<UploadBanner />} />
          <Route path="/editproduct/:id" element={<EditProduct />} />
          <Route path="/uploadLogo" element={<AddLogo />} />
          <Route path="/addhero" element={<AddHero />} />
          <Route path="/addoffer" element={<AddOffer />} />
          <Route path="/addfooter" element={<AddFooter />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
