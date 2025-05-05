import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newTest, setNewTest] = useState({
    companyName: '',
    testTitle: '',
    description: '',
    validTill: ''
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });

  const questionSectionRef = useRef(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:3000/tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data.tests || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setTests([]);
    }
  };

  const handleCreateTest = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('http://localhost:3000/tests', newTest, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewTest({
        companyName: '',
        testTitle: '',
        description: '',
        validTill: ''
      });

      await fetchTests();
      const createdTestId = res.data.test?._id;
      if (createdTestId) {
        setSelectedTest(createdTestId);
        fetchQuestions(createdTestId);
        // Scroll to the questions section
        setTimeout(() => {
          questionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleAddQuestion = async (testId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/tests/${testId}/questions`, newQuestion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewQuestion({
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      });
      fetchQuestions(testId);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const fetchQuestions = async (testId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/tests/${testId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.questions || []);
      setSelectedTest(testId);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const handleAddExplanation = async (testId, questionId, explanation) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/tests/${testId}/questions/${questionId}/explanation`, { explanation }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions(testId);
    } catch (error) {
      console.error('Error adding explanation:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Create Test Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create New Test</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Company Name</label>
            <input className="w-full border rounded px-4 py-2" value={newTest.companyName} onChange={e => setNewTest({ ...newTest, companyName: e.target.value })} />
          </div>
          <div>
            <label className="block font-medium mb-1">Test Title</label>
            <input className="w-full border rounded px-4 py-2" value={newTest.testTitle} onChange={e => setNewTest({ ...newTest, testTitle: e.target.value })} />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-4 py-2" value={newTest.description} onChange={e => setNewTest({ ...newTest, description: e.target.value })} />
          </div>
          <div>
            <label className="block font-medium mb-1">Valid Till</label>
            <input type="date" className="w-full border rounded px-4 py-2" value={newTest.validTill} onChange={e => setNewTest({ ...newTest, validTill: e.target.value })} />
          </div>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleCreateTest}
          >
            Create Test
          </button>
        </div>
      </div>

      {/* All Tests List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">All Tests</h2>
        {Array.isArray(tests) && tests.length > 0 ? (
          <div className="space-y-4">
            {tests.map(test => (
              <div key={test._id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{test.testTitle}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={() => fetchQuestions(test._id)}>
                  View/Add Questions
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tests found.</p>
        )}
      </div>

      {/* Add Question and View Questions */}
      {selectedTest && (
        <div ref={questionSectionRef} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Add Question</h2>
          <div className="space-y-4">
            <input
              className="w-full border rounded px-4 py-2"
              placeholder="Question Text"
              value={newQuestion.questionText}
              onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            />

            {newQuestion.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  className="flex-1 border rounded px-4 py-2"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => {
                    const updated = [...newQuestion.options];
                    updated[i].text = e.target.value;
                    setNewQuestion({ ...newQuestion, options: updated });
                  }}
                />
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={e => {
                    const updated = [...newQuestion.options];
                    updated[i].isCorrect = e.target.checked;
                    setNewQuestion({ ...newQuestion, options: updated });
                  }}
                />
                <label className="text-sm">Correct</label>
              </div>
            ))}

            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => handleAddQuestion(selectedTest)}>
              Add Question
            </button>
          </div>

          {/* Questions List */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Questions</h3>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map(q => (
              <div key={q._id} className="border p-4 rounded mb-3 bg-gray-50">
                <p className="font-medium text-gray-800 mb-2">{q.questionText}</p>
                <ul className="list-disc pl-5 text-sm">
                  {q.options.map((o, i) => (
                    <li key={i}>
                      {o.text} {o.isCorrect && <strong className="text-green-600">(Correct)</strong>}
                    </li>
                  ))}
                </ul>
                <input
                  className="w-full mt-2 border px-3 py-2 rounded"
                  placeholder="Add/Update Explanation"
                  defaultValue={q.explanation || ''}
                  onBlur={e => handleAddExplanation(selectedTest, q._id, e.target.value)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
