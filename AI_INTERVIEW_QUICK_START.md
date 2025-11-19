# 🚀 AI Interview Quick Start (5-10 minutes)

## What You Have
✅ AI-powered interview component ready to use
✅ Flask backend service for AI conversations
✅ React frontend for interview interface
✅ Complete with speech recognition and text-to-speech

---

## Quick Setup

### 1. Install FFmpeg (3 minutes)

**Windows:**
```powershell
# Download from: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
# Extract to C:\ffmpeg\
# Add C:\ffmpeg\bin to PATH
# Verify:
ffmpeg -version
```

**macOS:**
```bash
brew install ffmpeg
ffmpeg -version
```

**Linux:**
```bash
sudo apt-get install ffmpeg
ffmpeg -version
```

### 2. Install AI Service (2 minutes)

```bash
cd backend/ai_service
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Start All Services (3 commands, 3 terminals)

**Terminal 1 - Express Backend:**
```bash
cd backend
npm run dev
```
Expected: Port 5000 ✅

**Terminal 2 - Flask AI Service:**
```bash
cd backend/ai_service
.\venv\Scripts\activate  # or: source venv/bin/activate
python app.py
```
Expected: Hugging Face Connected ✅

**Terminal 3 - React Frontend:**
```bash
cd frontend
npm start
```
Expected: http://localhost:3000 ✅

### 4. Access the Interview

Navigate to: **http://localhost:3000/interview**

---

## Test Interview (2 minutes)

1. **Upload Resume**: Select any PDF file
2. **Job Description**: Paste a job description (or sample below):
   ```
   Senior Software Engineer
   - 5+ years experience
   - Full Stack (React, Node.js, Python)
   - Database design experience
   - Leadership and mentoring skills
   - Requirements: Cloud platforms, microservices, system design
   ```
3. **Start**: Click "Start Interview"
4. **Record**: Click "Record Answer" and speak your response
5. **Submit**: Click "Submit Response"
6. **Repeat**: 3-5 questions should come
7. **End**: Click "End Interview"

---

## Verification Checklist

- [ ] FFmpeg installed and works (`ffmpeg -version`)
- [ ] Python 3.8+ installed
- [ ] Virtual environment activated
- [ ] All 3 services running on correct ports
- [ ] Browser console shows no errors (F12)
- [ ] Microphone permission granted
- [ ] Interview page loads without errors

---

## Troubleshooting (30 seconds)

### Error: "Cannot process audio"
```
→ FFmpeg not installed or not in PATH
→ Run: ffmpeg -version
→ Add C:\ffmpeg\bin to PATH (Windows)
```

### Error: "Cannot connect to HuggingFace"
```
→ Check internet connection
→ Model might be busy
→ Try again in 1-2 minutes
```

### Error: "Microphone not working"
```
→ Check browser permissions
→ Grant microphone access when prompted
→ Try another browser
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

---

## File Locations

```
backend/
├── ai_service/
│   ├── app.py              ← Flask AI service
│   ├── requirements.txt    ← AI service dependencies
│   ├── venv/              ← Virtual environment
│   └── static/
│       └── audio/         ← Generated audio files

frontend/
├── src/
│   ├── components/
│   │   ├── InterviewSession.jsx  ← Interview component
│   │   └── InterviewSession.css  ← Interview styles
```

---

## What Happens Behind the Scenes

```
User uploads resume + job description
    ↓
Calls Hugging Face AI model
    ↓
AI generates first question
    ↓
Question converted to speech (gTTS)
    ↓
Audio played to user
    ↓
User records answer (MediaRecorder)
    ↓
Answer converted to text (Google Speech-to-Text)
    ↓
Text sent to Hugging Face
    ↓
AI generates follow-up question or evaluation
    ↓
REPEAT until interview ends
```

---

## API Endpoints (For Reference)

```
POST http://localhost:5001/api/start-interview
  Body: { resume: File, job_description: string }
  Response: { first_question, audio_url, conversation }

POST http://localhost:5001/api/process-response
  Body: { audio: File, conversation_history: string }
  Response: { transcription, ai_response, audio_url, conversation }

GET http://localhost:5001/health
  Response: { status, huggingface, service }
```

---

## Performance Tips

- **Best**: Chrome browser (best speech recognition)
- **Network**: Fastest internet connection for HF model
- **Audio**: Speak clearly and slowly
- **Resume**: Keep it focused (1-2 pages)
- **Job Description**: Include key responsibilities

---

## Next Steps

1. ✅ Complete setup (you are here)
2. 🧪 Test with sample interview
3. 📊 Integrate with Supabase to save interviews
4. 📈 Add scoring and feedback system
5. 🎓 Deploy to production

---

## Production Deployment

To deploy the AI service:

**Option 1: Render.com (Recommended)**
```bash
# Create render.yaml in backend/ai_service/
# Deploy Flask app separately
# Update frontend API_URL to production URL
```

**Option 2: Heroku**
```bash
heroku create jobsupi-ai-service
git push heroku main
```

**Option 3: AWS Lambda**
```
Use serverless framework
Deploy to AWS
Configure API Gateway
```

---

## Support Resources

📚 **Documentation Files:**
- `AI_INTERVIEW_SETUP_GUIDE.md` - Full setup guide
- `QUICK_START_SUPABASE.md` - Database setup
- `FEATURE_ROADMAP.md` - Feature planning

🔗 **External Links:**
- [Hugging Face AI Interviewer](https://huggingface.co/spaces/ahmedatk/ai_interviewer)
- [FFmpeg Installation](https://ffmpeg.org/download.html)
- [gradio_client Docs](https://www.gradio.app/docs/client)

---

**Ready to interview with AI?** 🎤

Go to: http://localhost:3000/interview
