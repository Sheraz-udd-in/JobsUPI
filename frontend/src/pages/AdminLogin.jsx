import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../redux/authSlice';
import { authAPI } from '../utils/api';
import '../styles/Auth.css';

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values.email, values.password);
      dispatch(
        loginSuccess({
          token: response.data.token,
          admin: response.data.admin,
        })
      );
      message.success('Login successful');
      navigate('/admin/questions');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={20} md={12} lg={8}>
          <Card className="auth-card" title="Admin Login" style={{ width: '100%' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Invalid email format' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                >
                  Login
                </Button>
              </Form.Item>

              <p className="register-link">
                Don't have an account?{' '}
                <a onClick={() => navigate('/admin/register')}>Register here</a>
              </p>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminLogin;
