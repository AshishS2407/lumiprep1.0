// src/pages/AddQuestionForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'framer-motion';

const AddQuestionForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');

  const [test, setTest] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(res.data);
      } catch (err) {
        setError('Failed to fetch test details');
      }
    };
    fetchTest();
  }, [id, token]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!questionText || options.some((opt) => opt.text.trim() === '')) {
      setError('Question and all options are required.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/tests/${id}/questions`,
        { questionText, options },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || 'Question added successfully');
      setQuestionText('');
      setOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    }
  };

  return (

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Add Question to: {test?.testTitle || 'Loading...'}
          </h1>

          {error && <div className="text-red-600 mb-2">{error}</div>}
          {message && <div className="text-green-600 mb-2">{message}</div>}

          <input
            type="text"
            placeholder="Enter question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full border p-2 rounded mb-4 placeholder:text-gray-400 "
          />

          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2 ">
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt.text}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="w-full border p-2 rounded placeholder:text-gray-400"
              />
              <input
                type="radio"
                name="correctOption"
                checked={opt.isCorrect}
                onChange={() => handleCorrectChange(idx)}
              />
              <label>Correct</label>
            </div>
          ))}

<button
  className="mt-6 px-5 py-2 text-white font-medium rounded bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition"
  onClick={handleSubmit}
>
  Submit Question
</button>
        </motion.div>
      </div>
  );
};

export default AddQuestionForm;
