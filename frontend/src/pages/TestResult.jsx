import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import QuizSidebar from "../components/QuizSidebar";
import ResultQuestionCard from "../components/ResultQuestionCard";

const TestResult = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [test, setTest] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const [evalRes, explanationRes, testRes] = await Promise.all([
          axios.get(`http://localhost:3000/tests/${testId}/evaluate`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/tests/${testId}/explanations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/tests/${testId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setResult(evalRes.data);
        setQuestions(explanationRes.data.questions);
        setTest(testRes.data.test || testRes.data);
      } catch (err) {
        console.error("Failed to load test result:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId, navigate]);

  const handleFilter = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/tests/${testId}/explanations/filter?filter=${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFilteredQuestions(res.data.filtered);
    } catch (error) {
      console.error("Filter fetch failed", error);
    }
  };

  const getOptionStyle = (q, option, index) => {
    const detail = result?.details.find((d) => d.questionId === q._id || d.questionId === q.questionId);
    const isSelected = detail?.selectedOptionIndex === index;
    const isCorrect = detail?.correctOptionIndex === index;

    if (isCorrect) return "bg-green-100 border-green-600";
    if (isSelected && !isCorrect) return "bg-red-100 border-red-600";
    return "bg-white border-gray-300";
  };

  if (loading || !test)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading results...</div>
      </div>
    );

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] p-6">
      {/* Header with Title and Summary */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{test.testTitle}</h1>
          <p className="text-gray-500 text-sm">{test.companyName}</p>
        </div>

        <div className="bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-sm grid grid-cols-3 gap-6 text-center text-sm font-medium">
          <div>
            <p className="text-gray-500">Score</p>
            <p className="text-purple-700 font-bold text-lg">{percentage}%</p>
          </div>
          <div>
            <p className="text-gray-500">Correct</p>
            <p className="text-green-600 font-semibold text-lg">{result.correctAnswers}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-gray-800 font-semibold text-lg">{result.totalQuestions}</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleFilter("correct")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
        >
          Show Correct
        </button>
        <button
          onClick={() => handleFilter("incorrect")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
        >
          Show Incorrect
        </button>
        {filteredQuestions && (
          <button
            onClick={() => setFilteredQuestions(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
          >
            Show All
          </button>
        )}
      </div>

      {/* Main container: SIDEBAR + QUESTION PANEL inside one card */}
   <div className="flex flex-col md:flex-row rounded-3xl shadow-lg overflow-hidden bg-white min-h-[80vh] max-w-6xl mx-auto">
    {/* Sidebar - hidden on small screens */}
    <div className="hidden md:block md:w-1/5 bg-gray-900 text-white p-6">
      <QuizSidebar />
    </div>

        {/* Review Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
            {test.companyName} Quiz Review
          </h2>

          {(filteredQuestions || questions).map((q, idx) => {
            const detail = result.details.find((d) => d.questionId === q._id || d.questionId === q.questionId);
            return (
              <ResultQuestionCard
                key={q.questionId || q._id}
                question={q}
                index={idx}
                detail={detail}
                getOptionStyle={getOptionStyle}
              />
            );
          })}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/thank-you")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-full shadow-lg transition duration-200"
            >
              Finish Test
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestResult;
