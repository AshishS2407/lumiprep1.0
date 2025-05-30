const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { createMockTest, getAllMockTests, getMockTestById, updateMockTest, deleteMockTest, addQuestionToMockTest, getQuestionsByMockTest, updateMockQuestion, deleteMockQuestion, getMockQuestionById, submitMockTestAnswers, evaluateMockTest, getUserMockTestResults, checkMockTestSubmissionStatus, getMockTestDeatilsById } = require('./controllers/mocktestController');


router.post('/create-mocktest', authMiddleware, isAdmin, createMockTest);

router.get('/get-mocks', authMiddleware, getAllMockTests);

router.get('/:id', authMiddleware, isAdmin, getMockTestById);

router.put('/:id', authMiddleware, isAdmin, updateMockTest);

router.delete('/:id', authMiddleware, isAdmin, deleteMockTest);

router.post('/:mockTestId/add-question', authMiddleware, isAdmin, addQuestionToMockTest);

router.get('/:mockTestId/questions', authMiddleware, isAdmin, getQuestionsByMockTest);

router.put('/questions/:questionId', authMiddleware, isAdmin, updateMockQuestion);

router.delete('/questions/:questionId', authMiddleware, isAdmin, deleteMockQuestion);

router.get("/questions/:questionId", authMiddleware, getMockQuestionById);

router.get("/question/:mockTestId", authMiddleware, getQuestionsByMockTest);

router.post('/:mockTestId/submit-answers', authMiddleware, submitMockTestAnswers);

router.get('/test/:mockTestId',authMiddleware, getMockTestDeatilsById)

router.get('/:mockTestId/is-submitted', authMiddleware, checkMockTestSubmissionStatus);

router.get('/:mockTestId/evaluate', authMiddleware, evaluateMockTest);


router.get('/results/:userId', authMiddleware, isAdmin, getUserMockTestResults);



module.exports = router;
