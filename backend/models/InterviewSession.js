const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    interviewRound: {
      type: String,
      enum: ['HR', 'Technical', 'Behavioral'],
      required: true,
    },
    questions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        questionText: String,
        candidateAnswer: String,
        audioUrl: String,
        score: {
          type: Number,
          min: 0,
          max: 10,
        },
        feedback: String,
      },
    ],
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Pending'],
      default: 'Pending',
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // in seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
