# 🔐 Environment Configuration Guide

## ✅ What's Been Added

Your project now has **Supabase environment variables configured** in both frontend and backend!

---

## 📋 Backend Configuration

### File: `backend/.env`
```properties
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://rnqpiqjnxlgkhxsjvimv.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8

# JWT Secret
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Status**: ✅ Already configured
**Used by**: `backend/config/supabase.js`

---

## 🎨 Frontend Configuration

### File: `frontend/.env` (NEW!)
```properties
REACT_APP_SUPABASE_URL=https://rnqpiqjnxlgkhxsjvimv.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucXBpcWpueGxna2h4c2p2aW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDk5MDksImV4cCI6MjA3OTEyNTkwOX0.kofJmCLJniSq89J81qmQokA4PUbQfh0T45fPyZlmpR8
REACT_APP_API_URL=http://localhost:5000/api
```

**Status**: ✅ Just created!
**Used by**: `frontend/src/config/supabase.js`

---

## 🔗 Supabase Client Configuration

### Backend: `backend/config/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default supabase;
```

### Frontend: `frontend/src/config/supabase.js` (NEW!)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

---

## 🚀 How to Use in Your Frontend

### Example 1: Import and use Supabase client
```javascript
// In any React component
import supabase from '../config/supabase';

function MyComponent() {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*');
    
    console.log(data);
  };

  return (
    <button onClick={fetchData}>Load Questions</button>
  );
}
```

### Example 2: Authentication
```javascript
import supabase from '../config/supabase';

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Login failed:', error.message);
  } else {
    console.log('Logged in as:', data.user.email);
  }
}
```

### Example 3: Query data
```javascript
import supabase from '../config/supabase';

async function getQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true);

  return data;
}
```

---

## 📦 Required Packages

Make sure these are installed:

### Backend
```bash
npm install @supabase/supabase-js
```
✅ Already installed

### Frontend
```bash
npm install @supabase/supabase-js
```

Check if installed:
```bash
cd frontend
npm list @supabase/supabase-js
```

If not installed:
```bash
npm install @supabase/supabase-js
```

---

## 🔒 Environment Variable Naming

### Why REACT_APP_ prefix for frontend?
- React creates variables starting with `REACT_APP_` as public variables
- They're safe to expose in frontend code (they're already public)
- Do NOT put sensitive tokens here (use backend for that)

### Backend doesn't need prefix
- Backend variables are completely private
- Only accessible server-side
- Safe for sensitive data

---

## ✅ Verification Checklist

- [ ] Backend `.env` has `SUPABASE_URL` and `SUPABASE_KEY`
- [ ] Frontend `.env` has `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- [ ] `frontend/src/config/supabase.js` exists
- [ ] Both have matching URLs (should be the same)
- [ ] API key is the same (ANON key)
- [ ] `@supabase/supabase-js` is installed in frontend

---

## 🧪 Test the Configuration

### Backend Test
```bash
cd backend
npm run dev
```

Look for output:
```
✅ Server running on port 5000
✅ Supabase Connected Successfully
```

### Frontend Test
```bash
cd frontend
npm start
```

Open browser console (F12) and check for:
- No error about missing `REACT_APP_SUPABASE_URL`
- No error about missing `REACT_APP_SUPABASE_ANON_KEY`

---

## 🚨 Troubleshooting

### Frontend can't find environment variables

**Problem**: `process.env.REACT_APP_SUPABASE_URL is undefined`

**Solution**:
1. Make sure `.env` file is in `frontend/` folder (not `frontend/src/`)
2. Restart development server after creating/updating `.env`
3. Verify variable name starts with `REACT_APP_`

### Backend won't connect to Supabase

**Problem**: `Could not find the table 'public.admins'`

**Solution**:
1. Create database tables (run SQL in Supabase dashboard)
2. Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
3. Check that API key has correct permissions

### "Invalid URL" error

**Problem**: `Invalid URL: undefined`

**Solution**:
1. Verify `.env` file exists
2. Check file is in correct location:
   - Backend: `backend/.env`
   - Frontend: `frontend/.env`
3. Restart the development server

---

## 🔄 Next Steps

1. ✅ **Verify configuration** - Check .env files exist and have values
2. **Start backend**: `cd backend && npm run dev`
3. **Start frontend**: `cd frontend && npm start`
4. **Test connection**: Open browser console and verify no errors
5. **Create API calls**: Start building features using Supabase client

---

## 📚 Documentation References

- [Supabase JS Client Docs](https://supabase.com/docs/reference/javascript)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## 💾 Don't Forget!

### Important: `.env` files should NOT be committed to Git

Your `.gitignore` should already have:
```
.env
.env.local
.env.*.local
```

This prevents accidentally pushing sensitive credentials to GitHub.

Use `.env.example` for template:
```
# backend/.env.example
SUPABASE_URL=your-url-here
SUPABASE_KEY=your-key-here

# frontend/.env.example
REACT_APP_SUPABASE_URL=your-url-here
REACT_APP_SUPABASE_ANON_KEY=your-key-here
REACT_APP_API_URL=http://localhost:5000/api
```

---

**You're all set! Environment variables configured successfully! 🎉**
