import React from "react";
import SidebarLayout from "../components/SideBarLayout";
import RecentTests from "../components/RecentTests";
import DashboardStats from "../components/DashboardStats";

const UserDashboard = () => {
  return (
    <SidebarLayout>
      {/* Top Row: Recent Tests + Upcoming Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Tests */}
        <RecentTests />

        {/* Quiz Competition */}
        <div className="w-96 mx-auto md:w-96 md:ml-44">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 md:mt10">Upcoming Quiz Competition</h3>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center md:mt-20">
            <div className="text-5xl mb-2 text-[#a14bf4]">12</div>
            <p className="text-gray-600 mb-2">12th Aug, 2023</p>
            <button className="bg-[#a14bf4] hover:bg-[#8e3ef3] text-white py-2 px-4 rounded-full mt-2">
              Register Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Leaderboard + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-10 md:mt-30 ">
        {/* Leaderboard */}
        <div className="w-96 mx-auto md:mx-0 md:w-[400px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Leader Board</h3>
          <div className="bg-gray-100 p-4 rounded-xl shadow-md space-y-4 md:mt-10">
            {[
              { name: "John Leboo", medal: "🥇" },
              { name: "Samuel Kingasunye", medal: "🥈" },
              { name: "Stephen Kerubo", medal: "🥉" },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 1}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-sm font-medium text-gray-700">{user.name}</div>
                </div>
                <div className="text-xl">{user.medal}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="md:mt-8">
  <DashboardStats />
</div>
      </div>
    </SidebarLayout>
  );
};

export default UserDashboard;
