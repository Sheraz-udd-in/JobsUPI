import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Upload, Input, message, Spinner, Row, Col, Alert, Badge, Divider } from 'antd';
import { AudioOutlined, CameraOutlined, StopOutlined, SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import './InterviewSession.css';

const InterviewSession = () => {
  // State Management
  const [stage, setStage] = useState('setup'); // setup, interview, completed
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  
  // Form Data
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  
  // Interview Data
  const [conversation, setConversation] = useState('');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  
  // Recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  
  // Video
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Interview Stats
  const [recordingTime, setRecordingTime] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // ==========================================================================
  // SETUP PHASE - Resume and Job Description
  // ==========================================================================

  const handleResumeUpload = (file) => {
    if (file.type === 'application/pdf') {
      setResume(file);
      message.success('Resume uploaded successfully!');
    } else {
      message.error('Please upload a PDF file');
    }
    return false;
  };

  const handleStartInterview = async () => {
    if (!resume || !jobDescription.trim()) {
      message.error('Please upload resume and enter job description');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('http://localhost:5001/api/start-interview', formData);
      
      if (response.data.success) {
        setConversation(response.data.conversation);
        setFirstQuestion(response.data.first_question);
        setAudioUrl(response.data.audio_url);
        setInterviewId(Date.now().toString()); // Generate interview ID
        setQuestionCount(1);
        setStage('interview');
        message.success('Interview started! Listen to the question.');
        
        // Auto-play first question
        if (response.data.audio_url) {
          playAudio(response.data.audio_url);
        }
      }
    } catch (error) {
      message.error('Failed to start interview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // INTERVIEW PHASE - Recording and Responses
  // ==========================================================================

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: 'audio/webm' 
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);
      message.info('Recording started. Speak your answer.');

      // Timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      window.recordingTimerInterval = interval;
    } catch (error) {
      message.error('Could not access microphone: ' + error.message);
    }
  };

  const stopRecording = async () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && recording) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          streamRef.current.getTracks().forEach(track => track.stop());
          clearInterval(window.recordingTimerInterval);
          setRecording(false);
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      }
    });
  };

  const submitResponse = async () => {
    if (!recording && recordingTime === 0) {
      message.warning('Please record your answer first');
      return;
    }

    setLoading(true);
    const audioBlob = await stopRecording();

    const formData = new FormData();
    formData.append('audio', audioBlob, 'response.webm');
    formData.append('conversation_history', conversation);

    try {
      const response = await axios.post('http://localhost:5001/api/process-response', formData);

      if (response.data.success) {
        setConversation(response.data.conversation);
        setAudioUrl(response.data.audio_url);
        setQuestionCount(prev => prev + 1);
        setRecordingTime(0);
        message.success('Response submitted! Listening to next question.');

        // Auto-play next question
        if (response.data.audio_url) {
          playAudio(response.data.audio_url);
        }
      }
    } catch (error) {
      message.error('Failed to process response: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play().catch(err => console.log('Audio playback failed:', err));
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/end-interview', {
        interview_data: {
          id: interviewId,
          conversation,
          questions: questionCount
        }
      });
      
      setStage('completed');
      message.success('Interview completed! Check your report.');
    } catch (error) {
      message.error('Failed to end interview: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // RENDERING PHASES
  // ==========================================================================

  if (stage === 'setup') {
    return (
      <div className="interview-container">
        <Card className="setup-card" title={<h2>📝 Start Your Interview</h2>}>
          <div className="setup-content">
            <Alert
              message="Get ready for your AI-powered mock interview!"
              description="Upload your resume and job description to begin. The AI interviewer will ask you job-specific questions."
              type="info"
              showIcon
              style={{ marginBottom: '20px' }}
            />

            <Divider />

            <div className="form-section">
              <h3>1. Upload Your Resume</h3>
              <Upload
                accept=".pdf"
                maxCount={1}
                beforeUpload={handleResumeUpload}
                listType="text"
              >
                <Button icon={<AudioOutlined />}>
                  📄 Select PDF Resume
                </Button>
              </Upload>
              {resume && (
                <p style={{ color: 'green', marginTop: '10px' }}>
                  ✅ {resume.name} uploaded
                </p>
              )}
            </div>

            <Divider />

            <div className="form-section">
              <h3>2. Paste Job Description</h3>
              <Input.TextArea
                rows={6}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                Include role, responsibilities, and required skills
              </p>
            </div>

            <Divider />

            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handleStartInterview}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Starting Interview...' : 'Start Interview'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="interview-container">
        <Row gutter={[16, 16]}>
          {/* Left: Questions and Controls */}
          <Col xs={24} lg={14}>
            <Card className="interview-card">
              <h2>🎤 Your Interview</h2>
              
              <div className="stats-bar">
                <Badge count={questionCount} showZero style={{ backgroundColor: '#52c41a' }} />
                <span style={{ marginLeft: '10px' }}>Questions Asked</span>
                
                <span style={{ marginLeft: '20px' }}>
                  ⏱️ Recording Time: {recordingTime}s
                </span>
              </div>

              <Divider />

              <h3>Question {questionCount}</h3>
              <p className="question-text">{firstQuestion}</p>

              {audioUrl && (
                <div className="audio-player">
                  <audio src={audioUrl} controls style={{ width: '100%' }} />
                </div>
              )}

              <Divider />

              <h3>Your Answer</h3>
              <div className="recording-controls">
                {!recording ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<AudioOutlined />}
                    onClick={startRecording}
                    loading={loading}
                  >
                    Record Answer
                  </Button>
                ) : (
                  <>
                    <Button
                      danger
                      size="large"
                      icon={<StopOutlined />}
                      onClick={() => setRecording(false)}
                    >
                      Stop Recording
                    </Button>
                    <span style={{ marginLeft: '10px', fontSize: '16px' }}>
                      ⏹️ {recordingTime}s
                    </span>
                  </>
                )}
              </div>

              {recordingTime > 0 && !recording && (
                <Button
                  type="primary"
                  style={{ marginTop: '10px' }}
                  icon={<SendOutlined />}
                  onClick={submitResponse}
                  loading={loading}
                  block
                >
                  Submit Response
                </Button>
              )}
            </Card>

            {/* End Interview Button */}
            <Button
              danger
              block
              size="large"
              style={{ marginTop: '16px' }}
              onClick={endInterview}
            >
              End Interview
            </Button>
          </Col>

          {/* Right: Conversation Log */}
          <Col xs={24} lg={10}>
            <Card className="conversation-card" title="💬 Conversation">
              <div className="conversation-log">
                {conversation ? (
                  conversation.split('\n').map((line, idx) => {
                    if (line.startsWith('**You:**')) {
                      return (
                        <div key={idx} className="message user-message">
                          <strong>You:</strong> {line.replace('**You:**', '').trim()}
                        </div>
                      );
                    } else if (line.startsWith('**AI:**')) {
                      return (
                        <div key={idx} className="message ai-message">
                          <strong>🤖 AI:</strong> {line.replace('**AI:**', '').trim()}
                        </div>
                      );
                    } else if (line.trim()) {
                      return (
                        <div key={idx} className="message ai-message">
                          <strong>🤖 AI:</strong> {line}
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p style={{ color: '#999' }}>Conversation will appear here...</p>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (stage === 'completed') {
    return (
      <div className="interview-container">
        <Card className="completion-card">
          <h1>✅ Interview Completed!</h1>
          
          <Alert
            message={`Great job! You completed ${questionCount} questions.`}
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <div className="stats">
            <div className="stat-item">
              <h3>{questionCount}</h3>
              <p>Questions Asked</p>
            </div>
            <div className="stat-item">
              <h3>{Math.floor(recordingTime / 60)}m {recordingTime % 60}s</h3>
              <p>Total Time</p>
            </div>
          </div>

          <Divider />

          <h3>Full Conversation</h3>
          <div className="final-conversation">
            {conversation}
          </div>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => window.location.href = '/dashboard'}
              >
                View Report
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                size="large"
                onClick={() => setStage('setup')}
              >
                Start Another Interview
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
};

export default InterviewSession;
