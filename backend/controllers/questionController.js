const Question = require('../models/Question');

// Mock questions for demo purposes
const MOCK_QUESTIONS = [
  {
    _id: '1',
    title: 'Tell us about yourself',
    description: 'Please introduce yourself and share your background.',
    category: 'HR',
    difficulty: 'Easy',
    expectedKeywords: ['experience', 'skills', 'background', 'goals'],
    evaluationCriteria: 'Clarity of communication, relevant experience, career vision',
    isActive: true,
  },
  {
    _id: '2',
    title: 'What are your strengths?',
    description: 'Describe your key strengths and how they make you a good fit.',
    category: 'Behavioral',
    difficulty: 'Medium',
    expectedKeywords: ['skills', 'achievements', 'teamwork', 'leadership'],
    evaluationCriteria: 'Relevance to job, confidence, specific examples',
    isActive: true,
  },
  {
    _id: '3',
    title: 'Explain REST API concepts',
    description: 'Explain the key concepts of REST API design and implementation.',
    category: 'Technical',
    difficulty: 'Hard',
    expectedKeywords: ['HTTP', 'stateless', 'resources', 'endpoints', 'JSON'],
    evaluationCriteria: 'Technical accuracy, understanding of principles, real-world examples',
    isActive: true,
  },
  {
    _id: '4',
    title: 'How do you handle pressure?',
    description: 'Describe a situation where you handled pressure effectively.',
    category: 'Behavioral',
    difficulty: 'Medium',
    expectedKeywords: ['calm', 'organized', 'prioritize', 'solution', 'team'],
    evaluationCriteria: 'Stress management, problem-solving, positive outcome',
    isActive: true,
  },
  {
    _id: '5',
    title: 'What is your experience with databases?',
    description: 'Tell us about your experience with databases and SQL.',
    category: 'Technical',
    difficulty: 'Medium',
    expectedKeywords: ['SQL', 'MongoDB', 'queries', 'optimization', 'transactions'],
    evaluationCriteria: 'Technical knowledge, practical experience, optimization awareness',
    isActive: true,
  },
];

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getAllQuestions = async (req, res) => {
  try {
    const { category } = req.query;

    try {
      // Try to fetch from database
      const filter = { isActive: true };
      if (category) {
        filter.category = category;
      }

      const questions = await Question.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (dbError) {
      // Fallback to mock data if database is not available
      console.log('Database unavailable, using mock data:', dbError.message);
      
      let mockData = [...MOCK_QUESTIONS];
      if (category) {
        mockData = mockData.filter(q => q.category === category);
      }

      return res.status(200).json({
        success: true,
        count: mockData.length,
        data: mockData,
        mode: 'demo',
      });
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res) => {
  try {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        // Try mock data
        const mock = MOCK_QUESTIONS.find(q => q._id === req.params.id);
        if (!mock) {
          return res.status(404).json({
            success: false,
            message: 'Question not found',
          });
        }
        return res.status(200).json({
          success: true,
          data: mock,
          mode: 'demo',
        });
      }
      res.status(200).json({
        success: true,
        data: question,
      });
    } catch (dbError) {
      // Fallback to mock data
      const mock = MOCK_QUESTIONS.find(q => q._id === req.params.id);
      if (!mock) {
        return res.status(404).json({
          success: false,
          message: 'Question not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: mock,
        mode: 'demo',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new question (Admin only)
// @route   POST /api/questions
// @access  Private (Admin)
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, category, difficulty, expectedKeywords, evaluationCriteria } = req.body;

    try {
      const question = await Question.create({
        title,
        description,
        category,
        difficulty,
        expectedKeywords,
        evaluationCriteria,
      });

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data: question,
      });
    } catch (dbError) {
      // In demo mode, create mock question
      const mockQuestion = {
        _id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category,
        difficulty,
        expectedKeywords,
        evaluationCriteria,
        isActive: true,
      };
      MOCK_QUESTIONS.push(mockQuestion);
      
      res.status(201).json({
        success: true,
        message: 'Question created successfully (demo mode)',
        data: mockQuestion,
        mode: 'demo',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update question (Admin only)
// @route   PUT /api/questions/:id
// @access  Private (Admin)
exports.updateQuestion = async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete question (Admin only)
// @route   DELETE /api/questions/:id
// @access  Private (Admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get questions by category
// @route   GET /api/questions/category/:category
// @access  Public
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit } = req.query;

    try {
      let query = Question.find({ category, isActive: true });

      if (limit) {
        query = query.limit(parseInt(limit));
      }

      const questions = await query;

      res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (dbError) {
      // Fallback to mock data
      console.log('Using mock data for category:', category);
      let mockData = MOCK_QUESTIONS.filter(q => q.category === category && q.isActive);
      
      if (limit) {
        mockData = mockData.slice(0, parseInt(limit));
      }

      return res.status(200).json({
        success: true,
        count: mockData.length,
        data: mockData,
        mode: 'demo',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
