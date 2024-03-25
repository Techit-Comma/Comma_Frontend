'use client'

import './globals.css'
import { Figtree } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import { Player } from '@/components/Player'
import {useRecoilState} from "recoil";
import React, {useEffect} from "react";
import {loginState, userInfoState} from "@/providers/RecoilContextProvider";
import {UserInfos} from "@/types";
import {CheckAccessToken, getLoginState} from "@/libs/auth";

const font = Figtree({ subsets: ['latin'] })

export default function Base({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);

  useEffect(() => {
    const getUserInfo = async () => {
      const userLoginState = await getLoginState();

      setIsLogin(await CheckAccessToken());

      if (userLoginState) {
        setUserInfos(userLoginState);
      }
    }

    getUserInfo();
  }, [isLogin]);

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
        <ModalProvider/>
        <Sidebar>
          {children}
        </Sidebar>
        <Player/>
      </body>
    </html>
  )
}
