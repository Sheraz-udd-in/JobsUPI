import React from 'react';
import { Form, Input, Select, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/QuestionForm.css';

const QuestionForm = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Card className="question-form-card" title="Add New Question">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Question Title"
          rules={[{ required: true, message: 'Please enter question title' }]}
        >
          <Input placeholder="Enter question title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Question Description"
          rules={[{ required: true, message: 'Please enter question description' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter detailed question" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            <Select.Option value="HR">HR</Select.Option>
            <Select.Option value="Technical">Technical</Select.Option>
            <Select.Option value="Behavioral">Behavioral</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="difficulty"
          label="Difficulty Level"
          rules={[{ required: true, message: 'Please select difficulty' }]}
        >
          <Select placeholder="Select difficulty">
            <Select.Option value="Easy">Easy</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="Hard">Hard</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="expectedKeywords"
          label="Expected Keywords (comma separated)"
        >
          <Input placeholder="keyword1, keyword2, keyword3" />
        </Form.Item>

        <Form.Item
          name="evaluationCriteria"
          label="Evaluation Criteria"
          rules={[{ required: true, message: 'Please enter evaluation criteria' }]}
        >
          <Input.TextArea rows={3} placeholder="What should be evaluated?" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={loading}
            block
          >
            Add Question
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QuestionForm;
