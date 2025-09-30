import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Table, Input, Select, Row, Col, Typography, Button, Space, Tag } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

// Components
import CandidateDetails from '../components/Interviewer/CandidateDetails';

// Redux actions
import { setSearchTerm, setSortBy, setSortOrder } from '../redux/slices/candidatesSlice';

const { Title } = Typography;
const { Option } = Select;

const Interviewer = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const dispatch = useDispatch();
  const { list, searchTerm, sortBy, sortOrder } = useSelector((state) => state.candidates);
  
  // Handle search
  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  
  // Handle sort
  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };
  
  const handleSortOrderChange = () => {
    dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
  };
  
  // Filter and sort candidates
  const filteredCandidates = list.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.candidateInfo.name.toLowerCase().includes(searchLower) ||
      candidate.candidateInfo.email.toLowerCase().includes(searchLower)
    );
  });
  
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'score':
        comparison = a.score - b.score;
        break;
      case 'name':
        comparison = a.candidateInfo.name.localeCompare(b.candidateInfo.name);
        break;
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      default:
        comparison = a.score - b.score;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: ['candidateInfo', 'name'],
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: ['candidateInfo', 'email'],
      key: 'email',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => {
        let color = 'red';
        if (score >= 70) color = 'green';
        else if (score >= 50) color = 'orange';
        
        return <Tag color={color}>{score}%</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => setSelectedCandidate(record)}>
          View Details
        </Button>
      ),
    },
  ];
  
  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        AI Interview Assistant - Recruiter Dashboard
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={selectedCandidate ? 12 : 24}>
          <Card title="Candidates">
            <Space style={{ marginBottom: '1rem' }}>
              <Input
                placeholder="Search candidates"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={handleSearch}
                style={{ width: 200 }}
              />
              <Select
                defaultValue="score"
                value={sortBy}
                onChange={handleSortChange}
                style={{ width: 120 }}
              >
                <Option value="score">Score</Option>
                <Option value="name">Name</Option>
                <Option value="date">Date</Option>
              </Select>
              <Button 
                icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                onClick={handleSortOrderChange}
              />
            </Space>
            
            <Table
              columns={columns}
              dataSource={sortedCandidates}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onClick: () => setSelectedCandidate(record),
              })}
            />
          </Card>
        </Col>
        
        {selectedCandidate && (
          <Col xs={24} lg={12}>
            <CandidateDetails 
              candidate={selectedCandidate} 
              onClose={() => setSelectedCandidate(null)} 
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Interviewer;