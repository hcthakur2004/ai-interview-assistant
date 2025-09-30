import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Layout } from 'antd';

// Import pages
import Home from './pages/Home';
import Interviewee from './pages/Interviewee';
import Interviewer from './pages/Interviewer';

// Import styles
import './App.css';
// Ant Design v5 doesn't require CSS import as it uses CSS-in-JS

const { Content } = Layout;

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <Content>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/interviewee" element={<Interviewee />} />
                <Route path="/interviewer" element={<Interviewer />} />
              </Routes>
            </Content>
          </Layout>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
