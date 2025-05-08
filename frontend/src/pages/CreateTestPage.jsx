import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import CreateTest from '../components/CreateTest';

const CreateTestPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] font-sans">
      <AdminSidebar />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10 bg-white rounded-2xl border-l- border-gray-400 shadow hover:shadow-xl w-full max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Create a New Test
          </motion.h1>

          <CreateTest />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTestPage;
