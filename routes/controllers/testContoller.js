const Test = require('../../models/test/testModel');
const UserTestStatus = require('../../models/test/userTestStatusModel');
const Question = require('../../models/test/questionModel');
const UserAnswer = require('../../models/test/answerModel');

// Admin: Create Test
exports.createTest = async (req, res) => {
  try {
    const { companyName, testTitle, description, validTill, duration } = req.body;

    if (!duration) {
      return res.status(400).json({ message: 'Duration is required' });
    }

    const newTest = await Test.create({ companyName, testTitle, description, validTill, duration });
    res.status(201).json({ message: 'Test created', test: newTest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};


// Admin: Add Question to Test
exports.addQuestion = async (req, res) => {
  try {
    const testId = req.params.testId; // 🔹 Get from URL
    const { questionText, options } = req.body;
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Must provide exactly 4 options' });
    }

    const question = await Question.create({ testId, questionText, options });
    res.status(201).json({ message: 'Question added', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add question', error: error.message });
  }
};


exports.getUserTests = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user

    const tests = await Test.find();

    // Fetch user-specific statuses
    const statuses = await UserTestStatus.find({ userId });

    // Create a map of testId to status
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.testId.toString()] = s.status;
    });

    // Attach status to each test
    const testsWithStatus = tests.map((test) => {
      return {
        ...test.toObject(),
        status: statusMap[test._id.toString()] || "Upcoming", // fallback
      };
    });

    res.json(testsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tests" });
  }
};


// User: Get Questions for a Test
exports.getTestQuestions = async (req, res) => {
  const { testId } = req.params;

  try {
    const questions = await Question.find({ testId }).select('-options.isCorrect');
    res.status(200).json({ questions, timer: 30 * 60 }); // 30 mins
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// Get single test by ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
};


// User: Submit Answers
exports.submitAnswers = async (req, res) => {
  const { testId, answers } = req.body;
  const userId = req.user.id;

  try {
    const submitted = await UserAnswer.findOne({ userId, testId });
    if (submitted) return res.status(400).json({ message: 'Already submitted' });

    await UserAnswer.create({ userId, testId, answers, submittedAt: new Date() });

    await UserTestStatus.findOneAndUpdate(
      { userId, testId },
      { status: 'Submitted' },
      { upsert: true }
    );

    res.status(200).json({ message: 'Answers submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit answers', error: error.message });
  }
};


exports.evaluateTest = async (req, res) => {
  const { testId } = req.params;
  const userId = req.user.id;

  try {
    const submission = await UserAnswer.findOne({ userId, testId });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }

    const questions = await Question.find({ testId });

    let correctCount = 0;
    const detailedResults = [];

    for (const question of questions) {
      const submittedAnswer = submission.answers.find(
        (ans) => ans.questionId.toString() === question._id.toString()
      );

      const correctIndex = question.options.findIndex((opt) => opt.isCorrect);

      const isCorrect = submittedAnswer?.selectedOptionIndex === correctIndex;

      if (isCorrect) correctCount++; // ✅ Count only if correct

      detailedResults.push({
        questionId: question._id,
        selectedOptionIndex: submittedAnswer?.selectedOptionIndex ?? null,
        correctOptionIndex: correctIndex,
        isCorrect,
      });
    }

    res.status(200).json({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      details: detailedResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to evaluate test', error: error.message });
  }
};



exports.addExplanation = async (req, res) => {
  const { testId, questionId } = req.params;
  const { explanation } = req.body;

  try {
    const question = await Question.findOneAndUpdate(
      { _id: questionId, testId },
      { explanation },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Explanation updated', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update explanation', error: error.message });
  }
};


exports.getExplanations = async (req, res) => {
  const { testId } = req.params;
  const userId = req.user.id;

  try {
    const userTest = await UserTestStatus.findOne({ userId, testId });

    if (!userTest || userTest.status !== 'Submitted') {
      return res.status(403).json({ message: 'You must submit the test first to view explanations' });
    }

    const questions = await Question.find({ testId }).select('questionText options explanation');

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching explanations', error: error.message });
  }
};


// Get last two submitted tests by the user
exports.getRecentSubmittedTests = async (req, res) => {
  const userId = req.user.id;

  try {
    const recentSubmissions = await UserAnswer.find({ userId })
      .sort({ submittedAt: -1 }) // Latest first
      .limit(2);

    const testIds = recentSubmissions.map(sub => sub.testId);

    const tests = await Test.find({ _id: { $in: testIds } });

    res.status(200).json({ tests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent submitted tests', error: error.message });
  }
};


exports.getFilteredExplanations = async (req, res) => {
  const { testId } = req.params;
  const { filter } = req.query; 
  const userId = req.user.id;

  if (!['correct', 'incorrect'].includes(filter)) {
    return res.status(400).json({ message: "Invalid filter. Use 'correct' or 'incorrect'" });
  }

  try {
    const userTestStatus = await UserTestStatus.findOne({ userId, testId });
    if (!userTestStatus || userTestStatus.status !== 'Submitted') {
      return res.status(403).json({ message: 'Submit the test to view explanations' });
    }

    const submission = await UserAnswer.findOne({ userId, testId });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const questions = await Question.find({ testId });

    const filtered = [];

    for (const question of questions) {
      const correctIndex = question.options.findIndex(opt => opt.isCorrect);
      const userAnswer = submission.answers.find(ans => ans.questionId.toString() === question._id.toString());

      const isCorrect = userAnswer?.selectedOptionIndex === correctIndex;

      if ((filter === 'correct' && isCorrect) || (filter === 'incorrect' && !isCorrect)) {
        filtered.push({
          questionId: question._id,
          questionText: question.questionText,
          options: question.options,
          explanation: question.explanation,
          selectedOptionIndex: userAnswer?.selectedOptionIndex ?? null,
          correctOptionIndex: correctIndex,
        });
      }
    }

    res.status(200).json({ filtered });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filtered explanations', error: error.message });
  }
};


// Admin: Update Test
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const updateData = req.body;

    const updatedTest = await Test.findByIdAndUpdate(testId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({ message: "Test updated", test: updatedTest });
  } catch (error) {
    res.status(500).json({ message: "Error updating test", error: error.message });
  }
};


