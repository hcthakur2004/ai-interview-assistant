import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Typography } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="home-container" style={{ padding: '2rem' }}>
      <Row justify="center" style={{ marginBottom: '2rem' }}>
        <Col>
          <Title level={1}>AI Interview Assistant</Title>
          <Paragraph style={{ fontSize: '1.2rem', textAlign: 'center' }}>
            Streamline your interview process with our AI-powered assistant
          </Paragraph>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            cover={<div style={{ 
              height: '200px', 
              background: '#1890ff', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <UserOutlined style={{ fontSize: '5rem', color: 'white' }} />
            </div>}
          >
            <div>
              <Title level={3}>Candidate</Title>
              <Paragraph>
                Upload your resume and take an AI-powered interview to showcase your skills.
                Get instant feedback and improve your chances of landing your dream job.
              </Paragraph>
            </div>

            <Button type="primary" size="large" block style={{ marginTop: '1rem' }}>
              <Link to="/interviewee">Start Interview</Link>
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={10} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            cover={<div style={{ 
              height: '200px', 
              background: '#52c41a', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <TeamOutlined style={{ fontSize: '5rem', color: 'white' }} />
            </div>}
          >
            <div>
              <Title level={3}>Recruiter</Title>
              <Paragraph>
                Review candidate interviews, analyze AI-generated summaries, and make
                data-driven hiring decisions with our comprehensive dashboard.
              </Paragraph>
            </div>

            <Button type="primary" size="large" block style={{ background: '#52c41a', borderColor: '#52c41a', marginTop: '1rem' }}>
              <Link to="/interviewer">View Dashboard</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;