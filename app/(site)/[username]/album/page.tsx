"use client"

import Header from "@/components/Header";
import UserProfile from "../components/UserProfile";
import Navigator from "../components/Navigator";
import { useRecoilState } from "recoil";
import {AlbumData, UserInfos} from "@/types";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import { Divider } from "@mui/material";
import AlbumContent from "@/app/(site)/[username]/album/components/AlbumContent";
import axiosClient from "@/libs/axiosClient";
import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";

export default function Album({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  const router = useRouter();
  const [myAlbums, setMyAlbums] = useState<AlbumData[]>();
  const [isLogin, setIsLogin] = useRecoilState(loginState);

  const [isLoading, setIsLoading] = useState(true);
  async function getMyAlbums() {
    try {
      const response = await axiosClient.get(`/album/myAlbum`)
      const responseData = await response.data.data;
      setMyAlbums(responseData);
    } catch (error) {
      console.error('정보를 불러오지 못했습니다.', error);
    }
  }


  useEffect(() => {
    // 로그인 상태 확인 로직
    CheckAccessToken().then((loggedIn) => {
      setIsLogin(loggedIn);
      setIsLoading(false); // 로그인 상태 확인이 완료됨
    });
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogin) {
      toast.error("접근이 불가합니다.")
      router.replace('/');
    }

    getMyAlbums();
  }, [isLoading, router]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator username={username} tabValue="앨범" />
        </div>
      </Header>
      <Divider variant="middle" />
      <AlbumContent albums={myAlbums || []}/>
      <div className="absolute bottom-8 right-10">
        <button className='transition rounded-full flex items-center bg-blue-500 p-4' onClick={() => router.push("/album/release")}>
          <FaPlus className='text-black'/>
        </button>
      </div>
    </div>
  );
}
