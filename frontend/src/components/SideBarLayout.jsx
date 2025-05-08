import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./SideBar";
import { BiSearch } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { HiMenu } from "react-icons/hi";

const SidebarLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "User";
  const heading = location.pathname === "/dashboard" ? `Welcome ${username}!` : "Tests For You!";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] font-sans relative overflow-hidden">

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static z-50 top-0 left-0 w-64 bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] h-full shadow-lg transform transition-transform duration-300 ease-in-out 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {mobileOpen && <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto p-4 md:p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          {/* Mobile Top Bar */}
          <div className="flex justify-between items-center w-full lg:hidden">
            <button className="text-3xl text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
              <HiMenu />
            </button>
            <span className="text-2xl font-semibold text-gray-800">Learn Code</span>
          </div>

          {/* Headings */}
          <h2 className="hidden lg:block text-3xl font-semibold text-gray-800">{`Welcome ${username}`}</h2>
          <h2 className="mt-4 mx-auto text-2xl lg:text-3xl font-semibold text-gray-800 lg:hidden">{heading}</h2>

          {/* Search and Avatar */}
          <div className="flex items-center gap-4 w-96 md:w-full ml-14 lg:w-auto">
            <div className="relative w-full sm:w-40 md:w-64">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a14bf4]"
              />
              <BiSearch className="absolute top-2.5 left-3 text-gray-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img src="https://i.pravatar.cc/40" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Children Content */}
        <div className="flex-grow md:mt-6">{children}</div>
      </main>
    </div>
  );
};

export default SidebarLayout;
