import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import LoadingPage from './pages/LoadingPage';
import ResultPage from './pages/ResultPage';
import PaymentPage from './pages/PaymentPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/oauth2/code/kakao" element={<LoginPage />} />
      <Route path="/login/oauth2/code/google" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
