const express = require('express');
const {
  createInterviewSession,
  getInterview,
  submitAnswer,
  completeInterview,
  getAllInterviews,
  getInterviewReport,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', createInterviewSession);
router.get('/:id/report', getInterviewReport);
router.get('/:id', getInterview);
router.put('/:id/answer/:questionIndex', submitAnswer);
router.put('/:id/complete', completeInterview);

// Admin routes
router.get('/', protect, getAllInterviews);

module.exports = router;
