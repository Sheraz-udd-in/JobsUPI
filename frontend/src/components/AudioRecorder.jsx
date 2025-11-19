import React, { useState, useRef, useEffect } from 'react';
import { Button, Spin, message } from 'antd';
import { AudioOutlined, PauseOutlined } from '@ant-design/icons';
import '../styles/AudioRecorder.css';

const AudioRecorder = ({ onAudioSubmit, onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcriptSegment + ' ');
          } else {
            interimTranscript += transcriptSegment;
          }
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsRecording(true);
      message.success('Recording started');
    } catch (error) {
      message.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setIsRecording(false);
    message.success('Recording stopped');
  };

  const submitRecording = () => {
    if (audioURL && transcript) {
      onAudioSubmit({
        audioURL,
        transcript,
      });
      setAudioURL('');
      setTranscript('');
    } else {
      message.warning('Please record and transcribe your answer');
    }
  };

  return (
    <div className="audio-recorder">
      <div className="recording-controls">
        {!isRecording ? (
          <Button
            type="primary"
            size="large"
            icon={<AudioOutlined />}
            onClick={startRecording}
            className="record-btn"
          >
            Start Recording
          </Button>
        ) : (
          <Button
            danger
            size="large"
            icon={<PauseOutlined />}
            onClick={stopRecording}
            className="stop-btn"
          >
            Stop Recording
          </Button>
        )}
      </div>

      {transcript && (
        <div className="transcript-display">
          <h4>Your Response:</h4>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}

      {audioURL && (
        <div className="audio-playback">
          <h4>Playback:</h4>
          <audio src={audioURL} controls className="audio-player" />
        </div>
      )}

      {audioURL && transcript && (
        <Button
          type="primary"
          size="large"
          onClick={submitRecording}
          className="submit-btn"
          style={{ marginTop: '20px' }}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};

export default AudioRecorder;
