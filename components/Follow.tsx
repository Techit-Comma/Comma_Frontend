'use client'

import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import React, {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import axiosClient from "@/libs/axiosClient";

interface FollowItem {
    memberId: number;
    username: string;
}

const Follow = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState(loginState);

    const [followList, setFollowList] = useState<FollowItem[]>();

    async function getFollowList() {
        try {
            const response = await axiosClient.get('/follow')
            const responseData = await response.data.data;
            setFollowList(responseData);
        } catch (error) {
            console.error('로그아웃에 실패했습니다.', error);
        }
    }

    useEffect(() => {
        if (isLogin) {
            getFollowList();
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
                        <div key={item.memberId} onClick={() => router.push(`/member/${item.memberId}`)} className="hover:opacity-75 cursor-pointer">
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