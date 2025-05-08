import React from "react";
import {
  FaSignOutAlt, FaCog
} from "react-icons/fa";
import {
  IoBookSharp
} from "react-icons/io5";
import {
  MdOutlineSpaceDashboard
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate("/");
  };

  return (
    <aside className="h-screen w-64 flex flex-col justify-between bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] p-6 shadow-xl">
      <div>
        <h1 className="text-2xl font-bold text-[#a14bf4] mb-12">
          Learn <span className="text-gray-700">Code</span>
        </h1>
        <nav className="space-y-6 text-gray-700">
          <Link to="/admin-dashboard" className="flex items-center gap-3 font-semibold hover:text-[#a14bf4]">
            <MdOutlineSpaceDashboard /> Admin Dashboard
          </Link>
          <Link to="/admin/create-test" className="flex items-center gap-3 hover:text-[#a14bf4]">
            <IoBookSharp /> Create Test
          </Link>
          <Link to="/admin/update-test" className="flex items-center gap-3 hover:text-[#a14bf4]">
            <IoBookSharp /> Update Test
          </Link>
          <Link to="/admin/add-questions" className="flex items-center gap-3 hover:text-[#a14bf4]">
            <IoBookSharp /> Add Questions
          </Link>
          <Link to="/admin/add-explanations" className="flex items-center gap-3 hover:text-[#a14bf4]">
            <IoBookSharp /> Add Explanations
          </Link>
        </nav>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 hover:text-[#a14bf4] cursor-pointer">
          <FaCog /> Settings
        </div>
        <div className="flex items-center gap-3 hover:text-[#a14bf4] cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt /> Log Out
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
