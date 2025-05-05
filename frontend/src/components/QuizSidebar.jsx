// QuizSidebar.js
const QuizSidebar = () => {
  return (
    <aside className="w-full lg:w-1/6 bg-gray-900 text-white p-4 sm:p-6 flex flex-col items-start lg:rounded-tr-2xl lg:rounded-br-2xl shadow-xl">
      <h2 className="text-lg font-semibold mb-6 sm:mb-8">Section</h2>
      <nav className="space-y-4 text-md">
        <div className="text-purple-400 font-medium">MCQ</div>
        {/* Future sections like Programming can go here */}
      </nav>
    </aside>
  );
};

export default QuizSidebar;
