import {loginState, baseUrl} from "@/store/store";
import {SetterOrUpdater, useRecoilState} from "recoil";

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

export async function logout() {
  await fetch(baseUrl+`/member/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  SetTokenCookie('accessToken', '', 0);
  SetTokenCookie('refreshToken', '', 0);
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

export async function ReissueTokens() {
  const _refreshToken = GetCookie('refreshToken');
  const [isLogin, setIsLogin] = useRecoilState(loginState)

  if (!_refreshToken) {
    // refreshToken이 없을 경우, 로그아웃 상태로 간주
    setIsLogin(false);
    return;
  }

  const response = await fetch(baseUrl+`/reissue`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ _refreshToken }),
  });

  if (!response.ok) {
    // 토큰 재발급 요청이 실패한 경우, 로그아웃 상태로 간주
    setIsLogin(false);
    return;
  }

  const responseData = await response.json();
  const { accessToken, refreshToken } = responseData.data;

  // 새로 발급받은 토큰을 쿠키에 저장
  SetTokenCookie('accessToken', accessToken, 1);
  SetTokenCookie('refreshToken', refreshToken, 24 * 7);

  // 로그인 상태로 간주
  setIsLogin(true);
}
