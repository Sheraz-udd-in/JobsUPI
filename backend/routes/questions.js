const express = require('express');
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes - Category must come BEFORE :id to avoid route conflicts
router.get('/category/:category', getQuestionsByCategory);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

// Admin routes (protected)
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;
