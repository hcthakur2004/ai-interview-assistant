import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Upload, Button, message, Typography, Space, Card, Descriptions, Input } from 'antd';
import { UploadOutlined, FilePdfOutlined, FileWordOutlined, CheckCircleOutlined } from '@ant-design/icons';

// Utils
import { validateFileType, extractTextFromPDF, extractCandidateInfo } from '../../utils/fileUtils';

// Redux actions
import { setCandidateInfo, setResumeUrl } from '../../redux/slices/interviewSlice';

const { Title, Text } = Typography;

const ResumeUpload = ({ onComplete }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [localResumeUrl, setLocalResumeUrl] = useState('');
  
  const dispatch = useDispatch();
  
  const handleUpload = async () => {
    const file = fileList[0];
    if (!file) {
      message.error('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    
    try {
      // Validate file type
      if (!validateFileType(file)) {
        message.error('Only PDF and DOCX files are supported');
        setUploading(false);
        return;
      }
      
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Extract candidate information
      const candidateInfo = extractCandidateInfo(extractedText);
      
  // Save resume URL (in a real app, we would upload to a server)
  const fileUrl = URL.createObjectURL(file);
  setLocalResumeUrl(fileUrl);
      
      // Set extracted info in component state
      setExtractedInfo(candidateInfo);
      
      message.success('Resume information extracted successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      message.error('Failed to upload resume. Please try again.');
      setExtractedInfo(null);
    } finally {
      setUploading(false);
    }
  };
  
  const handleConfirm = () => {
    if (extractedInfo) {
      // Update Redux state
  dispatch(setCandidateInfo(extractedInfo));
  dispatch(setResumeUrl(localResumeUrl));
      
      // Move to next step
      onComplete();
    }
  };
  
  const props = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Title level={3}>Upload Your Resume</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Text>
          Please upload your resume to begin the interview process. 
          We'll extract your information to personalize your experience.
        </Text>
        
        {!extractedInfo ? (
          <>
            <div style={{ 
              border: '1px dashed #d9d9d9', 
              borderRadius: '4px',
              padding: '2rem',
              background: '#fafafa'
            }}>
              <Space direction="vertical" size="middle">
                <div>
                  <FilePdfOutlined style={{ fontSize: '3rem', color: '#ff4d4f' }} />
                  <FileWordOutlined style={{ fontSize: '3rem', color: '#1890ff', marginLeft: '1rem' }} />
                </div>
                
                <Upload {...props} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                
                <Text type="secondary">Supported formats: PDF (required), DOCX (optional)</Text>
              </Space>
            </div>
            
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ width: '200px' }}
            >
              {uploading ? 'Uploading' : 'Upload'}
            </Button>
          </>
        ) : (
          <Card title="Extracted Information" extra={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">
                <Input 
                  value={extractedInfo.name} 
                  onChange={(e) => setExtractedInfo({...extractedInfo, name: e.target.value})}
                  placeholder="Enter your name if not detected correctly"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Input 
                  value={extractedInfo.email} 
                  onChange={(e) => setExtractedInfo({...extractedInfo, email: e.target.value})}
                  placeholder="Enter your email if not detected correctly"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <Input 
                  value={extractedInfo.phone} 
                  onChange={(e) => setExtractedInfo({...extractedInfo, phone: e.target.value})}
                  placeholder="Enter your phone if not detected correctly"
                />
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => {
                setExtractedInfo(null);
                setFileList([]);
              }}>
                Upload Different Resume
              </Button>
              <Button type="primary" onClick={handleConfirm}>
                Confirm & Continue
              </Button>
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default ResumeUpload;