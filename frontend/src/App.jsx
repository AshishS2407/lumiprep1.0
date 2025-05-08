// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboard";
import TestPage from "./pages/AllTestPage";
import TestDetails from "./pages/TestDetails";
import StartTest from "./pages/StartTest";
import TestResult from "./pages/TestResult";
import ThankYouPage from "./pages/ThanksPage";
import AdminDashboard from "./pages/AdminDashBoard";
import CreateTestPage from "./pages/CreateTestPage";
import UpdateTestPage from "./pages/UpdateTestPage";
import FetchTestPage from "./pages/FetchTestPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddExplanationPage from "./pages/AddExplanationPage";
import ExplanationPage from "./pages/ExplanationPage";
import AddQuestionFormPage from "./pages/AddQuestionFormPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/tests" element={<TestPage />} />
        <Route path="/tests/:testId" element={<TestDetails />} />
        <Route path="/start-test/:testId" element={<StartTest />} />
        <Route path="/test/:testId/submitted" element={<TestResult />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tests/update/:testId" element={<UpdateTestPage />} />
        <Route path="/admin/create-test" element={<CreateTestPage />} />
        <Route path="/admin/update-test" element={<FetchTestPage/>} />
        <Route path="/admin/add-explanations" element={<AddExplanationPage/>} />
        <Route path="/admin/add-questions" element={<AddQuestionPage/>} />
        <Route path="/explanation/:testId" element={<ExplanationPage />} />
        <Route path="/add-question/:id" element={<AddQuestionFormPage />} />


      </Routes>
    </Router>
  );
}

export default App;
