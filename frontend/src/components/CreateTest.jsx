import React, { useState } from 'react';
import axios from 'axios';

const CreateTest = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    testTitle: '',
    description: '',
    validTill: '',
    duration: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('You must be logged in to create a test.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:3000/tests', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      setFormData({
        companyName: '',
        testTitle: '',
        description: '',
        validTill: '',
        duration: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };
  

return (
  <form onSubmit={handleSubmit} className="space-y-5">
    {message && <div className="text-green-600">{message}</div>}
    {error && <div className="text-red-600">{error}</div>}

    <input
      type="text"
      name="companyName"
      placeholder="Company Name"
      value={formData.companyName}
      onChange={handleChange}
      required
      className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400  focus:ring-2 border-gray-300 focus:ring-purple-400"
    />

    <input
      type="text"
      name="testTitle"
      placeholder="Test Title"
      value={formData.testTitle}
      onChange={handleChange}
      required
      className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400  focus:ring-2 border-gray-300 focus:ring-purple-400"
    />

    <textarea
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className="w-full border p-3 rounded-md shadow-sm focus:outline-none placeholder:text-gray-400  focus:ring-2 border-gray-300 focus:ring-purple-400"
    />

    <input
      type="date"
      name="validTill"
      value={formData.validTill}
      onChange={handleChange}
      className="w-full border p-3 rounded-md shadow-sm focus:outline-none  placeholder:text-gray-400 focus:ring-2 border-gray-300 focus:ring-purple-400"
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
  className="w-full text-white px-4 py-3 rounded-md bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300"
>
  Create Test
</button>

  </form>
);

};

export default CreateTest;
