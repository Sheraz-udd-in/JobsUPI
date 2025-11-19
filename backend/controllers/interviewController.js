const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');

// Mock interview storage (for demo mode without database)
const mockInterviewSessions = new Map();
let mockIdCounter = 1;

// Mock questions for reference
const MOCK_QUESTIONS = [
  {
    _id: '1',
    title: 'Tell us about yourself',
    description: 'Please introduce yourself and share your background.',
    category: 'HR',
    difficulty: 'Easy',
    expectedKeywords: ['experience', 'skills', 'background', 'goals'],
    evaluationCriteria: 'Clarity of communication, relevant experience, career vision',
  },
  {
    _id: '2',
    title: 'What are your strengths?',
    description: 'Describe your key strengths and how they make you a good fit.',
    category: 'Behavioral',
    difficulty: 'Medium',
    expectedKeywords: ['skills', 'achievements', 'teamwork', 'leadership'],
    evaluationCriteria: 'Relevance to job, confidence, specific examples',
  },
];

function calculateScore(candidateAnswer, expectedKeywords = []) {
  if (!candidateAnswer) return 0;
  const answerLower = candidateAnswer.toLowerCase();
  let score = 5;
  const keywordMatches = expectedKeywords.filter((keyword) =>
    answerLower.includes(keyword.toLowerCase())
  ).length;
  score += (keywordMatches / Math.max(expectedKeywords.length, 1)) * 3;
  score += (candidateAnswer.length / 100) * 2;
  return Math.min(10, Math.max(0, score));
}

// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Public
exports.createInterviewSession = async (req, res) => {
  try {
    const { candidateName, candidateEmail, interviewRound, questionsCount = 2, category = null } = req.body;

    if (!candidateName || !candidateEmail || !interviewRound) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: candidateName, candidateEmail, interviewRound',
      });
    }

    let questions = [];

    try {
      // Try to fetch from database
      let filter = { isActive: true };
      if (category) filter.category = category;
      questions = await Question.find(filter).limit(questionsCount).sort({ createdAt: -1 });
    } catch (dbError) {
      // Fallback to mock questions
      console.log('📝 Using mock questions for interview');
      questions = MOCK_QUESTIONS.slice(0, questionsCount);
    }

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions available',
      });
    }

    try {
      // Try to create in database
      const session = await InterviewSession.create({
        candidateName,
        candidateEmail,
        interviewRound,
        questions: questions.map((q) => ({
          questionId: q._id,
          questionText: q.title || q.description,
        })),
        status: 'In Progress',
        startTime: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: 'Interview session created',
        data: {
          _id: session._id,
          candidateName: session.candidateName,
          candidateEmail: session.candidateEmail,
          interviewRound: session.interviewRound,
          questions: session.questions,
          status: session.status,
          startTime: session.startTime,
        },
      });
    } catch (dbError) {
      // Fallback to mock storage
      console.log('💾 Saving interview to mock storage');
      const mockId = `mock_${mockIdCounter++}`;

      const mockSession = {
        _id: mockId,
        candidateName,
        candidateEmail,
        interviewRound,
        questions: questions.map((q, idx) => ({
          questionId: q._id,
          questionText: q.title || q.description,
          candidateAnswer: null,
          audioUrl: null,
          score: null,
          feedback: null,
        })),
        status: 'In Progress',
        overallScore: null,
        strengths: [],
        weaknesses: [],
        startTime: new Date(),
        endTime: null,
        duration: null,
      };

      mockInterviewSessions.set(mockId, mockSession);

      return res.status(201).json({
        success: true,
        message: 'Interview session created (demo mode)',
        mode: 'demo',
        data: mockSession,
      });
    }
  } catch (error) {
    console.error('❌ Error creating interview:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get interview session
// @route   GET /api/interviews/:id
// @access  Public
exports.getInterviewSession = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try database first
      const session = await InterviewSession.findById(id);
      if (session) {
        return res.status(200).json({
          success: true,
          data: session,
        });
      }
    } catch (dbError) {
      // Ignore DB error, try mock
    }

    // Try mock storage
    if (mockInterviewSessions.has(id)) {
      return res.status(200).json({
        success: true,
        mode: 'demo',
        data: mockInterviewSessions.get(id),
      });
    }

    res.status(404).json({
      success: false,
      message: 'Interview session not found',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update interview with answer
// @route   PUT /api/interviews/:id/answer/:questionIndex
// @access  Public
exports.submitAnswer = async (req, res) => {
  try {
    const { id, questionIndex } = req.params;
    const { candidateAnswer, audioUrl, score } = req.body;
    const qIndex = parseInt(questionIndex);

    try {
      // Try database
      const session = await InterviewSession.findById(id);
      if (session) {
        if (qIndex >= session.questions.length) {
          return res.status(400).json({
            success: false,
            message: 'Invalid question index',
          });
        }

        session.questions[qIndex].candidateAnswer = candidateAnswer;
        session.questions[qIndex].audioUrl = audioUrl;
        session.questions[qIndex].score = score || calculateScore(candidateAnswer, []);

        await session.save();

        return res.status(200).json({
          success: true,
          message: 'Answer submitted successfully',
          data: session,
        });
      }
    } catch (dbError) {
      // Ignore DB error, try mock
    }

    // Try mock storage
    if (mockInterviewSessions.has(id)) {
      const session = mockInterviewSessions.get(id);

      if (qIndex >= session.questions.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid question index',
        });
      }

      session.questions[qIndex].candidateAnswer = candidateAnswer;
      session.questions[qIndex].audioUrl = audioUrl;
      session.questions[qIndex].score = score || 7;

      return res.status(200).json({
        success: true,
        message: 'Answer submitted successfully (demo mode)',
        mode: 'demo',
        data: session,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Interview session not found',
    });
  } catch (error) {
    console.error('❌ Error submitting answer:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete interview and generate evaluation
// @route   PUT /api/interviews/:id/complete
// @access  Public
exports.completeInterview = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try database
      const session = await InterviewSession.findById(id);
      if (session) {
        const scores = session.questions
          .filter((q) => q.score !== undefined && q.score !== null)
          .map((q) => q.score);

        const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        const strengths =
          overallScore >= 7
            ? ['Excellent communication skills', 'Strong technical knowledge', 'Problem-solving ability']
            : overallScore >= 5
            ? ['Good understanding', 'Fair communication']
            : ['Needs more preparation'];

        const weaknesses =
          overallScore < 5
            ? ['Incomplete answers', 'Lack of clarity', 'Missing key concepts']
            : overallScore < 7
            ? ['Could be more detailed', 'Some gaps in knowledge']
            : [];

        session.overallScore = Math.round(overallScore * 10) / 10;
        session.strengths = strengths;
        session.weaknesses = weaknesses;
        session.status = 'Completed';
        session.endTime = new Date();
        session.duration = Math.floor((session.endTime - session.startTime) / 1000);

        await session.save();

        return res.status(200).json({
          success: true,
          message: 'Interview completed successfully',
          data: session,
        });
      }
    } catch (dbError) {
      // Ignore DB error, try mock
    }

    // Try mock storage
    if (mockInterviewSessions.has(id)) {
      const session = mockInterviewSessions.get(id);

      const scores = session.questions
        .filter((q) => q.score !== undefined && q.score !== null)
        .map((q) => q.score);

      const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      session.overallScore = Math.round(overallScore * 10) / 10;
      session.strengths = overallScore >= 7 ? ['Excellent answers'] : ['Good effort'];
      session.weaknesses = overallScore < 5 ? ['Needs improvement'] : [];
      session.status = 'Completed';
      session.endTime = new Date();
      session.duration = Math.floor((session.endTime - session.startTime) / 1000);

      return res.status(200).json({
        success: true,
        message: 'Interview completed successfully (demo mode)',
        mode: 'demo',
        data: session,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Interview session not found',
    });
  } catch (error) {
    console.error('❌ Error completing interview:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private (Admin)
exports.getAllInterviews = async (req, res) => {
  try {
    try {
      // Try database
      const interviews = await InterviewSession.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: interviews.length,
        data: interviews,
      });
    } catch (dbError) {
      // Fallback to mock
      const mockInterviews = Array.from(mockInterviewSessions.values());
      return res.status(200).json({
        success: true,
        mode: 'demo',
        count: mockInterviews.length,
        data: mockInterviews,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get interview report
// @route   GET /api/interviews/:id/report
// @access  Public
exports.getInterviewReport = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try database
      const session = await InterviewSession.findById(id);
      if (session) {
        const report = {
          candidateName: session.candidateName,
          candidateEmail: session.candidateEmail,
          interviewRound: session.interviewRound,
          overallScore: session.overallScore || 0,
          status: session.status,
          duration: session.duration,
          strengths: session.strengths || [],
          weaknesses: session.weaknesses || [],
          questionsCount: session.questions.length,
          completedQuestions: session.questions.filter((q) => q.score !== undefined && q.score !== null).length,
          detailedAnswers: session.questions.map((q) => ({
            question: q.questionText,
            answer: q.candidateAnswer || 'Not answered',
            score: q.score || 0,
            feedback: q.feedback || 'No feedback available',
          })),
        };

        return res.status(200).json({
          success: true,
          data: report,
        });
      }
    } catch (dbError) {
      // Ignore DB error, try mock
    }

    // Try mock storage
    if (mockInterviewSessions.has(id)) {
      const session = mockInterviewSessions.get(id);
      const report = {
        candidateName: session.candidateName,
        candidateEmail: session.candidateEmail,
        interviewRound: session.interviewRound,
        overallScore: session.overallScore || 0,
        status: session.status,
        duration: session.duration || 0,
        strengths: session.strengths || [],
        weaknesses: session.weaknesses || [],
        questionsCount: session.questions.length,
        completedQuestions: session.questions.filter((q) => q.score !== null).length,
        detailedAnswers: session.questions.map((q) => ({
          question: q.questionText,
          answer: q.candidateAnswer || 'Not answered',
          score: q.score || 0,
          feedback: 'No feedback available',
        })),
      };

      return res.status(200).json({
        success: true,
        mode: 'demo',
        data: report,
      });
    }

    res.status(404).json({
      success: false,
      message: 'Interview session not found',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
