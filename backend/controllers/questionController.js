const { supabase } = require('../config/supabase');

// Mock questions for demo purposes
const MOCK_QUESTIONS = [
  {
    id: '1',
    title: 'Tell us about yourself',
    description: 'Please introduce yourself and share your background.',
    category: 'HR',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'What are your strengths?',
    description: 'Describe your key strengths and how they make you a good fit.',
    category: 'Behavioral',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Explain REST API concepts',
    description: 'Explain the key concepts of REST API design and implementation.',
    category: 'Technical',
    difficulty: 'Hard',
  },
  {
    id: '4',
    title: 'How do you handle pressure?',
    description: 'Describe a situation where you handled pressure effectively.',
    category: 'Behavioral',
    difficulty: 'Medium',
  },
  {
    id: '5',
    title: 'What is your experience with databases?',
    description: 'Tell us about your experience with databases and SQL.',
    category: 'Technical',
    difficulty: 'Medium',
  },
];

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
exports.getAllQuestions = async (req, res) => {
  try {
    const { category } = req.query;

    try {
      // Try Supabase
      let query = supabase.from('questions').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

      return res.status(200).json({
        success: true,
        count: data ? data.length : 0,
        data: data || [],
      });
    } catch (dbError) {
      console.log('⚠️  Supabase query failed, using mock questions');
      
      // Filter mock data by category if provided
      let questions = MOCK_QUESTIONS;
      if (category) {
        questions = questions.filter(q => q.category === category);
      }

      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
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

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try Supabase
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return res.status(200).json({
          success: true,
          data,
        });
      }
    } catch (error) {
      console.log('⚠️  Supabase query failed, using mock questions');
    }

    // Try mock data
    const mock = MOCK_QUESTIONS.find(q => q.id === id);
    if (!mock) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      data: mock,
      mode: 'demo',
    });
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
    const { title, description, category, difficulty } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and category',
      });
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert({
          title,
          description,
          category,
          difficulty: difficulty || 'Medium',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Question created successfully',
        data,
      });
    } catch (error) {
      console.log('⚠️  Supabase insert failed, using demo mode');
      
      // In demo mode, just acknowledge
      const mockQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category,
        difficulty: difficulty || 'Medium',
        created_at: new Date().toISOString(),
      };

      res.status(201).json({
        success: true,
        message: 'Question created (demo mode)',
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
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('questions')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Question not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Question updated successfully',
        data,
      });
    } catch (error) {
      console.log('⚠️  Supabase update failed');
      
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
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
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
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
      console.log('⚠️  Supabase delete failed');
      
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
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
      let query = supabase
        .from('questions')
        .select('*')
        .eq('category', category);

      if (limit) {
        query = query.limit(parseInt(limit));
      }

      const { data, error } = await query;

      if (error && error.code !== 'PGRST116') throw error;

      res.status(200).json({
        success: true,
        count: data ? data.length : 0,
        data: data || [],
      });
    } catch (error) {
      console.log('⚠️  Supabase query failed, using mock data');
      
      // Fallback to mock data
      let mockData = MOCK_QUESTIONS.filter(q => q.category === category);
      
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
