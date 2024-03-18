import {SetterOrUpdater} from "recoil";
import {toast} from "react-hot-toast";

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

export function CheckAccessToken(setIsLogin:SetterOrUpdater<boolean>): boolean { // 로그인 상태 전환
  const accessToken = GetCookie('accessToken');

  if (accessToken) {
    // accessToken이 있을 경우, 로그인 상태로 간주
    setIsLogin(true);
    return true;
  } else {
    // accessToken이 없을 경우, 로그아웃 상태로 간주
    setIsLogin(false);
    return false;
  }
}

export function Login(accessToken:string, refreshToken:string, setIsLogin:SetterOrUpdater<boolean>) {
  SetTokenCookie('accessToken', accessToken, 1);
  SetTokenCookie('refreshToken', refreshToken, 24 * 7);
  CheckAccessToken(setIsLogin);
}

export function oauthLogin(setIsLogin:SetterOrUpdater<boolean>) {
  CheckAccessToken(setIsLogin);
}

export async function getUserInfo(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>,
                                  setMemberId:SetterOrUpdater<string>, setNickname:SetterOrUpdater<string>, setProfileImageUrl:SetterOrUpdater<string>)
{
  const accessToken = GetCookie('accessToken');
  const response = await fetch(requestUrl+`/member/mypage`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    }
  });

  if(response.status === 401){
    const isReissue = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
    if(!isReissue) { // 토큰 재발급 실패 처리
      Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
      toast.error("재로그인이 필요합니다.")
      return;
    }
  }

  const responseData = await response.json();
  const { username, memberId, nickname, profileImageUrl } = responseData.data;

  setUsername(username);
  setMemberId(memberId);
  setNickname(nickname);
  setProfileImageUrl(profileImageUrl);
}

export async function getLoginState(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>,
                                    setMemberId:SetterOrUpdater<string>, setNickname:SetterOrUpdater<string>, setProfileImageUrl:SetterOrUpdater<string>) {
  if(!CheckAccessToken(setIsLogin)) return;
  await getUserInfo(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
}

export function Logout(setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>, setMemberId:SetterOrUpdater<string>,
                       setNickname:SetterOrUpdater<string>, setProfileImageUrl:SetterOrUpdater<string>) {
  SetTokenCookie("accessToken", "", 0);
  SetTokenCookie("refreshToken", "", 0);

  setIsLogin(false);
  setUsername("comma_username");
  setMemberId("0");
  setNickname("");
  setProfileImageUrl("comma_profileImageUrl");
}

export async function LogoutProcess(requestUrl:string, setIsLogin:SetterOrUpdater<boolean>, setUsername:SetterOrUpdater<string>,
                                    setMemberId:SetterOrUpdater<string>, setNickname:SetterOrUpdater<string>, setProfileImageUrl:SetterOrUpdater<string>) {
  const accessToken = GetCookie('accessToken');
  const response = await fetch(requestUrl + `/member/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    }
  });

  if(response.status === 401){
    const isReissue = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
    if(!isReissue) { // 토큰 재발급 실패 처리
      Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
      toast.error("재로그인이 필요합니다.")
      return;
    }
    await LogoutProcess(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
  }

  Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
  toast.success('로그아웃 되었습니다.');
}

export async function ReissueTokens(requestUrl: string, setIsLogin: SetterOrUpdater<boolean>, setUsername: SetterOrUpdater<string>,
                                    setMemberId:SetterOrUpdater<string>, setNickname:SetterOrUpdater<string>, setProfileImageUrl:SetterOrUpdater<string>) {
  const _refreshToken = GetCookie('refreshToken');

  if (!_refreshToken) {
    // refreshToken이 없을 경우, 로그아웃 상태로 간주
    Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
    return;
  }

  const response = await fetch(requestUrl + `/reissue`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"refreshToken": _refreshToken}),
  });

  if (!response.ok) {
    // 토큰 재발급 요청이 실패한 경우, 로그아웃 상태로 간주
    Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
    return false;
  }

  const responseData = await response.json();
  const {accessToken, refreshToken} = responseData.data;

  // 재로그인 (토큰 및 정보 재할당)
  Login(accessToken, refreshToken, setIsLogin);
  return true;
}

