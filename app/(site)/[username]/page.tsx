'use client'

import Header from "@/components/Header";
import UserProfile from "./components/UserProfile";
import Navigator from "./components/Navigator";
import {FaPlus} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import PageContent from "@/app/(site)/components/PageContent";
import axiosClient from "@/libs/axiosClient";
import {AlbumData} from "@/types";

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const router = useRouter();
  const username = params.username;

  const [artistAlbums, setArtistAlbums] = useState<AlbumData[]>([]);

  async function getArtistAlbums() {
    try {
      const response = await axiosClient.get(`/album/${username}`)
      const responseData = await response.data.data.content;
      setArtistAlbums(responseData);
    } catch (error) {
      console.error('정보를 불러오지 못했습니다.', error);
    }
  }

  useEffect(() => {
    getArtistAlbums();
  }, []);
  
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator tabValue="홈" username={username} />
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">{username} 님의 곡</h1>
        </div>
        <div>
          <PageContent albums={artistAlbums}/>
        </div>
      </div>
      <div className="absolute bottom-8 right-10">
        <button className='transition rounded-full flex items-center bg-blue-500 p-4' onClick={() => router.push("/album/release")}>
          <FaPlus className='text-black'/>
        </button>
      </div>
    </div>
  );
}
