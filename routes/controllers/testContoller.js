const Test = require('../../models/test/testModel');
const UserTestStatus = require('../../models/test/userTestStatusModel');
const Question = require('../../models/test/questionModel');
const UserAnswer = require('../../models/test/answerModel');



//1 Create Main Test
exports.createMainTest = async (req, res) => {
  try {
    const { testTitle, description } = req.body;

    const newTest = await Test.create({ 
      testTitle, 
      description,
      testType: 'main',
      parentTestIds: []
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating main test' });
  }
};


// 2. Edit Main Test
exports.editMainTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { testTitle, description } = req.body;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      { testTitle, description },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Main test updated successfully', test: updatedTest });
  } catch (error) {
    console.error('Error updating main test:', error);
    res.status(500).json({ message: 'Error updating main test' });
  }
};


// 3. Delete Main Test
exports.deleteMainTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Main test deleted successfully' });
  } catch (error) {
    console.error('Error deleting main test:', error);
    res.status(500).json({ message: 'Error deleting main test' });
  }
};




//2 Admin: Create Sub Test
exports.createSubTest = async (req, res) => {
  try {
    const { companyName, testTitle, description, validTill, duration, parentTestIds } = req.body;

    if (!duration) {
      return res.status(400).json({ message: 'Duration is required' });
    }

    if (!parentTestIds || parentTestIds.length === 0) {
      return res.status(400).json({ message: 'At least one parentTestId is required for sub tests' });
    }

    // Verify parent tests exist and are main tests
    const parentTests = await Test.find({ _id: { $in: parentTestIds }, testType: 'main' });
    if (parentTests.length !== parentTestIds.length) {
      return res.status(400).json({ message: 'One or more parent tests not found or not main tests' });
    }

    const newTest = await Test.create({ 
      companyName, 
      testTitle, 
      description, 
      validTill, 
      duration,
      testType: 'sub',
      parentTestIds
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating sub test' });
  }
};


// Edit Sub Test
exports.updateSubTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, testTitle, description, validTill, duration, parentTestIds } = req.body;

    if (!duration) {
      return res.status(400).json({ message: 'Duration is required' });
    }

    if (!parentTestIds || parentTestIds.length === 0) {
      return res.status(400).json({ message: 'At least one parentTestId is required for sub tests' });
    }

    // Verify parent tests exist and are main tests
    const parentTests = await Test.find({ _id: { $in: parentTestIds }, testType: 'main' });
    if (parentTests.length !== parentTestIds.length) {
      return res.status(400).json({ message: 'One or more parent tests not found or not main tests' });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      {
        companyName,
        testTitle,
        description,
        validTill,
        duration,
        parentTestIds,
      },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Sub test not found' });
    }

    res.status(200).json(updatedTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating sub test' });
  }
};


//3 Assign existing sub test to a main test
exports.assignSubTestToMain = async (req, res) => {
  try {
    const { subTestId, mainTestId } = req.body;

    // Check if main test exists and is of type 'main'
    const mainTest = await Test.findOne({ _id: mainTestId, testType: 'main' });
    if (!mainTest) {
      return res.status(400).json({ message: 'Main test not found or not a valid main test' });
    }

    // Check if sub test exists and is of type 'sub'
    const subTest = await Test.findOne({ _id: subTestId, testType: 'sub' });
    if (!subTest) {
      return res.status(400).json({ message: 'Sub test not found or not a valid sub test' });
    }

    // Avoid duplicate assignment
    if (subTest.parentTestIds.includes(mainTestId)) {
      return res.status(400).json({ message: 'Sub test is already assigned to this main test' });
    }

    // Assign main test ID to sub test
    subTest.parentTestIds.push(mainTestId);
    await subTest.save();

    res.status(200).json({ message: 'Sub test assigned to main test successfully', subTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error assigning sub test to main test' });
  }
};


// Delete Sub Test
exports.deleteSubTest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTest = await Test.findByIdAndDelete(id);

    if (!deletedTest) {
      return res.status(404).json({ message: 'Sub test not found' });
    }

    res.status(200).json({ message: 'Sub test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting sub test' });
  }
};


//3 Get All Main Tests with their Sub Tests
exports.getMainTestsWithSubTests = async (req, res) => {
  try {
    const mainTests = await Test.find({ testType: 'main' });
    const result = await Promise.all(
      mainTests.map(async (mainTest) => {
        const subTests = await Test.find({ 
          parentTestIds: mainTest._id,  // Now checking if _id exists in the array
          testType: 'sub'               // Explicitly checking testType for safety
        });                return {
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


//4 Get Subtest by Main Id 

exports.getSubTestsByMainId = async (req, res) => {
  try {
    const userId = req.user.id;
    const mainTestId = req.params.mainTestId;

    // Find subtests where mainTestId is in the parentTestIds array
    const subTests = await Test.find({ parentTestIds: mainTestId, testType: 'sub' });

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

//5 Get Main Test


exports.getMainTests = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user

    // Get only main tests
    const mainTests = await Test.find({ testType: 'main' });

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


//6 Get Sub Test 

exports.getSubTests = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user

    // Get only subtests
    const subTests = await Test.find({ testType: 'sub' });
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


//7 Admin: Update Test
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const updateData = req.body;

    // Validation before updating
    if (updateData.testType === 'sub' && (!updateData.parentTestIds || updateData.parentTestIds.length === 0)) {
      return res.status(400).json({ message: 'Sub tests must have parentTestIds' });
    }

    if (updateData.testType === 'main' && updateData.parentTestIds?.length > 0) {
      return res.status(400).json({ message: 'Main tests cannot have parentTestIds' });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(updatedTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating test' });
  }
};



//8 get UserTests 

exports.getUserTests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tests
    const tests = await Test.find();

    // Fetch the user's test statuses
    const statuses = await UserTestStatus.find({ userId });

    // Create a map from testId to status
    const statusMap = {};
    statuses.forEach((s) => {
      statusMap[s.testId.toString()] = s.status;
    });

    // Attach status to each test object
    const testsWithStatus = tests.map((test) => {
      return {
        ...test.toObject(),
        status: statusMap[test._id.toString()] || "Upcoming",
      };
    });

    // Send a flat array response
    res.json(testsWithStatus);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tests" });
  }
};



// Admin: Add Question to Test`
exports.addQuestion = async (req, res) => {
  try {
    const testId = req.params.testId;
    const { questionText, options } = req.body;
    
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Must provide exactly 4 options' });
    }

    // Get admin info from the authenticated request
    const addedBy = {
      userId: req.user.id,  // From auth middleware
      name: req.user.name   // From the user's JWT payload
    };

    const question = await Question.create({ 
      testId, 
      questionText, 
      options,
      addedBy  // Include the admin info
    });

    res.status(201).json({ message: 'Question added', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add question', error: error.message });
  }
};

// User: Get Questions for a Test
exports.getTestQuestions = async (req, res) => {
  const { testId } = req.params;

  try {
    const questions = await Question.find({ testId })
      .select('-options.isCorrect') // Hide correct answers
      .populate({
        path: 'addedBy.userId',
        select: 'name', // Only get the name from the User collection
        model: 'User'
      });

    // Transform the data to include admin name in a cleaner format
    const formattedQuestions = questions.map(question => ({
      ...question.toObject(),
      addedBy: {
        name: question.addedBy.userId?.name || question.addedBy.name
        // Fallback to directly stored name if population fails
      }
    }));

    res.status(200).json({ 
      questions: formattedQuestions,
      timer: 30 * 60 // 30 mins
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching questions', 
      error: error.message 
    });
  }
};


exports.getQuestion = async (req, res) => {
  try {
    const { testId, questionId } = req.params;
    const question = await Question.findOne({ 
      _id: questionId, 
      testId 
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch question', 
      error: error.message 
    });
  }
};


// Admin: Edit a Question
exports.editQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { questionText, options } = req.body;

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Must provide exactly 4 options' });
    }

    // Get admin info from the authenticated request
    const updatedBy = {
      userId: req.user.id,
      name: req.user.name
    };

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { 
        questionText, 
        options,
        updatedBy,  // Track who made the edit
        updatedAt: Date.now()  // Track when the edit was made
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ 
      message: 'Question updated', 
      question: updatedQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update question', 
      error: error.message 
    });
  }
};

// Admin: Delete a Question
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
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
        // If the test has been deleted or is not populated
        if (!submission.testId) return null;

        const questions = await Question.find({ testId: submission.testId._id });

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

    const filteredResults = results.filter(r => r !== null);
    res.status(200).json(filteredResults);
  } catch (error) {
    console.error('Error in getUserTestResults:', error); // Helpful for debugging
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
