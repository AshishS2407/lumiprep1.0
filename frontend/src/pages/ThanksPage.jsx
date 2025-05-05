import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

export default function ThankYouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/tests"); // Redirect to homepage or dashboard after a delay
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-start py-12 px-4">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div>
          {/* <img src="/logo.svg" alt="tcs ion logo" className="h-10" /> */}
          <div className="text-sm text-gray-500 mt-1">TCS Quiz Competition<br/>TCS Campus Drive-2023</div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-lg">
          <Clock className="text-purple-500" />
          <span className="font-mono">00:00:00</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white p-10 rounded-3xl shadow-md text-center max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold mb-4">Thanks For Participating</h1>
        <p className="text-xl text-gray-700 mb-8">Your Test Has Completed !</p>
        {/* <img
          src="/thankyou-illustration.png"
          alt="Illustration"
          className="mx-auto w-64 h-auto mb-8"
        /> */}
        <p className="text-sm text-gray-500">
          You will be notified when you test results were released
        </p>
      </div>
    </div>
  );
}
