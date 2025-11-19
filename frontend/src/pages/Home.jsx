import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spin, message, Select, InputNumber } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../utils/api';
import '../styles/Home.css';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRound, setSelectedRound] = useState('HR');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data.data);
    } catch (error) {
      message.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = () => {
    if (numberOfQuestions <= 0) {
      message.warning('Please select number of questions');
      return;
    }
    navigate('/interview', {
      state: {
        round: selectedRound,
        numberOfQuestions,
      },
    });
  };

  const categoryCounts = {
    HR: questions.filter((q) => q.category === 'HR').length,
    Technical: questions.filter((q) => q.category === 'Technical').length,
    Behavioral: questions.filter((q) => q.category === 'Behavioral').length,
  };

  return (
    <div className="home-container">
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card className="hero-card">
            <h1>Welcome to JobsUPI</h1>
            <p>AI-Powered Video Interviewer Platform</p>
            <p className="hero-subtitle">
              Experience a mock interview with our intelligent avatar interviewer.
              Practice answering questions and receive instant AI-driven evaluation.
            </p>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="interview-setup-card" title="Start Your Interview">
            <div className="setup-section">
              <label>Select Interview Round:</label>
              <Select
                size="large"
                value={selectedRound}
                onChange={setSelectedRound}
                style={{ width: '100%', marginTop: 10 }}
              >
                <Select.Option value="HR">HR Round</Select.Option>
                <Select.Option value="Technical">Technical Round</Select.Option>
                <Select.Option value="Behavioral">Behavioral Round</Select.Option>
              </Select>
            </div>

            <div className="setup-section">
              <label>Number of Questions:</label>
              <InputNumber
                size="large"
                min={1}
                max={20}
                value={numberOfQuestions}
                onChange={setNumberOfQuestions}
                style={{ width: '100%', marginTop: 10 }}
              />
            </div>

            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={startInterview}
              block
              className="start-interview-btn"
            >
              Start Interview
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="statistics-card" title="Available Questions">
            <Spin spinning={loading}>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>HR Questions</h3>
                  <p className="stat-number">{categoryCounts.HR}</p>
                </div>
                <div className="stat-card">
                  <h3>Technical Questions</h3>
                  <p className="stat-number">{categoryCounts.Technical}</p>
                </div>
                <div className="stat-card">
                  <h3>Behavioral Questions</h3>
                  <p className="stat-number">{categoryCounts.Behavioral}</p>
                </div>
              </div>
              <p className="total-questions">
                Total: {questions.length} Questions Available
              </p>
            </Spin>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Features" className="features-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="feature-item">
                  <h4>🤖 Avatar Interviewer</h4>
                  <p>Interactive avatar that reads questions aloud</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="feature-item">
                  <h4>🎤 Audio Recording</h4>
                  <p>Record your responses in real-time</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="feature-item">
                  <h4>📊 AI Evaluation</h4>
                  <p>Get instant AI-driven scoring and feedback</p>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="feature-item">
                  <h4>📈 Performance Report</h4>
                  <p>Detailed analysis of your interview performance</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
