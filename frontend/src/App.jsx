// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import TestPage from "./pages/AllTestPage";
import TestDetails from "./pages/TestDetails";
import StartTest from "./pages/StartTest";
import TestResult from "./pages/TestResult";
import ThankYouPage from "./pages/ThanksPage";
import AdminDashboard from "./pages/AdminDashBoard";

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
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
