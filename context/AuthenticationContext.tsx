import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CheckAccessToken, getLoginState } from '@/libs/auth';
import {UserInfos} from "@/types";

interface AuthenticationContextType {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  userInfos: UserInfos | null;
  setUserInfos: (userInfos: UserInfos | null) => void;
  CheckAccessToken: () => Promise<boolean>;
  getLoginState: () => Promise<UserInfos | undefined>;
}

// 컨텍스트 생성
const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

interface AuthenticationProviderProps { // 향후 사용가능성 고려하여 남김
  children: ReactNode;
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userInfos, setUserInfos] = useState<UserInfos | null>(null);

  // 컨텍스트에 포함될 값
  const value: AuthenticationContextType = {
    isLogin,
    setIsLogin,
    userInfos,
    setUserInfos,
    CheckAccessToken, // auth.ts에서 가져온 함수
    getLoginState, // auth.ts에서 가져온 함수
  };

  return (
      <AuthenticationContext.Provider value={value}>
        {children}
      </AuthenticationContext.Provider>
  );
};


export const useAuthentication = (): AuthenticationContextType => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  return context;
}
