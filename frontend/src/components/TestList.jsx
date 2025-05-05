// components/TestList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TestCard from "./TestCard";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data);
        setFilteredTests(res.data);
      } catch (error) {
        console.error("Error fetching tests", error);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    const filtered = tests.filter((test) => {
      if (filter === "all") return true;
      return test.status?.toLowerCase() === filter.toLowerCase();
    });

    setFilteredTests(filtered);
  }, [filter, tests]);

  const handleTestClick = (testId) => {
    navigate(`/tests/${testId}`);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleFilterChange = (value) => {
    setFilter(value);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-2 bg-white shadow-md rounded-lg text-sm"
            onClick={toggleDropdown}
          >
            <FaFilter />
            Sort By
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 z-50">
              <ul>
                {["all", "submitted", "expired", "upcoming"].map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 capitalize"
                    onClick={() => handleFilterChange(option)}
                  >
                    {option === "all" ? "All Tests" : option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-purple-600">
        {filter === "all" ? "All Tests" : `Filtered: ${filter}`}
      </h3>

      {filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <TestCard key={test._id} test={test} onClick={() => handleTestClick(test._id)} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tests found for this category.</p>
      )}
    </>
  );
};

export default TestList;
