// src/components/RecentTests.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const RecentTests = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchRecentTests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tests/recent-submitted", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("API response:", res.data);
        setRecentTests(res.data?.tests || []);
      } catch (error) {
        console.error("Error fetching recent tests:", error);
        setError("Failed to load recent tests.");
        setRecentTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTests();
  }, []);

  // Handle the click event for navigating to the test result page
  const handleTestClick = (testId) => {
    navigate(`/test/${testId}/submitted`); // Navigate to the respective test result page
  };

  return (
    <div className="w-96 mx-w-96 md:w-full mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Tests</h3>
      <div className="flex gap-4 overflow-x-auto md:mt-10">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recentTests.length > 0 ? (
          recentTests.map((test, index) => {
            const testTitle = test.testTitle || test.title || "Untitled";
            return (
              <div
                key={test._id || index}
                className="w-48 h-64 rounded-xl overflow-hidden shadow-md relative cursor-pointer"
                onClick={() => handleTestClick(test._id)} // Add the click handler
              >
                {/* <img
                  src={`https://via.placeholder.com/150/${index % 2 === 0 ? "0000FF" : "008080"}/FFFFFF?text=${encodeURIComponent(testTitle)}`}
                  alt={testTitle}
                  className="w-full h-full object-cover"
                /> */}
                <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60 text-white text-sm">
                  {testTitle}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No recent tests found</p>
        )}
      </div>
    </div>
  );
};

export default RecentTests;
