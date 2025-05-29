const MockTest = require('../../models/test/mockTest');
const MockQuestion = require("../../models/test/mockQuestionModel")
const Test = require('../../models/test/testModel');
const UserAnswer = require('../../models/test/answerModel'); // your model
const UserTestStatus = require('../../models/test/userTestStatusModel'); // your model
const mongoose = require('mongoose');


// Create a mock test
exports.createMockTest = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    const newMockTest = new MockTest({ name, description });
    await newMockTest.save();
    res.status(201).json({ message: 'Mock test created successfully', mockTest: newMockTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating mock test' });
  }
};

// Get all mock tests
exports.getAllMockTests = async (req, res) => {
  try {
    const mockTests = await MockTest.find();
    res.status(200).json(mockTests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mock tests' });
  }
};

// Get a single mock test by ID
exports.getMockTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const mockTest = await MockTest.findById(id);
    if (!mockTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }
    res.status(200).json(mockTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mock test' });
  }
};

// Update a mock test by ID
exports.updateMockTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedTest = await MockTest.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    res.status(200).json({ message: 'Mock test updated successfully', mockTest: updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating mock test' });
  }
};

// Delete a mock test by ID
exports.deleteMockTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTest = await MockTest.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: 'Mock test not found' });
    }

    res.status(200).json({ message: 'Mock test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting mock test' });
  }
};


// Admin: Add Question to Mock Test
exports.addQuestionToMockTest = async (req, res) => {
  try {
    const mockTestId = req.params.mockTestId;
    const { questionText, options, explanation, subTestCategory } = req.body;

    // Validate options array
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Must provide exactly 4 options' });
    }

    // Validate that exactly one correct option exists
    const correctOptions = options.filter(opt => opt.isCorrect === true);
    if (correctOptions.length !== 1) {
      return res.status(400).json({ message: 'Exactly one option must be marked as correct' });
    }

    // Validate subTestCategory
    if (!subTestCategory || typeof subTestCategory !== 'string' || subTestCategory.trim() === '') {
      return res.status(400).json({ message: 'subTestCategory is required and must be a non-empty string' });
    }

    // Get admin info from auth middleware
    const addedBy = {
      userId: req.user.id,
      name: req.user.name
    };

    // Save the question
    const question = await MockQuestion.create({
      mockTestId,
      questionText,
      options,
      explanation,
      subTestCategory: subTestCategory.trim(),
      addedBy
    });

    res.status(201).json({ message: 'Question added', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add question', error: error.message });
  }
};




exports.getQuestionsByMockTest = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const questions = await MockQuestion.find({ mockTestId });
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

// Update a question by questionId
exports.updateMockQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questionText, options, explanation, subTestCategory } = req.body;

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (!subTestCategory || typeof subTestCategory !== 'string' || subTestCategory.trim() === '') {
      return res.status(400).json({ message: 'subTestCategory is required and must be a non-empty string' });
    }

    const updatedQuestion = await MockQuestion.findByIdAndUpdate(
      questionId,
      {
        questionText,
        options,
        explanation,
        subTestCategory: subTestCategory.trim(),
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated', question: updatedQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
};

// Delete a question by questionId
exports.deleteMockQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const deleted = await MockQuestion.findByIdAndDelete(questionId);

    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};

// Get single question by ID
exports.getMockQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await MockQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch question", error: error.message });
  }
};


exports.getQuestionsByMockTest = async (req, res) => {
  try {
    const { mockTestId } = req.params;
    const questions = await MockQuestion.find({ mockTestId });

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};



exports.submitMockTestAnswers = async (req, res) => {
  const { answers } = req.body;
  const { mockTestId } = req.params;
  const userId = req.user.id;

  try {
    // Check if already submitted
    const submitted = await UserAnswer.findOne({ userId, testId: mockTestId });
    if (submitted) {
      return res.status(400).json({ message: 'You have already submitted answers for this mock test' });
    }

    // Get related questions from DB
    const questionIds = answers.map(ans => new mongoose.Types.ObjectId(ans.questionId));
    const questions = await MockQuestion.find({ _id: { $in: questionIds } });

    let score = 0;
    const formattedAnswers = answers.map(ans => {
      const question = questions.find(q => q._id.equals(ans.questionId));
      const selectedOption = question?.options[ans.selectedOptionIndex];

      const isCorrect = selectedOption?.isCorrect || false;
      if (isCorrect) score++;

      return {
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect
      };
    });

    // Save submission
    await UserAnswer.create({
      userId,
      testId: mockTestId,
      answers: formattedAnswers,
      submittedAt: new Date(),
      score
    });

    // Update test status
    await UserTestStatus.findOneAndUpdate(
      { userId, testId: mockTestId },
      { status: 'Submitted' },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Answers submitted successfully', score });
  } catch (error) {
    console.error("Error submitting mock test answers:", error);
    res.status(500).json({ message: 'Failed to submit answers', error: error.message });
  }
};


// Controller: Evaluate submitted mock test answers
exports.evaluateMockTest = async (req, res) => {
  const { mockTestId } = req.params;
  const userId = req.user.id;

  try {
    // Find user's submitted answers for the mock test
    const submission = await UserAnswer.findOne({ userId, testId: mockTestId });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this mock test' });
    }

    // Fetch all questions for this mock test
    const questions = await MockQuestion.find({ mockTestId });

    let correctCount = 0;
    const detailedResults = [];

    for (const question of questions) {
      const submittedAnswer = submission.answers.find(
        (ans) => ans.questionId && ans.questionId.toString() === question._id.toString()
      );

      const correctIndex = question.options.findIndex(opt => opt.isCorrect);

      const isCorrect =
        submittedAnswer &&
        typeof submittedAnswer.selectedOptionIndex === 'number' &&
        submittedAnswer.selectedOptionIndex === correctIndex;

      if (isCorrect) correctCount++;

      detailedResults.push({
        questionId: question._id,
        questionText: question.questionText,
        selectedOptionIndex: submittedAnswer?.selectedOptionIndex ?? null,
        selectedOptionText: submittedAnswer?.selectedOptionIndex !== undefined
          ? question.options[submittedAnswer.selectedOptionIndex]?.text
          : null,
        correctOptionIndex: correctIndex,
        correctOptionText: question.options[correctIndex]?.text ?? null,
        isCorrect,
      });
    }

    res.status(200).json({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      details: detailedResults,
    });
  } catch (error) {
    console.error("Error evaluating mock test:", error);
    res.status(500).json({ message: 'Failed to evaluate mock test', error: error.message });
  }
};




exports.getUserMockTestResults = async (req, res) => {
  try {
    const userId = req.params.userId;

    const submissions = await UserAnswer.find({ userId })
      .populate({
        path: 'testId',
        model: 'MockTest',
        select: 'name description duration testType'
      })
      .sort({ submittedAt: -1 });

    const results = await Promise.all(
      submissions.map(async (submission) => {
        const test = submission.testId;
        if (!test) return null;

        const questions = await MockQuestion.find({ mockTestId: test._id });

        let correctCount = 0;
        const details = [];

        questions.forEach((question) => {
          const submittedAnswer = submission.answers.find(
            ans => ans.questionId.toString() === question._id.toString()
          );

          const correctIndex = question.options.findIndex(opt => opt.isCorrect);
          const isCorrect = submittedAnswer?.selectedOptionIndex === correctIndex;

          if (isCorrect) correctCount++;

          details.push({
            questionId: question._id,
            questionText: question.questionText,
            selectedOptionIndex: submittedAnswer?.selectedOptionIndex ?? null,
            selectedOptionText:
    submittedAnswer?.selectedOptionIndex !== undefined &&
    question.options[submittedAnswer.selectedOptionIndex]
      ? question.options[submittedAnswer.selectedOptionIndex].text
      : null,
            correctOptionIndex: correctIndex,
            correctOptionText: question.options[correctIndex]?.text ?? null,
            isCorrect,
            explanation: question.explanation,
            subTestCategory: question.subTestCategory,
            addedBy: question.addedBy
              ? {
                  userId: question.addedBy.userId,
                  name: question.addedBy.name
                }
              : null
          });
        });

        return {
          _id: submission._id,
          mockTestId: test._id,
          testName: test.name,
          testDescription: test.description,
          duration: test.duration,
          testType: test.testType,
          submittedAt: submission.submittedAt,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          scorePercentage: questions.length > 0
            ? Math.round((correctCount / questions.length) * 100)
            : 0,
          details
        };
      })
    );

    const filteredResults = results.filter(r => r !== null);
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Error in getUserMockTestResults:', error);
    res.status(500).json({
      message: 'Failed to get mock test results',
      error: error.message
    });
  }
};
