const { supabase } = require('../config/supabase');

// Demo interview storage (for demo mode without database)
const demoInterviews = new Map();

// @desc    Create interview session
// @route   POST /api/interviews
// @access  Public
exports.createInterviewSession = async (req, res) => {
  try {
    const { candidateName, candidateEmail, position, yearsOfExperience } = req.body;

    if (!candidateName || !candidateEmail || !position) {
      return res.status(400).json({
        success: false,
        message: 'Please provide candidate name, email, and position',
      });
    }

    let interview = null;

    try {
      // Try Supabase
      const { data, error } = await supabase
        .from('interviews')
        .insert({
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          position,
          years_of_experience: yearsOfExperience || 0,
          status: 'in_progress',
          answers: [],
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      interview = data;
    } catch (error) {
      console.log('⚠️  Supabase insert failed, using demo mode');
      
      // Demo mode
      const id = `demo-interview-${Date.now()}`;
      interview = {
        id,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        position,
        years_of_experience: yearsOfExperience || 0,
        status: 'in_progress',
        answers: [],
        created_at: new Date().toISOString(),
      };
      demoInterviews.set(id, interview);
    }

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Public
exports.getInterview = async (req, res) => {
  try {
    const { id } = req.params;

    let interview = null;

    try {
      // Try Supabase
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      interview = data;
    } catch (error) {
      console.log('⚠️  Supabase query failed, using demo mode');
      interview = demoInterviews.get(id);
    }

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit answer to question
// @route   PUT /api/interviews/:id/answer/:questionIndex
// @access  Public
exports.submitAnswer = async (req, res) => {
  try {
    const { id, questionIndex } = req.params;
    const { answer, duration } = req.body;

    let interview = null;

    try {
      // Try Supabase - get current interview
      const { data: current, error: fetchError } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!current) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found',
        });
      }

      // Update answers
      const answers = current.answers || [];
      answers[questionIndex] = {
        question_index: questionIndex,
        answer,
        duration: duration || 0,
        answered_at: new Date().toISOString(),
      };

      // Update in Supabase
      const { data: updated, error: updateError } = await supabase
        .from('interviews')
        .update({ answers })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      interview = updated;
    } catch (error) {
      console.log('⚠️  Supabase update failed, using demo mode');
      
      interview = demoInterviews.get(id);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found',
        });
      }

      if (!interview.answers) {
        interview.answers = [];
      }

      interview.answers[questionIndex] = {
        question_index: questionIndex,
        answer,
        duration: duration || 0,
        answered_at: new Date().toISOString(),
      };
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete interview
// @route   PUT /api/interviews/:id/complete
// @access  Public
exports.completeInterview = async (req, res) => {
  try {
    const { id } = req.params;

    let interview = null;

    try {
      // Calculate score (simple algorithm)
      const { data: current, error: fetchError } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (!current) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found',
        });
      }

      // Calculate score
      let score = 5;
      let strengths = [];
      let weaknesses = [];

      if (current.answers && current.answers.length > 0) {
        current.answers.forEach((ans) => {
          if (ans.answer && ans.answer.length > 100) {
            score += 2;
            strengths.push('Detailed answers provided');
          }
          if (ans.duration > 60) {
            score += 1;
            strengths.push('Good thinking time');
          }
          if (!ans.answer || ans.answer.length < 20) {
            weaknesses.push('Short or unclear answers');
          }
        });
      }

      score = Math.min(score, 10);

      // Update in Supabase
      const { data: completed, error: updateError } = await supabase
        .from('interviews')
        .update({
          status: 'completed',
          score,
          strengths,
          weaknesses,
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      interview = completed;
    } catch (error) {
      console.log('⚠️  Supabase update failed, using demo mode');
      
      interview = demoInterviews.get(id);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: 'Interview not found',
        });
      }

      let score = 5;
      let strengths = [];
      let weaknesses = [];

      if (interview.answers && interview.answers.length > 0) {
        interview.answers.forEach((ans) => {
          if (ans.answer && ans.answer.length > 100) {
            score += 2;
            strengths.push('Detailed answers provided');
          }
          if (ans.duration > 60) {
            score += 1;
            strengths.push('Good thinking time');
          }
          if (!ans.answer || ans.answer.length < 20) {
            weaknesses.push('Short or unclear answers');
          }
        });
      }

      interview.status = 'completed';
      interview.score = Math.min(score, 10);
      interview.strengths = strengths;
      interview.weaknesses = weaknesses;
      interview.completed_at = new Date().toISOString();
    }

    res.status(200).json({
      success: true,
      message: 'Interview completed',
      data: interview,
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
    const { id } = req.params;

    let interview = null;

    try {
      // Try Supabase
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      interview = data;
    } catch (error) {
      console.log('⚠️  Supabase query failed, using demo mode');
      interview = demoInterviews.get(id);
    }

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    const report = {
      candidate_name: interview.candidate_name,
      position: interview.position,
      score: interview.score || 0,
      status: interview.status,
      strengths: interview.strengths || [],
      weaknesses: interview.weaknesses || [],
      total_questions: interview.answers ? interview.answers.length : 0,
      answered_questions: interview.answers
        ? interview.answers.filter((a) => a && a.answer).length
        : 0,
      created_at: interview.created_at,
      completed_at: interview.completed_at,
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

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Public
exports.getAllInterviews = async (req, res) => {
  try {
    let interviews = [];

    try {
      // Try Supabase
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;
      interviews = data || [];
    } catch (error) {
      console.log('⚠️  Supabase query failed, using demo mode');
      interviews = Array.from(demoInterviews.values());
    }

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
