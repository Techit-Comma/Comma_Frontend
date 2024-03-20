'use client'

import { useRouter } from "next/navigation"
import React, {useEffect, useState} from "react";
import {ListItemButton, ListItemText} from "@mui/material";
import {CheckAccessToken, LogoutProcess} from "@/libs/auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faGears, faLock} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {loginState} from "@/store/store";

const AccountContent = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLogin) {
            toast.error("로그인 후 이용 할 수 있습니다.")
            router.replace('/');
        }
    }, [isLogin, isLoading, router]);

    const handleLogout =  async () => {
        await LogoutProcess();
        toast.success("로그아웃 되었습니다!");
        router.push("/");
    }

    return (
        <div className="mb-7 px-6">
            <div className="flex flex-col gap-y-4 bg-neutral-800 rounded-xl">
                <h1 className='text-white text-xl font-semibold m-5 mb-2.5'>보안 및 개인정보 보호</h1>
                <ListItemButton component="a" href="#simple-list" className="mx-3 font-semibold">
                    <FontAwesomeIcon icon={faGears} className="mr-3 w-8" size="lg"/><ListItemText primary="개인정보 설정"/>
                </ListItemButton>
                <ListItemButton component="a" href="#simple-list" className="mx-3 font-semibold">
                    <FontAwesomeIcon icon={faLock} className="mr-3 w-8" size="lg"/><ListItemText primary="비밀번호 변경하기" />
                </ListItemButton>
                <ListItemButton component="a" onClick={handleLogout} className="mx-3 mb-5 font-semibold">
                    <FontAwesomeIcon icon={faDoorOpen} className="mr-3 w-8" size="lg" /><ListItemText primary="로그아웃" />
                </ListItemButton>
            </div>
        </div>
    )
}

export default AccountContent