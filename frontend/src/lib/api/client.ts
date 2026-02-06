/**
 * Axios API 클라이언트
 * - 토큰 자동 추가
 * - 401 에러 시 자동 토큰 갱신
 * - 갱신 중 요청 큐 관리
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// 대기 중인 요청 처리
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 토큰 가져오기 (클라이언트 사이드)
const getTokens = () => {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };

  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return {
        accessToken: state?.accessToken || null,
        refreshToken: state?.refreshToken || null,
      };
    }
  } catch {
    // 파싱 실패 시 무시
  }
  return { accessToken: null, refreshToken: null };
};

// 토큰 저장
const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;

  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      parsed.state.accessToken = accessToken;
      parsed.state.refreshToken = refreshToken;
      localStorage.setItem("auth-storage", JSON.stringify(parsed));
    }
  } catch {
    // 저장 실패 시 무시
  }
};

// 로그아웃 처리
const handleLogout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth-storage");
  window.location.href = "/login";
};

// Request 인터셉터: Access Token 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getTokens();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 401 에러 시 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러가 아니거나 이미 재시도한 경우
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // refresh 엔드포인트 자체가 실패한 경우 로그아웃
    if (originalRequest.url?.includes("/auth/refresh")) {
      handleLogout();
      return Promise.reject(error);
    }

    // 이미 갱신 중인 경우 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject: (err: Error) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken } = getTokens();

    if (!refreshToken) {
      isRefreshing = false;
      handleLogout();
      return Promise.reject(error);
    }

    try {
      // 토큰 갱신 요청 (인터셉터 우회를 위해 axios 직접 사용)
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token } = response.data;

      // 새 토큰 저장
      setTokens(access_token, refresh_token);

      // 대기 중인 요청 처리
      processQueue(null, access_token);

      // 원래 요청 재시도
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      // 갱신 실패 시 로그아웃
      processQueue(refreshError as Error, null);
      handleLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
