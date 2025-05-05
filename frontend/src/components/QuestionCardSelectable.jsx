// components/QuestionCardSelectable.js

const QuestionCardSelectable = ({
    question,
    index,
    selectedAnswer,
    onSelect,
  }) => {
    return (
      <div className="mb-6 p-6 bg-white rounded-2xl shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">
          {index + 1}. {question.questionText}
        </h3>
        <ul className="space-y-4">
          {question.options.map((option, i) => (
            <li key={i}>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={i}
                  checked={selectedAnswer === i}
                  onChange={() => onSelect(question._id, i)}
                  className="accent-purple-600 scale-125"
                />
                <span className="text-gray-700 text-md">{option.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default QuestionCardSelectable;
  