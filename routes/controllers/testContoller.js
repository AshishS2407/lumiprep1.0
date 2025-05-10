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


// Admin: Add Question to Test`
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


// User: Get Test Stats
exports.getUserTestStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const submissions = await UserAnswer.find({ userId });
    let passed = 0;
    let totalScore = 0;

    for (const submission of submissions) {
      const questions = await Question.find({ testId: submission.testId });
      const totalQuestions = questions.length;

      let correctAnswers = 0;
      for (const question of questions) {
        const correctIndex = question.options.findIndex((opt) => opt.isCorrect);
        const userAnswer = submission.answers.find(
          (ans) => ans.questionId.toString() === question._id.toString()
        );
        if (userAnswer?.selectedOptionIndex === correctIndex) {
          correctAnswers++;
        }
      }

      const percentage = (correctAnswers / totalQuestions) * 100;
      totalScore += percentage;
      if (percentage >= 50) passed++;
    }

    const totalTests = submissions.length;
    const failed = totalTests - passed;
    const avgScore = totalTests ? Math.round(totalScore / totalTests) : 0;

    res.json({
      totalTests,
      passed,
      failed,
      average: avgScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get stats", error: error.message });
  }
};


// Create Main Test
exports.createMainTest = async (req, res) => {
  try {
    const { testTitle, description } = req.body;

    const newTest = await Test.create({
      testTitle,
      description,
      parentTestId: null,
    });

    res.status(201).json({ message: 'Main test created', test: newTest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating main test', error: error.message });
  }
};


exports.assignSubTest = async (req, res) => {
  const { subTestId, mainTestId } = req.body;

  try {
    const updatedSubTest = await Test.findByIdAndUpdate(
      subTestId,
      { $addToSet: { parentTestIds: mainTestId } }, // prevents duplicates
      { new: true }
    );

    if (!updatedSubTest) {
      return res.status(404).json({ message: 'Sub test not found' });
    }

    res.status(200).json({ message: 'Sub test assigned', test: updatedSubTest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign sub test', error: error.message });
  }
};




// Get All Main Tests with their Sub Tests
exports.getMainTestsWithSubTests = async (req, res) => {
  try {
    const mainTests = await Test.find({ parentTestId: null });

    const result = await Promise.all(
      mainTests.map(async (mainTest) => {
        const subTests = await Test.find({ parentTestId: mainTest._id });
        return {
          ...mainTest.toObject(),
          subTests,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching main tests', error: error.message });
  }
};

exports.getSubTestsByMainId = async (req, res) => {
  try {
    const userId = req.user.id;
    const mainTestId = req.params.mainTestId;

    // Find subtests where mainTestId is in the parentTestIds array
    const subTests = await Test.find({ parentTestIds: mainTestId });

    // Fetch user-specific statuses
    const statuses = await UserTestStatus.find({ userId });

    // Create a map of testId to status
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.testId.toString()] = s.status;
    });

    // Attach status to each subtest
    const subTestsWithStatus = subTests.map((test) => ({
      ...test.toObject(),
      status: statusMap[test._id.toString()] || "Upcoming",
    }));

    res.status(200).json(subTestsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subtests" });
  }
};



exports.getMainTests = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user

    // Get only main tests
    const mainTests = await Test.find({ parentTestId: null });

    // Fetch user-specific statuses
    const statuses = await UserTestStatus.find({ userId });

    // Create a map of testId to status
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.testId.toString()] = s.status;
    });

    // Attach status to each main test
    const mainTestsWithStatus = mainTests.map((test) => {
      return {
        ...test.toObject(),
        status: statusMap[test._id.toString()] || "Upcoming",
      };
    });

    res.status(200).json(mainTestsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch main tests', error: error.message });
  }
};



exports.getSubTests = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user

    // Get only subtests
    const subTests = await Test.find({ parentTestId: { $ne: null } });

    // Fetch user-specific statuses
    const statuses = await UserTestStatus.find({ userId });

    // Create a map of testId to status
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.testId.toString()] = s.status;
    });

    // Attach status to each subtest
    const subTestsWithStatus = subTests.map((test) => {
      return {
        ...test.toObject(),
        status: statusMap[test._id.toString()] || "Upcoming",
      };
    });

    res.status(200).json(subTestsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subtests" });
  }
};

// Add to your test controllers
exports.getUserTestResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all test submissions with test details
    const submissions = await UserAnswer.find({ userId })
      .populate('testId', 'testTitle description duration')
      .sort({ submittedAt: -1 });

    const results = await Promise.all(
      submissions.map(async (submission) => {
        const questions = await Question.find({ testId: submission.testId });
        
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
            correctOptionIndex: correctIndex,
            isCorrect,
            explanation: question.explanation
          });
        });
        
        return {
          _id: submission._id,
          testId: submission.testId._id,
          testTitle: submission.testId.testTitle,
          testDescription: submission.testId.description,
          duration: submission.testId.duration,
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

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get user results', 
      error: error.message 
    });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserAnswer.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: 'answers.questionId',
          foreignField: '_id',
          as: 'questionDetails',
        },
      },
      {
        $addFields: {
          totalCorrect: {
            $size: {
              $filter: {
                input: '$answers',
                as: 'ans',
                cond: {
                  $let: {
                    vars: {
                      matchedQuestion: {
                        $first: {
                          $filter: {
                            input: '$questionDetails',
                            as: 'q',
                            cond: { $eq: ['$$q._id', '$$ans.questionId'] },
                          },
                        },
                      },
                    },
                    in: {
                      $eq: [
                        {
                          $arrayElemAt: [
                            '$$matchedQuestion.options.isCorrect',
                            '$$ans.selectedOptionIndex',
                          ],
                        },
                        true,
                      ],
                    },
                  },
                },
              },
            },
          },
          totalQuestions: { $size: '$answers' },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalCorrectAcrossTests: { $sum: '$totalCorrect' },
          totalQuestionsAcrossTests: { $sum: '$totalQuestions' },
        },
      },
      {
        $addFields: {
          accuracy: {
            $cond: [
              { $eq: ['$totalQuestionsAcrossTests', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ['$totalCorrectAcrossTests', '$totalQuestionsAcrossTests'],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          lumiId: '$user.lumiId',
          accuracy: { $round: ['$accuracy', 2] },
        },
      },
      { $sort: { accuracy: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard Error:', error);
    res.status(500).json({ message: 'Failed to generate leaderboard', error: error.message });
  }
};
