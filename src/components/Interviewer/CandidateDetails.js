import React, { useState } from 'react';
import { Card, Tabs, Typography, Descriptions, List, Avatar, Tag, Button } from 'antd';
import { UserOutlined, FileTextOutlined, MessageOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const CandidateDetails = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState('1');
  
  if (!candidate) return null;
  
  const { candidateInfo, score, summary, questions, answers, messages } = candidate;
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 70) return 'green';
    if (score >= 50) return 'orange';
    return 'red';
  };
  
  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Candidate Details</span>
          <Button 
            icon={<CloseOutlined />} 
            type="text" 
            onClick={onClose} 
          />
        </div>
      }
      style={{ height: '100%' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><UserOutlined /> Profile</span>}
          key="1"
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              {candidateInfo.name}
            </Title>
            <Tag color={getScoreColor(score)}>{score}% Score</Tag>
          </div>
          
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Email">{candidateInfo.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{candidateInfo.phone}</Descriptions.Item>
            <Descriptions.Item label="Interview Date">
              {new Date(candidate.date).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="AI Summary">
              <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                {summary}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        
        <TabPane 
          tab={<span><FileTextOutlined /> Answers</span>}
          key="2"
        >
          <List
            itemLayout="vertical"
            dataSource={questions.map((q, index) => ({ 
              ...q, 
              answer: answers[index] || 'No answer provided' 
            }))}
            renderItem={(item, index) => (
              <List.Item>
                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Question {index + 1}</span>
                      <Tag color={
                        item.difficulty === 'easy' ? 'green' : 
                        item.difficulty === 'medium' ? 'orange' : 'red'
                      }>
                        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                      </Tag>
                    </div>
                  }
                  style={{ marginBottom: '1rem' }}
                >
                  <Paragraph strong>{item.text}</Paragraph>
                  <Paragraph type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                    <Text strong>Answer:</Text> {item.answer}
                  </Paragraph>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        
        <TabPane 
          tab={<span><MessageOutlined /> Chat History</span>}
          key="3"
        >
          <List
            itemLayout="horizontal"
            dataSource={messages || []}
            renderItem={(message) => (
              <List.Item style={{ padding: '8px 0' }}>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={message.sender === 'ai' ? <MessageOutlined /> : <UserOutlined />}
                      style={{ 
                        backgroundColor: message.sender === 'ai' ? '#1890ff' : '#52c41a'
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{message.sender === 'ai' ? 'AI Interviewer' : 'Candidate'}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {new Date(message.time).toLocaleTimeString()}
                      </Text>
                    </div>
                  }
                  description={
                    <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                      {message.content}
                    </Paragraph>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CandidateDetails;