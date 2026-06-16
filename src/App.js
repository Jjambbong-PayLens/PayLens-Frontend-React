import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import MainLayout from "./components/MainLayout";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import PricePage from "./pages/PricePage";
import ExplainPage from "./pages/ExplainPage";
import DashboardPage from "./pages/DashboardPage";
import AnalysisPage from "./pages/AnalysisPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
import ReviewPage from "./pages/ReviewPage";
import MyPage from "./pages/MyPage";
import PreAnalysisPage from "./pages/PreAnalysisPage";
import Notice from "./pages/NoticePage";
import NoticeDetailPage from './pages/NoticeDetailPage';
import Glossary from "./pages/GlossaryPage";

import "./i18n";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/pricing" element={<PricePage />} />
                <Route path="/explain" element={<ExplainPage />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/notice/:noticeId" element={<NoticeDetailPage />} />
                <Route path="/glossary" element={<Glossary />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/oauth2/code/kakao" element={<LoginPage />} />
            <Route path="/login/oauth2/code/google" element={<LoginPage />} />

            <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/loading" element={<LoadingPage />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/result/:analysisId" element={<ResultPage />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/review/:analysisId" element={<ReviewPage />} />

                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/preanalysis" element={<PreAnalysisPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;