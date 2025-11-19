import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Table, message, Space, Popconfirm, Modal, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { questionsAPI } from '../utils/api';
import QuestionForm from '../components/QuestionForm';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (values) => {
    try {
      const keywords = values.expectedKeywords
        ? values.expectedKeywords.split(',').map((k) => k.trim())
        : [];

      const data = {
        ...values,
        expectedKeywords: keywords,
      };

      await questionsAPI.create(data);
      message.success('Question added successfully');
      fetchQuestions();
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await questionsAPI.delete(id);
      message.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      message.error('Failed to delete question');
    }
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => (
        <span
          style={{
            backgroundColor:
              category === 'HR'
                ? '#87d068'
                : category === 'Technical'
                ? '#2db7f5'
                : '#ff7a45',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
          }}
        >
          {category}
        </span>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingQuestion(record);
              form.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="Delete Question"
            description="Are you sure?"
            onConfirm={() => handleDeleteQuestion(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-panel">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <QuestionForm onSubmit={handleAddQuestion} />
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Questions Management" className="questions-table-card">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={questions}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanel;
