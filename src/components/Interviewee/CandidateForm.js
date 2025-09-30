import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

// Redux actions
import { setCandidateInfo } from '../../redux/slices/interviewSlice';
import { generateQuestions } from '../../utils/interviewUtils';
import { startInterview } from '../../redux/slices/interviewSlice';

const { Title, Text } = Typography;

const CandidateForm = ({ onComplete }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { candidateInfo } = useSelector((state) => state.interview);
  
  // Set initial form values from Redux state
  useEffect(() => {
    form.setFieldsValue(candidateInfo);
  }, [candidateInfo, form]);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Update candidate info in Redux
      dispatch(setCandidateInfo(values));
      
      // Generate interview questions
      const questions = generateQuestions();
      
      // Start the interview
      dispatch(startInterview(questions));
      
      // Move to next step
      onComplete();
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <Title level={3} style={{ textAlign: 'center' }}>Verify Your Information</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Text>
          Please verify or complete your information below before starting the interview.
        </Text>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={candidateInfo}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="john.doe@example.com" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="(123) 456-7890" />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Start Interview
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default CandidateForm;