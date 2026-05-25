import api from './api';

export async function saveOrUpdateSurvey(surveyData) {
    try {
        const response = await api.post('/api/surveys', surveyData);
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            '문진 저장 중 오류가 발생했습니다.';

        throw new Error(message);
    }
}