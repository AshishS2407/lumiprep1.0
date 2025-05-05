import React from "react";
import SidebarLayout from "../components/SideBarLayout";
import RecentTests from "../components/RecentTests";

const UserDashboard = () => {
  return (
    <SidebarLayout>
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentTests />

        {/* Quiz Competition */}
<div className="w-96 md:w-full mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Quiz Competition</h3>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-5xl mb-2 text-[#a14bf4]">12</div>
            <p className="text-gray-600 mb-2">12th Aug, 2023</p>
            <button className="bg-[#a14bf4] hover:bg-[#8e3ef3] text-white py-2 px-4 rounded-full mt-2">
              Register Now
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="w-96 md:w-full mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Leader Board</h3>
          <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
            {[
              { name: "John Leboo" },
              { name: "Samuel Kingasunye" },
              { name: "Stephen Kerubo" },
            ].map((user, i) => (
              <div key={i} className="flex items-center gap-4">
                <img
                  src={`https://i.pravatar.cc/40?img=${i + 1}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-sm font-medium text-gray-700">{user.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-rows-4 w-96 md:w-full mx-auto sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-2xl font-bold text-[#a14bf4]">32</p>
          <p className="text-gray-600 text-sm">Tests Written</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-2xl font-bold text-green-500">12</p>
          <p className="text-gray-600 text-sm">Passed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-2xl font-bold text-red-500">19</p>
          <p className="text-gray-600 text-sm">Failed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-2xl font-bold text-purple-500">80%</p>
          <p className="text-gray-600 text-sm">Overall Average</p>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default UserDashboard;
