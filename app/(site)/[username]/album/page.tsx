"use client"

import Header from "@/components/Header";
import UserProfile from "../components/UserProfile";
import Navigator from "../components/Navigator";
import { useRecoilState } from "recoil";
import {AlbumData, UserInfos} from "@/types";
import { userInfoState } from "@/providers/RecoilContextProvider";
import { Divider } from "@mui/material";
import AlbumContent from "@/app/(site)/[username]/album/components/AlbumContent";
import axiosClient from "@/libs/axiosClient";
import {useEffect, useState} from "react";

export default function Album({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;
  const [myAlbums, setMyAlbums] = useState<AlbumData[]>();
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);

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
    getMyAlbums();
  }, []);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator username={username} />
        </div>
      </Header>
      <Divider variant="middle" />

      <AlbumContent albums={myAlbums}/>
    </div>
  );
}
