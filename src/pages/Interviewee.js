import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Steps, Button, Modal, Typography, message } from 'antd';
import { UploadOutlined, UserOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';

// Components
import ResumeUpload from '../components/Interviewee/ResumeUpload';
import CandidateForm from '../components/Interviewee/CandidateForm';
import InterviewChat from '../components/Interviewee/InterviewChat';
import InterviewResults from '../components/Interviewee/InterviewResults';

// Redux actions
import { resetInterview } from '../redux/slices/interviewSlice';

const { Title } = Typography;

const Interviewee = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  
  const dispatch = useDispatch();
  const interview = useSelector((state) => state.interview);
  
  // Check if there's an ongoing interview
  useEffect(() => {
    // Check if modal has been shown already in this session
    const hasShownWelcomeBack = sessionStorage.getItem('hasShownWelcomeBack');
    
    if (interview.candidateInfo.name && !interview.isComplete && !hasShownWelcomeBack) {
      setShowWelcomeBack(true);
      // Mark that we've shown the welcome back modal in this session
      sessionStorage.setItem('hasShownWelcomeBack', 'true');
    }
  }, [interview]);
  
  // Handle welcome back modal
  const handleContinue = () => {
    // Determine which step to continue from
    if (interview.questions.length > 0) {
      setCurrentStep(2); // Go to interview chat
    } else if (interview.candidateInfo.name) {
      setCurrentStep(1); // Go to candidate form
    }
    setShowWelcomeBack(false);
  };
  
  const handleStartOver = () => {
    dispatch(resetInterview());
    setCurrentStep(0);
    setShowWelcomeBack(false);
    // Clear the session storage flag when starting over
    sessionStorage.removeItem('hasShownWelcomeBack');
  };
  
  // Steps content
  const steps = [
    {
      title: 'Upload Resume',
      icon: <UploadOutlined />,
      content: <ResumeUpload onComplete={() => setCurrentStep(1)} />,
    },
    {
      title: 'Verify Info',
      icon: <UserOutlined />,
      content: <CandidateForm onComplete={() => setCurrentStep(2)} />,
    },
    {
      title: 'Interview',
      icon: <MessageOutlined />,
      content: <InterviewChat onComplete={() => setCurrentStep(3)} />,
    },
    {
      title: 'Results',
      icon: <CheckCircleOutlined />,
      content: <InterviewResults />,
    },
  ];
  
  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        AI Interview Assistant - Candidate Portal
      </Title>
      
      <Card>
        <Steps
          current={currentStep}
          items={steps.map(item => ({
            title: item.title,
            icon: item.icon,
          }))}
          style={{ marginBottom: '2rem' }}
        />
        
        <div className="steps-content">
          {steps[currentStep].content}
        </div>
      </Card>
      
      {/* Welcome Back Modal */}
      <Modal
        title="Welcome Back!"
        open={showWelcomeBack}
        onCancel={() => setShowWelcomeBack(false)}
        footer={[
          <Button key="startover" onClick={handleStartOver}>
            Start Over
          </Button>,
          <Button key="continue" type="primary" onClick={handleContinue}>
            Continue
          </Button>,
        ]}
      >
        <p>We noticed you have an unfinished interview session. Would you like to continue where you left off?</p>
      </Modal>
    </div>
  );
};

export default Interviewee;