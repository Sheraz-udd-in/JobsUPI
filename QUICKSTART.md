# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
- ✅ Node.js installed? (Check: `node --version`)
- ✅ MongoDB installed or account at mongodb.com/cloud/atlas
- ✅ Git installed? (Check: `git --version`)

---

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy example)
# Edit MongoDB connection string in .env
MONGODB_URI=mongodb://localhost:27017/jobs-upi
JWT_SECRET=your_secret_key_here

# Start backend
npm run dev
```

**Backend should now be running on**: `http://localhost:5000`

---

## Step 2: Frontend Setup (2 minutes)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
```

**Frontend should open at**: `http://localhost:3000`

---

## Step 3: Test the Application (1 minute)

1. **Open Browser**: http://localhost:3000
2. **Home Page**: See welcome screen with interview stats
3. **Admin Login**: Click "Admin Login"
4. **Create Account**: Click register and create your admin account
5. **Add Questions**: Go to "Manage Questions" and add some interview questions
6. **Start Interview**: Go back to home and click "Start Interview"

---

## 📋 Default Test Data

### Admin Account (Create on first run)
- Email: admin@example.com
- Password: Password@123

### Interview Categories
- HR Round
- Technical Round
- Behavioral Round

---

## 🎯 Key Features to Try

### 1. Admin Panel
- Add new interview questions
- Set difficulty levels
- Define evaluation criteria
- Categorize by round type

### 2. Interview Setup
- Select interview round
- Choose number of questions
- Click "Start Interview"

### 3. Avatar & Recording
- Click "Read Question Aloud"
- Record your response
- Transcription appears automatically
- Submit your answer

---

## 📚 Important Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Main backend server |
| `backend/.env` | Backend configuration |
| `frontend/src/App.jsx` | Main React app |
| `frontend/.env` | Frontend configuration |
| `SETUP.md` | Detailed setup guide |
| `DOCUMENTATION.md` | Full documentation |

---

## 🐛 Quick Troubleshooting

### Issue: Backend won't start
```bash
# Check if port 5000 is in use
# Solution: Change PORT in backend/.env
```

### Issue: MongoDB connection error
```bash
# Make sure MongoDB is running
# Or update MONGODB_URI in .env to use MongoDB Atlas
```

### Issue: CORS errors
```bash
# Make sure backend is running on 5000
# Check REACT_APP_API_URL in frontend/.env
```

### Issue: npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Project Structure Reference

```
JobsUPI/
├── backend/          # Express server
│   ├── models/       # Database schemas
│   ├── routes/       # API endpoints
│   ├── controllers/  # Business logic
│   └── server.js     # Main server
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/
│   │   └── redux/    # State management
│   └── package.json
└── docs/            # Documentation files
```

---

## 💡 Next: Learn the Features

### Interview Flow
1. Candidate enters name and email
2. Selects interview round
3. Chooses number of questions
4. Avatar greets candidate
5. Questions are read aloud
6. Candidate records answer
7. System evaluates response
8. Final report generated

### Admin Panel
1. Login with admin credentials
2. Navigate to "Manage Questions"
3. Add/Edit/Delete interview questions
4. Set categories and difficulty
5. Define evaluation criteria
6. Expected keywords for matching

---

## 🔐 Security Notes

- Store JWT_SECRET securely
- Never commit .env files
- Use environment variables for sensitive data
- Change default passwords

---

## 📞 Need Help?

1. Check `DOCUMENTATION.md` for detailed info
2. Review `SETUP.md` for installation help
3. Look at existing code for examples
4. Check console for error messages

---

## ✨ Ready to Code?

Make your first change:
1. Edit a question in `frontend/src/pages/Home.jsx`
2. Add a new API endpoint in `backend/routes/questions.js`
3. Create a new component in `frontend/src/components/`

---

**Happy Coding! 🎉**

Last Updated: November 19, 2025
