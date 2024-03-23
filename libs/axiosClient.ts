import axios from 'axios';
import {GetCookie, Logout, ReissueTokens} from "@/libs/auth";
import {toast} from "react-hot-toast";

// Axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: 'http://localhost:8090',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosClient.interceptors.request.use(
    config => {
      // 요청을 보내기 전에 수행할 로직 (예: 토큰 설정)
      const token = GetCookie("accessToken")
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    },
    error => {
      // 요청 에러 처리
      return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosClient.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      // 401 에러 감지 및 originalRequest._retry
      // if (error.response.status === 401 && !originalRequest._retry) {
      //   Logout();
      //   return;
      // }

      if (error.response.status === 401 && originalRequest._retry) {
        originalRequest._retry = false; // 재요청 플래그 설정

        const accessToken = await ReissueTokens(); // 토큰 재발급
        axios.defaults.headers.common['Authorization'] = `${accessToken}`; // 새 토큰으로 헤더 설정
        originalRequest.headers['Authorization'] = `${accessToken}`; // 현재 요청에도 새 토큰 설정

        return axiosClient(originalRequest); // 요청 재실행
      }

      if (error.response) {
        const errorData = error.response.data;
        if (errorData.validMessages !== null) {
          if (errorData.validMessages.username) {
            toast.error(errorData.validMessages.username);
            return Promise.reject(error);
          }

          if (errorData.validMessages.nickname) {
            toast.error(errorData.validMessages.nickname);
            return Promise.reject(error);
          }

          if (errorData.validMessages.password) {
            toast.error(errorData.validMessages.password);
            return Promise.reject(error);
          }

          if (errorData.validMessages.newPassword) {
            toast.error(errorData.validMessages.newPassword);
            return Promise.reject(error);
          }

          if (errorData.validMessages.newPasswordCheck) {
            toast.error(errorData.validMessages.newPasswordCheck);
            return Promise.reject(error);
          }

          if (errorData.validMessages.email) {
            toast.error(errorData.validMessages.email);
            return Promise.reject(error);
          }
        }
        // 기타 에러 메시지 처리
        toast.error(errorData.message);
        return Promise.reject(error);
      } else {
        // 네트워크 에러 등 기타 에러 처리
        toast.error("네트워크 오류가 발생했습니다.");
      }

      return Promise.reject(error);
    }
);

export default axiosClient;