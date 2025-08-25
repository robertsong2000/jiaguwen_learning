import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import store from './store';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LearnPage from './pages/LearnPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonDetailPage from './pages/LessonDetailPage';
import PracticePage from './pages/PracticePage';
import PracticeDetailPage from './pages/PracticeDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <div className="App min-h-screen bg-ivory">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="explore/:id" element={<ExplorePage />} />
                <Route path="learn" element={<LearnPage />} />
                <Route path="learn/course/:courseId" element={<CourseDetailPage />} />
                <Route path="learn/lesson/:lessonId" element={<LessonDetailPage />} />
                <Route path="practice" element={<PracticePage />} />
                <Route path="practice/:practiceType" element={<PracticeDetailPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
