import {SetterOrUpdater} from "recoil";
import {toast} from "react-hot-toast";

export function GetCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function CheckAccessToken(setIsLogin:SetterOrUpdater<boolean>): void {
  const accessToken = GetCookie('accessToken');

  if (accessToken) {
    // accessToken이 있을 경우, 로그인 상태로 간주
    setIsLogin(true);
  } else {
    // accessToken이 없을 경우, 로그아웃 상태로 간주
    setIsLogin(false);
  }
}

export async function LogoutProcess(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>) {
  const accessToken = GetCookie('accessToken');
  const response = await fetch(requestUrl+`/member/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    }
  });

  if(!response.ok){
    const isReissue = await ReissueTokens(requestUrl, setIsLogin);
    if(isReissue) {
      LogoutProcess(requestUrl, setIsLogin);
    } else {
      // 토큰 재발급 실패 처리
      Logout(setIsLogin);
      toast.error("재로그인이 필요합니다.")
      return;
    }
  } else {
    Logout(setIsLogin);
    toast.success('로그아웃 되었습니다.');
  }
}

export function Login(username:string, memberId:string, accessToken:string, refreshToken:string, setIsLogin:SetterOrUpdater<boolean>) {
  SetTokenCookie('accessToken', accessToken, 1);
  SetTokenCookie('refreshToken', refreshToken, 24 * 7);
  localStorage.setItem('username', username);
  localStorage.setItem('memberId', memberId);

  CheckAccessToken(setIsLogin);
}

export function Logout(setIsLogin:SetterOrUpdater<boolean>) {
  SetTokenCookie('accessToken', '', 0);
  SetTokenCookie('refreshToken', '', 0);
  localStorage.removeItem("memberId");
  localStorage.removeItem("username")

  CheckAccessToken(setIsLogin);
}

export function SetTokenCookie(name: string, value: string, hours: number): void {
  let expires = "";
  if (hours) {
    let date = new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/; Secure";
}

export async function ReissueTokens(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>) {
  const _refreshToken = GetCookie('refreshToken');

  if (!_refreshToken) {
    // refreshToken이 없을 경우, 로그아웃 상태로 간주
    setIsLogin(false);
    return;
  }

  const response = await fetch(requestUrl+`/reissue`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "refreshToken":_refreshToken }),
  });

  if (!response.ok) {
    // 토큰 재발급 요청이 실패한 경우, 로그아웃 상태로 간주
    setIsLogin(false);
    await LogoutProcess(requestUrl, setIsLogin);
    return false;
  }

  const responseData = await response.json();
  const { username, memberId, accessToken, refreshToken } = responseData.data;

  // 재로그인 (토큰 및 정보 재할당)
  Login(username, memberId, accessToken, refreshToken, setIsLogin);
  return true;
}
