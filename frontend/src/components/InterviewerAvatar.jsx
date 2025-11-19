import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Row, Col, Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import '../styles/InterviewerAvatar.css';

const InterviewerAvatar = ({ question, onQuestionRead, isReading = false }) => {
  const [avatarExpression, setAvatarExpression] = useState('neutral');

  useEffect(() => {
    if (isReading) {
      setAvatarExpression('speaking');
    } else {
      setAvatarExpression('listening');
    }
  }, [isReading]);

  const speakQuestion = () => {
    if ('speechSynthesis' in window && question) {
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => onQuestionRead?.(true);
      utterance.onend = () => onQuestionRead?.(false);

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="interviewer-avatar">
      <Card className="avatar-card">
        <Row justify="center" align="middle">
          <Col span={24} align="center">
            <div className={`avatar-container avatar-${avatarExpression}`}>
              <Avatar
                size={200}
                icon={
                  <svg
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Head */}
                    <circle cx="100" cy="70" r="40" fill="#FFD1A3" />
                    {/* Eyes */}
                    <circle cx="85" cy="60" r="5" fill="#333" />
                    <circle cx="115" cy="60" r="5" fill="#333" />
                    {/* Mouth */}
                    <path
                      d="M 90 80 Q 100 85 110 80"
                      stroke="#333"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Body */}
                    <rect x="70" y="110" width="60" height="50" fill="#4A90E2" rx="5" />
                  </svg>
                }
                style={{ backgroundColor: '#FFD1A3' }}
              />
            </div>

            <h2 style={{ marginTop: '20px', color: '#333' }}>Interview Assistant</h2>

            {question && (
              <div className="question-display">
                <h3>Question:</h3>
                <p className="question-text">{question}</p>
              </div>
            )}

            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={speakQuestion}
              loading={isReading}
              className="read-question-btn"
              style={{ marginTop: '20px' }}
            >
              {isReading ? 'Reading Question...' : 'Read Question Aloud'}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default InterviewerAvatar;
