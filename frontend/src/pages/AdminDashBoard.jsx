import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';

const cardData = [
  {
    title: 'Create Test',
    description: 'Design and publish structured assessments based on topic and level.',
    border: 'border-purple-500',
  },
  {
    title: 'Add Questions',
    description: 'Build diverse question banks with options and correct answers.',
    border: 'border-blue-500',
  },
  {
    title: 'Add Explanations',
    description: 'Clarify answers with detailed explanations for better learning.',
    border: 'border-emerald-500',
  },
  {
    title: 'Manage Tests',
    description: 'View, update, and maintain your test repository efficiently.',
    border: 'border-pink-500',
  },
  {
    title: 'Test Statistics',
    description: 'Analyze performance metrics and identify trends in user data.',
    border: 'border-yellow-500',
  },
  {
    title: 'Recent Activity',
    description: 'Monitor latest changes and administrative actions in the system.',
    border: 'border-indigo-500',
  },
  {
    title: 'System Logs',
    description: 'Track backend operations and ensure transparency in system behavior.',
    border: 'border-red-400',
  },
  {
    title: 'Admin Notes',
    description: 'Add personal notes or to-dos for upcoming test plans or reviews.',
    border: 'border-gray-400',
  },
];

const AdminDashBoard = () => {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AdminSidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-semibold text-gray-800 mb-4"
        >
          Admin Dashboard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-600 mb-10"
        >
          All essential tools for test creation, monitoring, and system administration in one place.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`p-6 bg-white rounded-2xl border-l-4 ${card.border} shadow hover:shadow-xl transition duration-300`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
