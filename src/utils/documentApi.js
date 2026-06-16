const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

async function parseResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("응답 JSON 파싱 실패:", error);
    return text;
  }
}

async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    console.error("API 실패:", {
      path,
      status: response.status,
      data,
    });

    const message =
        data?.message ||
        data?.error ||
        `API 요청 실패: ${response.status}`;

    throw new Error(message);
  }

  if (data?.isSuccess === false) {
    throw new Error(data?.message || "API 요청 실패");
  }

  if (data && typeof data === "object" && "result" in data) {
    return data.result;
  }

  return data;
}

function normalizeUploadInfos(uploadUrlResult) {
  if (!uploadUrlResult) return [];

  if (Array.isArray(uploadUrlResult)) {
    return uploadUrlResult;
  }

  if (Array.isArray(uploadUrlResult.files)) {
    return uploadUrlResult.files;
  }

  if (Array.isArray(uploadUrlResult.uploadInfos)) {
    return uploadUrlResult.uploadInfos;
  }

  if (Array.isArray(uploadUrlResult.uploadUrls)) {
    return uploadUrlResult.uploadUrls;
  }

  return [];
}

function normalizeReviewPayload(payloadOrDocumentGroups) {
  if (
      payloadOrDocumentGroups &&
      typeof payloadOrDocumentGroups === "object" &&
      Array.isArray(payloadOrDocumentGroups.documentGroups)
  ) {
    return payloadOrDocumentGroups;
  }

  if (Array.isArray(payloadOrDocumentGroups)) {
    return {
      documentGroups: payloadOrDocumentGroups,
    };
  }

  return {
    documentGroups: [],
  };
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
  if (!Array.isArray(uploadInfos) || uploadInfos.length === 0) {
    throw new Error("S3 업로드 URL 정보를 찾을 수 없습니다.");
  }

  if (files.length !== uploadInfos.length) {
    throw new Error("파일 개수와 업로드 URL 개수가 일치하지 않습니다.");
  }

  await Promise.all(
      files.map(async (file, index) => {
        const uploadInfo = uploadInfos[index];

        if (!uploadInfo?.uploadUrl) {
          throw new Error(`${file.name} 업로드 URL이 없습니다.`);
        }

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

export async function requestOCR(documentIds) {
  return apiFetch("/api/documents/ocr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}

export async function requestCrossCheck(documentIds) {
  return apiFetch("/api/gemini/cross-check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}

export async function getReviewData(analysisId) {
  return apiFetch(`/api/gemini/${analysisId}/review`, {
    method: "GET",
  });
}

export async function submitReviewData(analysisId, payloadOrDocumentGroups) {
  const payload = normalizeReviewPayload(payloadOrDocumentGroups);

  return apiFetch(`/api/gemini/${analysisId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function analyzeDocumentFinal(analysisId) {
  return apiFetch(`/api/gemini/${analysisId}/analyze`, {
    method: "POST",
  });
}

export async function getAnalysisResult(analysisId) {
  return apiFetch(`/api/analyses/${analysisId}`, {
    method: "GET",
  });
}

export async function processDocumentsUpToCrossCheck(files) {
  const uploadUrlResult = await requestUploadUrls(files);
  const uploadInfos = normalizeUploadInfos(uploadUrlResult);

  if (uploadInfos.length === 0) {
    throw new Error("업로드 URL 응답이 비어 있습니다.");
  }

  await uploadFilesToS3(files, uploadInfos);

  const documentIds = uploadInfos
      .map((info) => info.documentId)
      .filter((id) => id !== null && id !== undefined);

  if (documentIds.length === 0) {
    throw new Error("documentId를 찾을 수 없습니다.");
  }

  await completeUploads(documentIds);
  await requestOCR(documentIds);

  const crossCheckResult = await requestCrossCheck(documentIds);

  return {
    ...crossCheckResult,
    documentIds,
    analysisId: crossCheckResult?.analysisId,
    status: crossCheckResult?.status,
    autoAnalysisAvailable: crossCheckResult?.autoAnalysisAvailable,
    userReviewRequired: crossCheckResult?.userReviewRequired,
    recaptureRequired: crossCheckResult?.recaptureRequired,
  };
}

export async function updateUserLanguageAPI(langCode) {
  const formattedLang = langCode.toUpperCase();

  return apiFetch("/api/user/language", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language: formattedLang }),
  });
}

export async function getUploadedDocuments() {
  return apiFetch("/api/documents", {
    method: "GET",
  });
}

export async function deleteDocuments(documentIds) {
  return apiFetch("/api/documents", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ documentIds }),
  });
}
// ==========================================
// 공지사항(Notice) 관련 API 연동
// ==========================================

/**
 * 공지사항 목록 조회 (GET)
 */
export async function getNotices() {
  return apiFetch("/api/notices", {
    method: "GET",
  });
}

/**
 * 공지사항 상세 조회 (GET)
 * @param {number|string} noticeId - 조회할 공지사항 ID
 */
export async function getNoticeDetail(noticeId) {
  return apiFetch(`/api/notices/${noticeId}`, {
    method: "GET",
  });
}

/**
 * 공지사항 등록 (POST) - 관리자용
 * @param {Object} noticeData - { title, content, thumbnailUrl, category }
 */
export async function createNotice(noticeData) {
  return apiFetch("/api/notices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticeData),
  });
}

/**
 * 공지사항 수정 (PUT) - 관리자용
 * @param {number|string} noticeId - 수정할 공지사항 ID
 * @param {Object} noticeData - { title, content, thumbnailUrl, category }
 */
export async function updateNotice(noticeId, noticeData) {
  return apiFetch(`/api/notices/${noticeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticeData),
  });
}

/**
 * 공지사항 삭제 (DELETE) - 관리자용
 * @param {number|string} noticeId - 삭제할 공지사항 ID
 */
export async function deleteNotice(noticeId) {
  return apiFetch(`/api/notices/${noticeId}`, {
    method: "DELETE",
  });
}