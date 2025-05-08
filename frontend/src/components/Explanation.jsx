import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Explanation = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newExplanation, setNewExplanation] = useState('');
  const [visibleExplanationForm, setVisibleExplanationForm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2;

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tests/${testId}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, [testId, token]);

  const handleAddExplanation = async (questionId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/tests/${testId}/questions/${questionId}/explanation`,
        { explanation: newExplanation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setNewExplanation('');
      setVisibleExplanationForm(null);

      const refresh = await axios.get(`http://localhost:3000/tests/${testId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(refresh.data.questions || refresh.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update explanation');
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Questions for Test</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {message && <div className="text-green-600 mb-2">{message}</div>}

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions found.</p>
      ) : (
        <>
          {currentQuestions.map((q) => (
            <div key={q._id} className="mb-6 border-b pb-4">
              <p className="font-medium">{q.questionText}</p>
              <ul className="list-disc ml-6 mt-1">
                {q.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={opt.isCorrect ? 'text-green-600 font-semibold' : ''}
                  >
                    {opt.text}
                  </li>
                ))}
              </ul>

              <p className="mt-1 text-sm text-gray-500">
                {q.explanation ? (
                  <span className="text-green-600">Explanation: {q.explanation}</span>
                ) : (
                  <span className="text-red-500">No explanation added</span>
                )}
              </p>

              {visibleExplanationForm === q._id ? (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded placeholder:text-gray-400"
                    rows="3"
                    placeholder="Enter explanation"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF]  text-white px-4 py-1 rounded"
                      onClick={() => handleAddExplanation(q._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 py-1 rounded"
                      onClick={() => setVisibleExplanationForm(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-2 text-sm text-blue-600 underline"
                  onClick={() => {
                    setVisibleExplanationForm(q._id);
                    setNewExplanation(q.explanation || '');
                  }}
                >
                  {q.explanation ? 'Edit Explanation' : 'Add Explanation'}
                </button>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          {questions.length > questionsPerPage && (
            <div className="mt-6 flex justify-center items-center space-x-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-lg rounded ${
                  currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:text-black'
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
                className={`px-3 py-1 text-lg rounded ${
                  currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:text-black'
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

export default Explanation;
