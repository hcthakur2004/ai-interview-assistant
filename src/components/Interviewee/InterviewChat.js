import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Input, Button, Typography, Progress, List, Avatar, Space } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

// Redux actions
import { 
  setTimeRemaining, 
  submitAnswer, 
  nextQuestion,
  completeInterview 
} from '../../redux/slices/interviewSlice';
import { addCandidate } from '../../redux/slices/candidatesSlice';
import { evaluateAnswers } from '../../utils/interviewUtils';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const InterviewChat = ({ onComplete }) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const dispatch = useDispatch();
  const { 
    questions, 
    currentQuestion, 
    timeRemaining, 
    answers,
    candidateInfo,
    isActive 
  } = useSelector((state) => state.interview);
  
  // Initialize chat with welcome message
  useEffect(() => {
    if (isActive && questions.length > 0 && messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          content: `Hello ${candidateInfo.name}! Welcome to your AI interview for a React/Node.js role. I'll ask you 6 questions of varying difficulty. You'll have limited time for each question, shown by the timer above. Let's begin with the first question.`,
          time: new Date().toISOString(),
        },
        {
          sender: 'ai',
          content: questions[0].text,
          time: new Date().toISOString(),
        }
      ]);
    }
  }, [isActive, questions, messages.length, candidateInfo.name]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      // Time's up for current question
      handleTimeUp();
    }
    
    return () => clearInterval(timer);
  }, [timeRemaining, isActive, dispatch]);
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle time up
  const handleTimeUp = () => {
    // Auto-submit current answer
    handleSubmit(true);
  };
  
  // Handle submit answer
  const handleSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      // Add user message to chat
      const answerText = currentAnswer.trim() || 'No answer provided';
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'user',
          content: answerText,
          time: new Date().toISOString(),
        }
      ]);
      
      // Save answer to Redux
      dispatch(submitAnswer(answerText));
      
      // Clear input
      setCurrentAnswer('');
      
      // Check if this was the last question
      if (currentQuestion === questions.length - 1) {
        // Add final message
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            content: 'Thank you for completing the interview! I\'m now evaluating your answers...',
            time: new Date().toISOString(),
          }
        ]);
        
        // Evaluate answers and complete interview
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = answerText;
        
        const evaluation = evaluateAnswers(questions, updatedAnswers);
        
        // Add candidate to list
        dispatch(addCandidate({
          candidateInfo,
          questions,
          answers: updatedAnswers,
          score: evaluation.score,
          summary: evaluation.summary,
          evaluations: evaluation.evaluations,
          messages: [...messages, { sender: 'user', content: answerText, time: new Date().toISOString() }]
        }));
        
        // Complete interview
        dispatch(completeInterview({
          score: evaluation.score,
          summary: evaluation.summary,
        }));
        
        // Move to results page
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Move to next question
        dispatch(nextQuestion());
        
        // Add AI message with next question
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            content: questions[currentQuestion + 1].text,
            time: new Date().toISOString(),
          }
        ]);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get difficulty label and color
  const getDifficultyInfo = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { label: 'Easy', color: 'green' };
      case 'medium':
        return { label: 'Medium', color: 'orange' };
      case 'hard':
        return { label: 'Hard', color: 'red' };
      default:
        return { label: 'Unknown', color: 'gray' };
    }
  };
  
  // Calculate progress percentage
  const getProgressPercent = () => {
    if (!questions.length) return 0;
    const currentQuestionObj = questions[currentQuestion];
    return Math.round((timeRemaining / currentQuestionObj.timeLimit) * 100);
  };
  
  // Get progress status
  const getProgressStatus = () => {
    const percent = getProgressPercent();
    if (percent <= 25) return 'exception';
    if (percent <= 50) return 'warning';
    return 'success';
  };
  
  // Current question info
  const currentQuestionObj = questions[currentQuestion] || {};
  const { label: difficultyLabel, color: difficultyColor } = getDifficultyInfo(currentQuestionObj.difficulty);
  
  return (
    <div style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      {/* Question info and timer */}
      <div style={{ marginBottom: '1rem' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <Text style={{ color: difficultyColor }} strong>
              Difficulty: {difficultyLabel}
            </Text>
          </div>
          
          <div>
            <Text>Time Remaining: {timeRemaining} seconds</Text>
            <Progress 
              percent={getProgressPercent()} 
              status={getProgressStatus()} 
              showInfo={false} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        </Space>
      </div>
      
      {/* Chat messages */}
      <Card 
        style={{ 
          flex: 1, 
          overflow: 'auto',
          marginBottom: '1rem',
          background: '#f5f5f5'
        }}
        bodyStyle={{ padding: '12px' }}
      >
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ padding: '8px 0' }}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={message.sender === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                    style={{ 
                      backgroundColor: message.sender === 'ai' ? '#1890ff' : '#52c41a'
                    }}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{message.sender === 'ai' ? 'AI Interviewer' : 'You'}</Text>
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
        <div ref={messagesEndRef} />
      </Card>
      
      {/* Answer input */}
      <div>
        <TextArea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          disabled={submitting}
        />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={() => handleSubmit()}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;