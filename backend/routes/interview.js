const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

// AI Service base URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

/**
 * POST /api/interview/start
 * Start a new interview session
 * Body: { resume: File, job_description: string }
 */
router.post('/start', async (req, res) => {
  try {
    // Forward request to Flask AI service
    const formData = new FormData();
    
    if (req.files && req.files.resume) {
      formData.append('resume', req.files.resume.data, {
        filename: req.files.resume.name,
        contentType: req.files.resume.mimetype,
      });
    }
    
    if (req.body.job_description) {
      formData.append('job_description', req.body.job_description);
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/start-interview`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Interview start error:', error.message);
    res.status(500).json({
      error: 'Failed to start interview',
      message: error.message,
    });
  }
});

/**
 * POST /api/interview/process-response
 * Process user response
 * Body: { audio: File, conversation_history: string }
 */
router.post('/process-response', async (req, res) => {
  try {
    const formData = new FormData();
    
    if (req.files && req.files.audio) {
      formData.append('audio', req.files.audio.data, {
        filename: req.files.audio.name,
        contentType: req.files.audio.mimetype,
      });
    }
    
    if (req.body.conversation_history) {
      formData.append('conversation_history', req.body.conversation_history);
    }

    const response = await axios.post(`${AI_SERVICE_URL}/api/process-response`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Process response error:', error.message);
    res.status(500).json({
      error: 'Failed to process response',
      message: error.message,
    });
  }
});

/**
 * POST /api/interview/end
 * End interview session
 * Body: { interview_data: object }
 */
router.post('/end', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/end-interview`, req.body, {
      timeout: 10000,
    });

    res.json(response.data);
  } catch (error) {
    console.error('End interview error:', error.message);
    res.status(500).json({
      error: 'Failed to end interview',
      message: error.message,
    });
  }
});

/**
 * GET /api/interview/health
 * Check if AI service is running
 */
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    res.json(response.data);
  } catch (error) {
    res.status(503).json({
      status: 'unavailable',
      service: 'AI Interview Service',
      error: error.message,
    });
  }
});

module.exports = router;
