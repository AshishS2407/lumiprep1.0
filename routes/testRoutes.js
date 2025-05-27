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
  editQuestion,
  deleteQuestion,
  getQuestion,
} = require('./controllers/testContoller');

const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Main tests routes
router.get('/main/all', authMiddleware, getMainTestsWithSubTests);
router.get('/main-tests', authMiddleware, getMainTests);
router.post('/main', authMiddleware, isAdmin, createMainTest);
router.put('/main/:id', authMiddleware, isAdmin, editMainTest);
router.delete('/main/:id', authMiddleware, isAdmin, deleteMainTest);

// Sub tests routes
router.get('/sub-tests', authMiddleware, getSubTests);
router.get('/sub-tests/:mainTestId', authMiddleware, getSubTestsByMainId);
router.post('/sub', authMiddleware, isAdmin, createSubTest);
router.put('/sub/:id', authMiddleware, isAdmin, updateSubTest);
router.delete('/sub/:id', authMiddleware, isAdmin, deleteSubTest);
router.post('/assign-subtest', assignSubTestToMain);

// Test management routes
router.get('/', authMiddleware, getUserTests);
router.get('/:id', authMiddleware, getTestById);
router.put('/update/:testId', authMiddleware, isAdmin, updateTest);

// Question routes
router.get('/:testId/questions', authMiddleware, getTestQuestions);
router.get('/:testId/questions/:questionId', authMiddleware, getQuestion);
router.post('/:testId/questions', authMiddleware, isAdmin, addQuestion);
router.put('/:testId/questions/:questionId', authMiddleware, isAdmin, editQuestion);
router.delete('/:testId/questions/:questionId', authMiddleware, isAdmin, deleteQuestion);

// Explanation routes
router.put('/:testId/questions/:questionId/explanation', authMiddleware, isAdmin, addExplanation);
router.get('/:testId/explanations', authMiddleware, getExplanations);
router.get('/:testId/explanations/filter', authMiddleware, getFilteredExplanations);

// Test taking and evaluation routes
router.post('/:testId/submit-answers', authMiddleware, submitAnswers);
router.get('/:testId/evaluate', authMiddleware, evaluateTest);

// User stats and results routes
router.get('/user-stats', authMiddleware, getUserTestStats);
router.get('/user/:userId/results', authMiddleware, isAdmin, getUserTestResults);
router.get('/recent-submitted', authMiddleware, getRecentSubmittedTests);
router.get('/leaderboard', authMiddleware, getLeaderboard);

module.exports = router;