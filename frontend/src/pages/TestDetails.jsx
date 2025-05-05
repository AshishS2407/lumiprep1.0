import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCertificate, FaDesktop, FaBookOpen, FaClock } from "react-icons/fa";
import SidebarLayout from "../components/SideBarLayout";

const TestDetails = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(res.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };

    fetchTest();
  }, [testId]);

  if (!test) return <p className="p-8 text-lg">Loading test...</p>;

  return (
    <SidebarLayout>
      <div className="min-h-screen p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-4xl mt-14 sm:mt-24 mx-auto">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-800">{test.testTitle}</h2>
    <p className="text-gray-500 text-sm">{test.companyName}</p>
  </div>
  <button
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition w-full sm:w-auto sm:ml-auto"
    onClick={() => navigate(`/start-test/${test._id}`)}
  >
    Start Test
  </button>
</div>





          <div className="mt-4 bg-green-100 text-green-800 rounded-md px-4 py-2 flex flex-row items-center gap-2 text-sm font-medium">
          <FaCertificate />
            <span>
              Certification: We will issue you a free <span className="underline">Certificate Of Achievement</span> if you score in the top 25%.
            </span>
          </div>

          <div className="mt-6 text-sm text-gray-700 w-full">
  <div className="flex font-medium text-gray-500 border-b pb-2">
    <div className="w-1/3">Questions Type</div>
    <div className="w-1/3">No Of Questions</div>
    <div className="w-1/3">Level</div>
  </div>
  <div className="flex py-2 border-b">
    <div className="w-1/3">MCQ Questions</div>
    <div className="w-1/3">{test.mcqCount || "10"} Questions</div>
    <div className="w-1/3">{test.level || "Medium"}</div>
  </div>
  <div className="flex py-2">
    <div className="w-1/3">Programming Question</div>
    <div className="w-1/3">{test.programmingCount || "10"} Questions</div>
    <div className="w-1/3">{test.level || "Medium"}</div>
  </div>
</div>


          <div className="mt-6 p-4 rounded-xl border border-gray-300 bg-white flex flex-col gap-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <FaDesktop className="text-purple-500 mt-1" />
              <span>We recommend having an environment ready, so you can solve problems outside of the browser.</span>
            </div>
            <div className="flex items-start gap-2">
              <FaBookOpen className="text-pink-500 mt-1" />
              <span>You can use any documentation, files, or other helpful resources.</span>
            </div>
            <div className="flex items-start gap-2">
              <FaClock className="text-indigo-500 mt-1" />
              <span>{test.duration || 30} Minutes (No breaks allowed)</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4">
            {/* <button className="px-2 py-1 text-lg text-gray-400 hover:text-black">&lt;</button>
            <span className="text-gray-700 font-medium">7 / 18</span>
            <button className="px-2 py-1 text-lg text-gray-400 hover:text-black">&gt;</button> */}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default TestDetails;
