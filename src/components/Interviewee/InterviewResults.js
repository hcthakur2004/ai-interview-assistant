import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Typography, Result, Button, Progress, Descriptions, List } from 'antd';
import { CheckCircleOutlined, HomeOutlined, RedoOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Redux actions
import { resetInterview } from '../../redux/slices/interviewSlice';

const { Title, Text, Paragraph } = Typography;

const InterviewResults = () => {
  const dispatch = useDispatch();
  const { score, summary, questions, answers } = useSelector((state) => state.interview);
  
  const handleReset = () => {
    dispatch(resetInterview());
  };
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 70) return '#52c41a';
    if (score >= 50) return '#faad14';
    return '#f5222d';
  };
  
  return (
    <div style={{ padding: '1rem' }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="Interview Completed!"
        subTitle="Thank you for completing the AI interview. Here are your results."
      />
      
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Progress
            type="circle"
            percent={score}
            format={(percent) => `${percent}%`}
            width={120}
            strokeColor={getScoreColor(score)}
          />
          <Title level={4} style={{ marginTop: '1rem' }}>Your Score</Title>
        </div>
        
        <Paragraph style={{ fontSize: '16px', marginBottom: '2rem' }}>
          <Text strong>AI Summary:</Text>
          <br />
          {summary}
        </Paragraph>
        
        <Title level={4}>Question Breakdown</Title>
        <List
          itemLayout="horizontal"
          dataSource={questions.map((q, index) => ({ ...q, answer: answers[index] || 'No answer provided' }))}
          renderItem={(item, index) => (
            <List.Item>
              <Card 
                title={`Question ${index + 1}: ${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}`}
                style={{ width: '100%' }}
                size="small"
              >
                <Descriptions column={1}>
                  <Descriptions.Item label="Question">{item.text}</Descriptions.Item>
                  <Descriptions.Item label="Your Answer">{item.answer}</Descriptions.Item>
                </Descriptions>
              </Card>
            </List.Item>
          )}
        />
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button type="primary" icon={<HomeOutlined />}>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button icon={<RedoOutlined />} onClick={handleReset}>
          Start New Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewResults;