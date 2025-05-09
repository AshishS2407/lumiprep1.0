const express = require('express');
const router = express.Router();

const {
  createTest,
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
  assignSubTest,
  getMainTestsWithSubTests,
  getMainTests,
  getSubTests,
  getSubTestsByMainId,
  getUserTestResults,
} = require('./controllers/testContoller');

const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin: Create a new test
router.post('/', authMiddleware, isAdmin, createTest);

// Admin: Create a main test (e.g., English, Hindi)
router.post('/main', authMiddleware, isAdmin, createMainTest);

// Admin: Assign an existing sub test to a main test
router.put('/assign-sub-test', authMiddleware, isAdmin, assignSubTest);

router.get('/sub-tests', authMiddleware, getSubTests);

router.get('/main-tests', authMiddleware, getMainTests);

router.get('/user-stats', authMiddleware, getUserTestStats);

router.get('/user/:userId/results', authMiddleware,isAdmin, getUserTestResults);

router.get('/sub-tests/:mainTestId', authMiddleware, getSubTestsByMainId);

router.put('/update/:testId', authMiddleware,isAdmin,updateTest);

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
