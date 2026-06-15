const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || data.isSuccess === false) {
    throw new Error(data.message || "API 요청 실패");
  }

  // 백엔드 응답 규격이 { isSuccess, message, result: {...} } 형태이므로 result만 반환
  return data.result;
}

export async function requestUploadUrls(files, documentType = "OTHER") {
  return apiFetch("/api/documents/upload-urls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: files.map((file) => ({
        fileName: file.name,
        contentType: file.type || "application/pdf",
        documentType,
      })),
    }),
  });
}

export async function uploadFilesToS3(files, uploadInfos) {
  await Promise.all(
      files.map(async (file, index) => {
        const uploadInfo = uploadInfos[index];

        const response = await fetch(uploadInfo.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/pdf",
          },
          body: file,
        });

        if (!response.ok) {
          throw new Error(`${file.name} S3 업로드 실패`);
        }
      })
  );
}

export async function completeUploads(documentIds) {
  return apiFetch("/api/documents/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}

// 1. OCR 요청
export async function requestOCR(documentIds) {
  return apiFetch("/api/documents/ocr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}

// 2. 교차 검증 요청
export async function requestCrossCheck(documentIds) {
  return apiFetch("/api/gemini/cross-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}

// 3. 리뷰 데이터 조회 (USER_REVIEW_REQUIRED 상태일 때)
export async function getReviewData(analysisId) {
  return apiFetch(`/api/gemini/${analysisId}/review`, {
    method: "GET",
  });
}

// 4. 리뷰 결과 제출 (사용자 확인/수정 후)
export async function submitReviewData(analysisId, documentGroups) {
  return apiFetch(`/api/gemini/${analysisId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentGroups }),
  });
}

// 5. 최종 분석 요청 (READY_FOR_ANALYSIS 거나 리뷰 완료 후)
export async function analyzeDocumentFinal(analysisId) {
  return apiFetch(`/api/gemini/${analysisId}/analyze`, {
    method: "POST",
  });
}

// 6. [NEW] 최종 분석 결과 조회 (GET)
export async function getAnalysisResult(analysisId) {
  return apiFetch(`/api/analyses/${analysisId}`, {
    method: "GET",
  });
}

// [흐름 제어용 유틸] 업로드 ~ OCR ~ 교차검증까지 한 번에 진행
export async function processDocumentsUpToCrossCheck(files) {
  const uploadUrlResult = await requestUploadUrls(files);
  const uploadInfos = uploadUrlResult.files || uploadUrlResult;
  await uploadFilesToS3(files, uploadInfos);
  const documentIds = uploadInfos.map((info) => info.documentId);
  await completeUploads(documentIds);

  await requestOCR(documentIds);

  const crossCheckResult = await requestCrossCheck(documentIds);

  return {
    documentIds,
    analysisId: crossCheckResult.analysisId,
    status: crossCheckResult.status,
    autoAnalysisAvailable: crossCheckResult.autoAnalysisAvailable,
  };
}

// 기타 기존 API들 유지
export async function updateUserLanguageAPI(langCode) {
  const formattedLang = langCode.toUpperCase();
  return apiFetch("/api/user/language", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language: formattedLang }),
  });
}

export async function getUploadedDocuments() {
  return apiFetch("/api/documents", { method: "GET" });
}

export async function deleteDocuments(documentIds) {
  return apiFetch("/api/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentIds }),
  });
}