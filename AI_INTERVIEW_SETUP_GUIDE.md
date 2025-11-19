# 🎯 AI Video Interviewer Integration Guide

## Overview

Your JobsUPI project now includes a **complete AI-powered mock interview system** integrated with Hugging Face. Users can upload their resume, describe a job, and practice with an AI interviewer who will ask questions, listen to responses, and provide feedback.

---

## 📦 What's New

### Backend AI Service
- **Location**: `backend/ai_service/app.py`
- **Purpose**: Python Flask microservice that handles AI interviews
- **Features**:
  - Connects to Hugging Face AI interviewer model
  - Converts speech to text (speech recognition)
  - Converts text to speech (audio feedback)
  - Manages interview sessions

### Frontend Component
- **Location**: `frontend/src/components/InterviewSession.jsx`
- **Purpose**: React component for the interview UI
- **Features**:
  - Setup page for resume upload and job description
  - Real-time interview interface with recording
  - Conversation history display
  - Completion summary

### Styles
- **Location**: `frontend/src/components/InterviewSession.css`
- **Purpose**: Complete styling for interview UI

---

## 🛠️ Setup Instructions

### Step 1: Install FFmpeg (REQUIRED)

FFmpeg is essential for audio processing. Choose your OS:

#### Windows
1. Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
2. Extract to: `C:\ffmpeg\`
3. Add `C:\ffmpeg\bin\` to your system PATH:
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under System variables, click "Path" → Edit
   - Click "New" → Add `C:\ffmpeg\bin`
   - Click OK
4. Verify: Open PowerShell and run:
   ```powershell
   ffmpeg -version
   ```
   Should show version info ✅

#### macOS
```bash
brew install ffmpeg
ffmpeg -version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install ffmpeg
ffmpeg -version
```

### Step 2: Install AI Service Dependencies

```bash
cd backend/ai_service
python -m venv venv
```

Activate virtual environment:

**Windows:**
```bash
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

Install packages:
```bash
pip install -r requirements.txt
```

### Step 3: Start the AI Service

From `backend/ai_service` (with venv activated):
```bash
python app.py
```

Expected output:
```
✅ FFmpeg Status: ✅ Available
✅ Connection to Hugging Face successful!
======================================================================
Starting AI Video Interviewer Service
======================================================================
Visit http://localhost:5001 to start interviews
```

### Step 4: Update Frontend to Include Interview Component

In your main React app (e.g., `frontend/src/App.jsx` or routing file):

```jsx
import InterviewSession from './components/InterviewSession';

// Add a route for interviews
<Route path="/interview" element={<InterviewSession />} />
```

### Step 5: Start Your Main Application

**Terminal 1 - Backend (Express)**:
```bash
cd backend
npm run dev
```

**Terminal 2 - AI Service (Flask)**:
```bash
cd backend/ai_service
.\venv\Scripts\activate  # Windows
python app.py
```

**Terminal 3 - Frontend (React)**:
```bash
cd frontend
npm start
```

---

## 🚀 Usage

### For Users

1. **Navigate to Interview**:
   - Go to `http://localhost:3000/interview`

2. **Setup**:
   - Upload your resume (PDF format)
   - Paste the job description
   - Click "Start Interview"

3. **Interview**:
   - Listen to AI's question
   - Click "Record Answer"
   - Speak your response
   - Click "Stop Recording"
   - Click "Submit Response"
   - Repeat until interview is complete

4. **Complete**:
   - Click "End Interview"
   - View your final report

### API Endpoints

All endpoints are on `http://localhost:5001`:

```
POST /api/start-interview
  - Starts new interview
  - Requires: resume (file), job_description (string)
  - Returns: first_question, audio_url, conversation

POST /api/process-response
  - Processes user's spoken response
  - Requires: audio (file), conversation_history (string)
  - Returns: transcription, ai_response, audio_url, conversation

POST /api/end-interview
  - Ends interview and saves data
  - Requires: interview_data (object)
  - Returns: success message

GET /health
  - Health check
  - Returns: service status, HuggingFace connection status
```

---

## 🔧 Troubleshooting

### "FFmpeg not found"
**Problem**: Error during audio processing
**Solution**:
- Verify FFmpeg installation: `ffmpeg -version`
- Check PATH includes `C:\ffmpeg\bin` (Windows) or `brew list ffmpeg` (macOS)
- Restart your terminal/IDE after installing

### "Cannot connect to Hugging Face"
**Problem**: Network error or model unavailable
**Solution**:
- Check internet connection
- Hugging Face model might be temporarily offline
- Try again in a few minutes
- Check firewall isn't blocking outbound connections

### Microphone/Audio not working
**Problem**: Browser can't access microphone
**Solution**:
- Check browser permissions (Chrome → Settings → Privacy → Microphone)
- Try in incognito mode
- Grant permission when prompted
- Use HTTPS (not HTTP for local testing - localhost is exception)

### "Could not understand audio"
**Problem**: Speech recognition failed
**Solution**:
- Speak clearly and at normal pace
- Check microphone volume
- Reduce background noise
- Try shorter responses

### Interview not starting
**Problem**: Resume upload fails
**Solution**:
- Ensure file is PDF format (not DOCX)
- File size under 10MB
- Job description is not empty
- AI service is running (`python app.py`)

### Port already in use
**Problem**: "Address already in use"
**Solution**:
```bash
# Find process using port 5001
lsof -i :5001  # macOS/Linux
netstat -ano | findstr :5001  # Windows

# Kill process (Windows)
taskkill /PID <PID> /F
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   USER BROWSER                          │
│              (React Frontend)                           │
│  - Interview setup                                      │
│  - Audio recording                                      │
│  - Conversation display                                │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   Express    │  │  Flask AI        │
│   Backend    │  │  Service         │
│ (5000)       │  │  (5001)          │
└──────┬───────┘  └────────┬─────────┘
       │                   │
       │           ┌───────┴──────────────┐
       │           │                      │
       ▼           ▼                      ▼
   ┌─────────┐  ┌──────────┐  ┌──────────────────┐
   │ Supabase│  │  Google  │  │  Hugging Face    │
   │   DB    │  │  Speech  │  │  AI Interviewer  │
   │         │  │  to Text │  │  Model           │
   └─────────┘  └──────────┘  └──────────────────┘
                    │
                    ▼
                ┌──────────┐
                │   gTTS   │
                │ Text to  │
                │  Speech  │
                └──────────┘
```

---

## 🎓 How It Works

### Interview Flow

```
1. USER UPLOADS RESUME + JOB DESCRIPTION
   ↓
2. AI SERVICE CALLS HUGGING FACE
   ↓
3. HF GENERATES FIRST QUESTION
   ↓
4. QUESTION CONVERTED TO SPEECH (gTTS)
   ↓
5. AUDIO PLAYED TO USER
   ↓
6. USER CLICKS RECORD & SPEAKS ANSWER
   ↓
7. ANSWER RECORDED AS AUDIO
   ↓
8. AUDIO CONVERTED TO TEXT (Google Speech-to-Text)
   ↓
9. TEXT SENT TO HUGGING FACE
   ↓
10. HF GENERATES FOLLOW-UP QUESTION
    ↓
11. GOTO STEP 3 (REPEAT)
    ↓
12. USER CLICKS END INTERVIEW
    ↓
13. INTERVIEW SAVED TO SUPABASE
    ↓
14. USER VIEWS REPORT
```

---

## 💾 Database Integration (Optional)

To save interviews to Supabase:

```javascript
// In frontend component, after interview ends
const saveInterview = async (interviewData) => {
  const { data, error } = await supabase
    .from('interviews')
    .insert({
      candidate_id: userId,
      skill_category: 'Interview',
      conversation: interviewData.conversation,
      questions: interviewData.questions,
      status: 'completed',
      created_at: new Date()
    });
  
  if (error) console.error('Save failed:', error);
  else console.log('Interview saved!', data);
};
```

---

## 📝 Configuration Files

### backend/ai_service/requirements.txt
```
Flask==2.3.2
Flask-Cors==4.0.0
gradio_client==0.15.0
SpeechRecognition==3.10.0
gTTS==2.3.2
pydub==0.25.1
python-dotenv==1.0.0
requests==2.31.0
```

### Environment Variables (Optional)
Create `backend/ai_service/.env`:
```
FLASK_ENV=production
FLASK_DEBUG=False
HF_SPACE_URL=ahmedatk/ai_interviewer
GOOGLE_SPEECH_KEY=your_key_here
```

---

## 🎯 Next Steps

1. **Testing**:
   - Start all services
   - Navigate to `/interview`
   - Complete a full interview session
   - Check console for any errors

2. **Customization**:
   - Modify interview questions
   - Add scoring logic
   - Save to database
   - Generate reports

3. **Deployment**:
   - Deploy Flask service separately
   - Use AWS, Heroku, or Railway for AI service
   - Update API URLs for production

---

## 📚 Documentation References

- **Hugging Face Model**: https://huggingface.co/spaces/ahmedatk/ai_interviewer
- **gradio_client**: https://www.gradio.app/docs/client
- **gTTS**: https://gtts.readthedocs.io/
- **SpeechRecognition**: https://github.com/Uberi/speech_recognition
- **pydub**: https://github.com/jiaaro/pydub

---

## ⚙️ Performance Tips

1. **Audio Quality**: Use WAV format for better speech recognition
2. **Timeout**: Increase timeout for slow network connections
3. **Caching**: Cache frequently asked questions
4. **Async Processing**: Use background jobs for long operations

---

## 🔒 Security Considerations

1. **API Keys**: Store HuggingFace keys securely
2. **File Upload**: Validate file types (PDF only)
3. **Rate Limiting**: Limit API calls per user
4. **HTTPS**: Use HTTPS in production
5. **CORS**: Restrict CORS origins in production

---

## 🐛 Debugging

Enable debug logging:

```python
# In backend/ai_service/app.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

Monitor services:
```bash
# Check port 5001 (Flask)
netstat -tlnp | grep 5001

# Check port 5000 (Express)
netstat -tlnp | grep 5000

# Check port 3000 (React)
netstat -tlnp | grep 3000
```

---

## 📞 Support

### Common Issues Checklist
- [ ] FFmpeg installed and in PATH
- [ ] Python 3.8+ installed
- [ ] Virtual environment activated
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] HuggingFace model is available (check website)
- [ ] No firewall blocking ports 5000, 5001, 3000
- [ ] Microphone permission granted in browser
- [ ] Resume is PDF format
- [ ] Job description is not empty

### Getting Help
1. Check error messages in terminal
2. Review troubleshooting section above
3. Check browser console (F12) for errors
4. Verify all services are running

---

**Your AI Interview system is ready to use!** 🎉

Start with: `http://localhost:3000/interview`
