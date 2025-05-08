import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    companyName: '',
    testTitle: '',
    description: '',
    validTill: '',
    duration: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('No token found. Please log in.');
      navigate('/login');
      return;
    }

    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const test = res.data;
        setFormData({
          companyName: test.companyName || '',
          testTitle: test.testTitle || '',
          description: test.description || '',
          validTill: test.validTill ? test.validTill.split('T')[0] : '',
          duration: test.duration || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch test');
      }
    };

    fetchTest();
  }, [testId, token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3000/tests/update/${testId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Test updated successfully');
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update test');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
      />

      <input
        type="text"
        name="testTitle"
        placeholder="Test Title"
        value={formData.testTitle}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
      />

      <input
        type="date"
        name="validTill"
        value={formData.validTill}
        onChange={handleChange}
        className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
      />

      <input
        type="number"
        name="duration"
        placeholder="Duration (in minutes)"
        value={formData.duration}
        onChange={handleChange}
        required
        className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
      />

<button
  type="submit"
  className="w-full bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white px-4 py-3 rounded-md hover:opacity-90 transition duration-300"
>
  Update Test
</button>

    </form>
  );
};

export default UpdateTest;
