import React from "react";

// Status colors based on test status
const statusColors = {
  Upcoming: "bg-purple-200 text-purple-700",
  Submitted: "bg-green-200 text-green-700",
  Expired: "bg-red-200 text-red-700",
};

const TestCard = ({ test, onClick }) => {
  // Determine the status style based on the test's status
  const statusStyle = statusColors[test.status] || "bg-gray-200 text-gray-700";

  return (
    <div
      className="mt-2 md:mt-4 bg-gray-100 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform cursor-pointer w-96 mx-auto"
      onClick={onClick} // Ensure this triggers the navigation when clicked
    >
      <div className="flex justify-between mb-3">
        {/* <img src={test.logoUrl} alt={test.testTitle} className="h-8" /> */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle}`}
        >
          {test.status}
        </span>
      </div>
      <h2 className="text-lg font-semibold mb-1">{test.testTitle}</h2>
      <p className="text-sm text-gray-500">{test.description}</p>
    </div>
  );
};

export default TestCard;
