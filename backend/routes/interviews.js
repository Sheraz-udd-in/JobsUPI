const express = require('express');
const {
  createInterviewSession,
  getInterviewSession,
  submitAnswer,
  completeInterview,
  getAllInterviews,
  getInterviewReport,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', createInterviewSession);
router.get('/:id', getInterviewSession);
router.put('/:id/answer/:questionIndex', submitAnswer);
router.put('/:id/complete', completeInterview);
router.get('/:id/report', getInterviewReport);

// Admin routes
router.get('/', protect, getAllInterviews);

module.exports = router;
