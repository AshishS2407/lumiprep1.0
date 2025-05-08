import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FetchTest = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 4;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      try {
        const res = await axios.get('http://localhost:3000/tests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tests');
      }
    };
    fetchTests();
  }, []);

  const handleUpdate = (testId) => {
    navigate(`/tests/update/${testId}`);
  };

  // Pagination logic
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(tests.length / testsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full max-w-5xl mt-20 bg-white shadow-lg rounded-xl p-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        All Tests
      </motion.h2>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      {tests.length === 0 && !error ? (
        <p className="text-gray-600 text-center">No tests available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTests.map((test) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow hover:shadow-md"
              >
                <h3 className="text-xl font-semibold">{test.testTitle}</h3>
                <p className="text-sm text-gray-600">Company: {test.companyName}</p>
                <p className="text-sm text-gray-700 mt-1">{test.description}</p>
                <p className="text-sm mt-2 text-blue-600 font-medium">Status: {test.status}</p>
                <p className="text-sm text-gray-500">
                  Valid Till: {test.validTill ? new Date(test.validTill).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Duration: {test.duration} mins</p>

                <button
                  onClick={() => handleUpdate(test._id)}
                  className="mt-4 px-4 py-2 rounded text-white bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300"
                >
                  Update
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {tests.length > testsPerPage && (
            <div className="mt-8 flex justify-center items-center space-x-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-lg rounded transition duration-300
                  ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white hover:opacity-90'
                  }`}
              >
                &lt;
              </button>

              <span className="text-gray-700 font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-lg rounded transition duration-300
                  ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white hover:opacity-90'
                  }`}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FetchTest;
