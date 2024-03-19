'use client'

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation"
import React, { useEffect } from "react";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";
import {ListItemButton, ListItemText} from "@mui/material";
import {LogoutProcess} from "@/libs/auth";
import {useRecoilState} from "recoil";
import {
    baseUrl,
    loginState,
    memberIdState,
    nicknameState,
    profileImageUrlState,
    usernameState
} from "@/store/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faGears, faLock} from "@fortawesome/free-solid-svg-icons";

const AccountContent = () => {
    const router = useRouter();
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(usernameState);
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [profileImageUrl, setProfileImageUrl] = useRecoilState(profileImageUrlState);
    const { isLoading, subscription, user } = useUser()

    //only for signed in users
    useEffect(()=>{
        if(!isLoading && !user){
            router.replace('/')
        }
    },[isLoading,user,router])

    const handleLogout =  async () => {
        await LogoutProcess(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
        router.push("/");
    }

    return (
        <div className="mb-7 px-6">
            <div className="flex flex-col gap-y-4 bg-neutral-800 rounded-xl">
                <h1 className='text-white text-xl font-semibold m-5 mb-2.5'>보안 및 개인정보 보호</h1>
                <ListItemButton component="a" href="#simple-list" className="mx-3 font-semibold">
                    <FontAwesomeIcon icon={faGears} className="mr-3" size="lg"/><ListItemText primary="개인정보 설정"/>
                </ListItemButton>
                <ListItemButton component="a" href="#simple-list" className="mx-3 font-semibold">
                    <FontAwesomeIcon icon={faLock} className="mr-3" size="lg"/><ListItemText primary="비밀번호 변경하기" />
                </ListItemButton>
                <ListItemButton component="a" onClick={handleLogout} className="mx-3 mb-5 font-semibold">
                    <FontAwesomeIcon icon={faDoorOpen} className="mr-3" size="lg" /><ListItemText primary="로그아웃" />
                </ListItemButton>
            </div>
        </div>
    )
}

export default AccountContent