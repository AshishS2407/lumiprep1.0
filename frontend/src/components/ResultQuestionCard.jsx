// ResultQuestionCard.js
const ResultQuestionCard = ({ question, index, detail, getOptionStyle }) => {
    return (
      <div className="mb-6 p-6 bg-white rounded-2xl shadow border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">
          {index + 1}. {question.questionText}
        </h2>
        <ul className="space-y-3 mb-4">
          {question.options.map((option, i) => (
            <li
              key={i}
              className={`p-3 border rounded-lg ${getOptionStyle(question, option, i)} text-gray-800`}
            >
              {option.text}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          <strong>Explanation:</strong>{" "}
          {question.explanation || "No explanation provided."}
        </p>
      </div>
    );
  };
  
  export default ResultQuestionCard;
  