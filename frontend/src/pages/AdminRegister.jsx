import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/authSlice';
import { authAPI } from '../utils/api';
import '../styles/Auth.css';

const AdminRegister = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.register(values);
      dispatch(
        loginSuccess({
          token: response.data.token,
          admin: response.data.admin,
        })
      );
      message.success('Registration successful');
      navigate('/admin/questions');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(errorMsg));
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="Admin Registration" style={{ maxWidth: 500, margin: '50px auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your full name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select size="large" placeholder="Select your role">
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Moderator">Moderator</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Register
            </Button>
          </Form.Item>

          <p className="register-link">
            Already have an account?{' '}
            <a onClick={() => navigate('/admin/login')}>Login here</a>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default AdminRegister;
