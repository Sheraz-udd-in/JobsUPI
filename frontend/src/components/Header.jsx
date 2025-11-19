import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: admin?.email || 'Profile',
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout.Header className="header">
      <div className="header-content">
        <div className="logo">
          <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'white', margin: 0 }}>
            JobsUPI
          </h1>
        </div>

        <div className="header-right">
          <Menu
            mode="horizontal"
            className="header-menu"
            onClick={({ key }) => {
              if (key === 'home') navigate('/');
              if (key === 'interviews') navigate('/interviews');
              if (key === 'questions') navigate('/admin/questions');
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              Home
            </Menu.Item>
            {isAuthenticated && (
              <>
                <Menu.Item key="interviews" icon={<FileTextOutlined />}>
                  Interviews
                </Menu.Item>
                <Menu.Item key="questions" icon={<FileTextOutlined />}>
                  Manage Questions
                </Menu.Item>
              </>
            )}
          </Menu>

          {isAuthenticated && admin ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
              />
            </Dropdown>
          ) : (
            <Button
              type="primary"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </Layout.Header>
  );
};

export default Header;
