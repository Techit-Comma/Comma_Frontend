import axiosClient from "@/libs/axiosClient";
import {UserInfos} from "@/types";

export function GetCookie(name: string): string | undefined { // 쿠키에서 Token 값 가져오기
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
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

export async function CheckAccessToken(): Promise<boolean> { // 로그인 상태 확인, 향후 API 보내 인증하는 형식으로 수정 필요
  const accessToken = GetCookie('accessToken');

  if (accessToken) {
    // accessToken이 있을 경우, 로그인 상태로 간주
    try {
      await axiosClient.get('/member/check');
      return true;
    } catch (error) {
      return false;
    }
  } else {
    // accessToken이 없을 경우, 로그아웃 상태로 간주
    return false;
  }
}

export function Login(accessToken:string, refreshToken:string) {
  SetTokenCookie('accessToken', accessToken, 1);
  SetTokenCookie('refreshToken', refreshToken, 24 * 7);
  return CheckAccessToken();
}

export function oauthLogin() {
  return CheckAccessToken();
}

export async function getUserInfo(): Promise<UserInfos | undefined> {
  try {
    const response = await axiosClient.get<{ data: UserInfos }>('/member/mypage');
    return response.data.data;
  } catch (error) {
    console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
    return undefined;
  }
}

export async function getLoginState(): Promise<UserInfos | undefined> {
  if (!await CheckAccessToken()) return undefined;
  return await getUserInfo();
}

export function Logout() {
  SetTokenCookie("accessToken", "", 0);
  SetTokenCookie("refreshToken", "", 0);
}

export async function LogoutProcess() {
  try {
    await axiosClient.post('/member/logout');
    Logout();
  } catch (error) {
    console.error('로그아웃에 실패했습니다.', error);
  }
}

export async function ReissueTokens() {
  const _refreshToken = GetCookie('refreshToken');

  if (!_refreshToken) {
    // refreshToken이 없을 경우, 로그아웃 상태로 간주
    Logout();
    return false;
  }
  try {
    const response = await axiosClient.post('/reissue', {
      "refreshToken": _refreshToken,
    })
    const responseData = await response.data.data;
    await Login(responseData.accessToken, responseData.refreshToken);

    return true;

  } catch (error) {
    console.error('토큰 재발급에 실패했습니다.', error);
    Logout();
    return false;
  }
}

