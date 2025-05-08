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
} = require('./controllers/testContoller');

const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Admin: Create a new test
router.post('/', authMiddleware, isAdmin, createTest);

router.get('/user-stats', authMiddleware, getUserTestStats);

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







module.exports = router;
