import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import QuizSidebar from "../components/QuizSidebar";
import Sidebar from "../components/SideBar";
import QuestionCardSelectable from "../components/QuestionCardSelectable";

const StartTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem(`answers-${testId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [timer, setTimer] = useState(null); // initially null

  // Fetch test and questions
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [testRes, questionsRes] = await Promise.all([
          axios.get(`http://localhost:3000/tests/${testId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/tests/${testId}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const fetchedTest = testRes.data.test || testRes.data;
        setTest(fetchedTest);
        setQuestions(questionsRes.data.questions || questionsRes.data);

        // Initialize timer once test is loaded
        const savedTimer = localStorage.getItem(`timer-${testId}`);
        const initialSeconds = savedTimer
          ? parseInt(savedTimer, 10)
          : (fetchedTest.duration || 30) * 60; // default to 30 minutes if duration missing
        setTimer(initialSeconds);
      } catch (err) {
        console.error("Failed to fetch test data:", err);
      }
    };

    fetchTestData();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timer === null) return; // don't start interval until timer is ready

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timer]);

  // Save timer
  useEffect(() => {
    if (timer !== null) {
      localStorage.setItem(`timer-${testId}`, timer);
    }
  }, [timer, testId]);

  // Save answers
  useEffect(() => {
    localStorage.setItem(`answers-${testId}`, JSON.stringify(selectedAnswers));
  }, [selectedAnswers, testId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: index,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })
    );

    try {
      await axios.post(
        `http://localhost:3000/tests/${testId}/submit-answers`,
        { testId, answers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem(`answers-${testId}`);
      localStorage.removeItem(`timer-${testId}`);

      navigate(`/test/${testId}/submitted`);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  if (!test || timer === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading test...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {test.testTitle}
          </h1>
          <p className="text-gray-500 text-sm">{test.companyName}</p>
        </div>
        <div className="text-lg font-mono bg-white border border-gray-300 px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
          ⏱ {formatTime(timer)}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row rounded-3xl shadow-lg overflow-hidden bg-white min-h-[80vh] max-w-6xl mx-auto">
        {/* Sidebar */}
        <div className="hidden md:block md:w-1/5 bg-gray-900 text-white p-6">
          <QuizSidebar />
        </div>

        {/* Questions */}
        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
            {test.companyName} Quiz Competition Questions
          </h2>

          {questions.map((q, idx) => (
            <QuestionCardSelectable
              key={q._id}
              question={q}
              index={idx}
              selectedAnswer={selectedAnswers[q._id]}
              onSelect={handleSelect}
            />
          ))}

          <div className="text-center mt-10">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-full shadow-lg transition duration-200"
            >
              Submit Answers
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StartTest;
