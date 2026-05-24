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
    body: JSON.stringify({
      documentIds,
    }),
  });
}

export async function analyzeDocumentsTogether(documentIds) {
  return apiFetch("/api/gemini/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentIds,
    }),
  });
}

export async function updateUserLanguageAPI(langCode) {
  const formattedLang = langCode.toUpperCase(); // 'ko' -> 'KO'

  return apiFetch("/api/user/language", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: formattedLang,
    }),
  });
}

export async function uploadAndAnalyzeDocumentsTogether(files) {
  const uploadUrlResult = await requestUploadUrls(files);

  const uploadInfos = uploadUrlResult.files || uploadUrlResult;

  await uploadFilesToS3(files, uploadInfos);

  const documentIds = uploadInfos.map((info) => info.documentId);

  await completeUploads(documentIds);

  const analysisResult = await analyzeDocumentsTogether(documentIds);

  return {
    documentIds,
    analysisResult,
  };
}