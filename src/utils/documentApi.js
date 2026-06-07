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

export async function processDocumentsOCR(documentIds) {
  return apiFetch("/api/documents/ocr", {
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
  const formattedLang = langCode.toUpperCase();

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

export async function getUploadedDocuments() {
  return apiFetch("/api/documents", {
    method: "GET"
  });
}

export async function deleteDocuments(documentIds) {
  return apiFetch("/api/documents", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      documentIds: documentIds,
    }),
  });
}

export async function uploadAndAnalyzeDocumentsTogether(files) {
  const uploadUrlResult = await requestUploadUrls(files);
  const uploadInfos = uploadUrlResult.files || uploadUrlResult;

  await uploadFilesToS3(files, uploadInfos);

  const documentIds = uploadInfos.map((info) => info.documentId);

  await completeUploads(documentIds);

  let ocrResult = null;
  try {
    ocrResult = await processDocumentsOCR(documentIds);
    console.log("📡 [OCR 가동 완료 상태]:", ocrResult);
  } catch (ocrError) {
    console.warn("⚠️ OCR 단계에서 에러가 발생했으나 파이프라인을 유지합니다.", ocrError);
  }

  let analysisResult = null;
  try {
    console.log("🧠 제미나이 종합 리스크 분석 API 호출 시도...");
    const rawResult = await analyzeDocumentsTogether(documentIds);
    
    if (typeof rawResult === 'string') {
      console.log("⚠️ 제미나이 응답이 String 텍스트 타입으로 감지되어 JSON 강제 파싱을 시도합니다.");
      
      let cleanJson = rawResult.trim();
      
      cleanJson = cleanJson.replace(/^```json\s*/i, "");
      cleanJson = cleanJson.replace(/```\s*$/, "");
      cleanJson = cleanJson.trim();
      
      try {
        analysisResult = JSON.parse(cleanJson);
        console.log("🧠 [정제 및 파싱 성공!!!]:", analysisResult);
      } catch (parseInnerError) {
        console.error("❌ 정제 후 JSON.parse 자체 실패 (특수문자 혹은 포맷 문제):", parseInnerError);
        analysisResult = null; 
      }
    } else {
      analysisResult = rawResult;
    }
  } catch (geminiError) {
    console.error("❌ Gemini 분석 파이프라인 치명적 예외 제어 (로그인 튕김 방지):", geminiError);
    analysisResult = null;
  }

  return {
    documentIds: documentIds || [8],
    analysisResult: analysisResult,
    ocrDocuments: ocrResult?.documents || [],
  };
}