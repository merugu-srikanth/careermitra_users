export const API_BASE_URL = "https://www.careermitra.in/api";

export const API_ENDPOINTS = {
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  AUTH: `${API_BASE_URL}/auth`,
  JOBS: `${API_BASE_URL}/jobs`,
  MEDIA: `${API_BASE_URL}/media`,
};

export const isApiSuccess = (responseData) =>
  Boolean(responseData?.success ?? responseData?.status);

export const getApiMessage = (responseData, fallback = "Request failed") =>
  responseData?.message || fallback;
