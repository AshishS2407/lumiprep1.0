import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddExplanation = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 9;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTests = async () => {
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
  }, [token]);

  const handleViewQuestions = (testId) => {
    navigate(`/explanation/${testId}`);
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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* Test cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentTests.map((test) => (
          <div
            key={test._id}
            className="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm flex flex-col items-center"
          >
            <h3 className="font-semibold text-lg text-center">{test.testTitle}</h3>
            <p className="text-sm text-gray-600 text-center">Company: {test.companyName}</p>
            <button
              className="mt-4 px-4 py-2 text-white rounded bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300"
              onClick={() => handleViewQuestions(test._id)}
            >
              View Questions
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {tests.length > testsPerPage && (
        <div className="mt-8 flex justify-center items-center space-x-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-lg rounded transition duration-300 ${
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
            className={`px-3 py-1 text-lg rounded transition duration-300 ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white hover:opacity-90'
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AddExplanation;
