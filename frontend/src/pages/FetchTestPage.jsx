import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import FetchTest from '../components/FetchTest';
import { motion } from 'framer-motion';

const FetchTestPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#e6e3f6] via-[#e8f0f9] to-[#f5eaf7] font-sans">
      <AdminSidebar />

      <div className="flex-1 p-10 overflow-y-auto">
        

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-10 max-w-5xl mx-auto"
        >
          <FetchTest />
        </motion.div>
      </div>
    </div>
  );
};

export default FetchTestPage;
