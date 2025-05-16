const express = require('express');
const router = express.Router();

const {
  addQuestion,
  getTestQuestions,
  submitAnswers,
  evaluateTest,
  addExplanation,
  getExplanations,
  getUserTests,
  getTestById,
  getRecentSubmittedTests,
  getFilteredExplanations,
  updateTest,
  getUserTestStats,
  createMainTest,
  getMainTestsWithSubTests,
  getMainTests,
  getSubTests,
  getSubTestsByMainId,
  getUserTestResults,
  getLeaderboard,
  createSubTest,
  assignSubTestToMain,
  editMainTest,
  deleteMainTest,
  deleteSubTest,
  updateSubTest,
} = require('./controllers/testContoller');

const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin: Create a new test
router.post('/sub', authMiddleware, isAdmin, createSubTest);

// Admin: Create a main test (e.g., English, Hindi)
router.post('/main', authMiddleware, isAdmin, createMainTest);

router.put('/main/:id', authMiddleware, isAdmin, editMainTest);

router.delete('/main/:id', authMiddleware, isAdmin, deleteMainTest);


// Admin: Assign an existing sub test to a main test
router.post('/assign-subtest', assignSubTestToMain);

router.get('/sub-tests', authMiddleware, getSubTests);


// Edit sub test
router.put('/sub/:id', authMiddleware, isAdmin, updateSubTest);

// Delete sub test
router.delete('/sub/:id', authMiddleware, isAdmin, deleteSubTest);

router.get('/main-tests', authMiddleware, getMainTests);

router.get('/user-stats', authMiddleware, getUserTestStats);

router.get('/leaderboard', authMiddleware, getLeaderboard)


router.get('/user/:userId/results', authMiddleware, isAdmin, getUserTestResults);

router.get('/sub-tests/:mainTestId', authMiddleware, getSubTestsByMainId);

router.put('/update/:testId', authMiddleware, isAdmin, updateTest);

// Admin: Add question to a test
router.post('/:testId/questions', authMiddleware, isAdmin, addQuestion);

// User: Get list of tests with status
router.get('/', authMiddleware, getUserTests);

router.get('/recent-submitted', authMiddleware, getRecentSubmittedTests);

// Get single test by ID
router.get("/:id", authMiddleware, getTestById);

// User: Get questions for a test (30-minute timer included in response)
router.get('/:testId/questions', authMiddleware, getTestQuestions);

// User: Submit answers for a test
router.post('/:testId/submit-answers', authMiddleware, submitAnswers);

router.get('/:testId/evaluate', authMiddleware, evaluateTest);

// Admin adds or updates explanation
router.put('/:testId/questions/:questionId/explanation', authMiddleware, isAdmin, addExplanation);

// User views explanations (only after submitting test)
router.get('/:testId/explanations', authMiddleware, getExplanations);

router.get('/:testId/explanations/filter', authMiddleware, getFilteredExplanations);

router.get('/main/all', authMiddleware, getMainTestsWithSubTests);





module.exports = router;
