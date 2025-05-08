import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import Explanation from '../components/Explanation';

const ExplanationPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] font-sans">
      <AdminSidebar />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-center text-gray-800 mb-8"
          >
            Manage Question Explanations
          </motion.h1>

          <Explanation />
        </motion.div>
      </div>
    </div>
  );
};

export default ExplanationPage;
