const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');

// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Public
exports.createInterviewSession = async (req, res) => {
  try {
    const { candidateName, candidateEmail, interviewRound, questionIds } = req.body;

    // Fetch question details
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid questions found',
      });
    }

    const session = await InterviewSession.create({
      candidateName,
      candidateEmail,
      interviewRound,
      questions: questions.map((q) => ({
        questionId: q._id,
        questionText: q.title,
      })),
      status: 'In Progress',
      startTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Interview session created',
      data: session,
    });
  } catch (error) {
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
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    res.status(200).json({
      success: true,
      data: session,
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

    const session = await InterviewSession.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    if (questionIndex >= session.questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question index',
      });
    }

    // Update the answer
    session.questions[questionIndex].candidateAnswer = candidateAnswer;
    session.questions[questionIndex].audioUrl = audioUrl;
    session.questions[questionIndex].score = score;

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: session,
    });
  } catch (error) {
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
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Calculate overall score
    const scores = session.questions
      .filter((q) => q.score !== undefined)
      .map((q) => q.score);

    const overallScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Generate strengths and weaknesses (basic logic)
    const strengths = scores.filter((s) => s >= 7).length > 0 ? ['Good communication', 'Clear thinking'] : [];
    const weaknesses = scores.filter((s) => s < 5).length > 0 ? ['Needs improvement', 'Lacks clarity'] : [];

    session.overallScore = Math.round(overallScore * 10) / 10;
    session.strengths = strengths;
    session.weaknesses = weaknesses;
    session.status = 'Completed';
    session.endTime = new Date();
    session.duration = Math.floor((session.endTime - session.startTime) / 1000);

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Interview completed successfully',
      data: session,
    });
  } catch (error) {
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
    const interviews = await InterviewSession.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
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
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    const report = {
      candidateName: session.candidateName,
      candidateEmail: session.candidateEmail,
      interviewRound: session.interviewRound,
      overallScore: session.overallScore,
      status: session.status,
      duration: session.duration,
      strengths: session.strengths,
      weaknesses: session.weaknesses,
      questionsCount: session.questions.length,
      completedQuestions: session.questions.filter((q) => q.score !== undefined).length,
      detailedAnswers: session.questions.map((q) => ({
        question: q.questionText,
        answer: q.candidateAnswer,
        score: q.score,
        feedback: q.feedback,
      })),
    };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
