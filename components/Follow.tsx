'use client'

import {useRecoilState} from "recoil";
import {
    baseUrl,
    memberIdState,
    loginState,
    usernameState,
    nicknameState,
    profileImageUrlState
} from "@/store/store";
import React, {useEffect, useState} from "react";
import {
    GetCookie,
    getLoginState,
    Logout,
    LogoutProcess,
    oauthLogin,
    ReissueTokens
} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import MediaItem from "@/components/MediaItem";

interface FollowItem {
    memberId: number;
    username: string;
}

const Follow = () => {

    const router = useRouter();
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(usernameState);
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [profileImageUrl, setProfileImageUrl] = useRecoilState(profileImageUrlState);

    const [followList, setFollowList] = useState<FollowItem[]>();

    async function getFollowList(accessToken:string, retryCount= 0) { // retry도 공통 함수화 ㄱㄱ
        const response = await fetch(requestUrl + `/follow`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            }
        });

        if(response.status === 401){
            const accessToken = await ReissueTokens(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
            if(!accessToken || retryCount >= 3) {
                Logout(setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
                toast.error("재로그인이 필요합니다.")
                return;
            }
            await getFollowList(accessToken, retryCount + 1);
        }

        const responseData = await response.json();
        setFollowList(responseData.data);
    }

    useEffect(() => {
        getLoginState(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);

        if (isLogin) {
            getFollowList(GetCookie('accessToken'));
        }
    }, [isLogin]); // 의존성 배열에 isLogin 추가

    return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
            <div className="inline-flex items-center gap-x-2">
                <p className='text-neutral-400 font-medium text-md'>Follow List</p>
            </div>
        </div>
        <div className='flex flex-col gap-y-2 mt-4 px-3'>
            {isLogin ? (
                <div>
                    {followList?.map((item) => (
                        <div onClick={() => router.push(`/member/${item.memberId}`)} className="hover:opacity-75 cursor-pointer">
                            <a className="ml-3 text-sm text-neutral-400">{item.username}</a>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p className="ml-3 text-sm text-neutral-400">로그인 후 이용하실 수 있습니다.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Follow