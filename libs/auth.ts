import {SetterOrUpdater} from "recoil";
import {toast} from "react-hot-toast";

export async function LogoutProcess(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
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
    const isReissue = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId);
    if(isReissue) {
      await LogoutProcess(requestUrl, setIsLogin, setUsername, setMemberId);
    } else {
      // 토큰 재발급 실패 처리
      Logout(setIsLogin, setUsername, setMemberId);
      toast.error("재로그인이 필요합니다.")
      return;
    }
  } else {
    Logout(setIsLogin, setUsername, setMemberId);
    toast.success('로그아웃 되었습니다.');
  }
}

export function GetCookie(name: string): string | undefined { // 쿠키에서 Token 값 가져오기
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function CheckAccessToken(setIsLogin:SetterOrUpdater<boolean>): void { // 로그인 상태 전환
  const accessToken = GetCookie('accessToken');

  if (accessToken) {
    // accessToken이 있을 경우, 로그인 상태로 간주
    setIsLogin(true);
  } else {
    // accessToken이 없을 경우, 로그아웃 상태로 간주
    setIsLogin(false);
  }
}

export function Login(username:string, memberId:string, accessToken:string, refreshToken:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
  SetTokenCookie('accessToken', accessToken, 1);
  SetTokenCookie('refreshToken', refreshToken, 24 * 7);
  setUserInfo(username, memberId, setUsername, setMemberId)

  CheckAccessToken(setIsLogin);
}

export function oauthLogin(username:string, memberId:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
  setUserInfo(username, memberId, setUsername, setMemberId)
  CheckAccessToken(setIsLogin);
}

function setUserInfo(username:string, memberId:string, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
  localStorage.setItem('username', username);
  localStorage.setItem('memberId', memberId);
  setUsername(username);
  setMemberId(memberId);
}

export function getLoginState(setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
  CheckAccessToken(setIsLogin);

  const username = localStorage.getItem('username');
  const memberId = localStorage.getItem('memberId');

  if (username && memberId) {
    setUsername(username);
    setMemberId(memberId);
    return true;
  }

  return false;
}

export function Logout(setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
  SetTokenCookie("accessToken", "", 0);
  SetTokenCookie("refreshToken", "", 0);
  localStorage.removeItem("memberId");
  localStorage.removeItem("username")
  setUsername("프로필");
  setMemberId("0");

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

export async function ReissueTokens(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>) {
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
    await LogoutProcess(requestUrl, setIsLogin, setUsername, setMemberId);
    return false;
  }

  const responseData = await response.json();
  const { username, memberId, accessToken, refreshToken } = responseData.data;

  // 재로그인 (토큰 및 정보 재할당)
  Login(username, memberId, accessToken, refreshToken, setIsLogin, setUsername, setMemberId);
  return true;
}
