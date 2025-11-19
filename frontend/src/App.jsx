import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminPanel from './pages/AdminPanel';
import InterviewSession from './components/InterviewSession';
import './App.css';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Layout className="app-layout">
        <Header />
        <Layout.Content className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<InterviewSession />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route
              path="/admin/questions"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Router>
  );
}

export default App;
