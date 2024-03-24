'use client'

import Header from "@/components/Header"
import ListItem from "@/components/ListItem"
import PageContent from "./components/PageContent"
import {CheckAccessToken, getLoginState, oauthLogin} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {loginState, userInfoState} from "@/providers/RecoilContextProvider";
import {useSearchParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AlbumData, UserInfos} from "@/types";
import axiosClient from "@/libs/axiosClient";

export const revalidate = 0

export default function Home() {
  const router = useRouter()
  const [newAlbums, setNewAlbums] = useState<AlbumData[]>([]);
  const [top10Albums, setTop10Albums] = useState<AlbumData[]>([]);
  const [recommendAlbums, setRecommendAlbums] = useState<AlbumData[]>([]);

  // 페이지 및 전역 상태 관리
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);

  // Oauth 로그인 처리
  const searchParams = useSearchParams();

  useEffect(() => {
    const setOauth = async () => {
      const oauth = searchParams.get("oauth");
      if (oauth) {
        setIsLogin(await oauthLogin());
        toast.success("로그인 되었습니다.");

        router.push('/');
      }
    }
    setOauth();
  }, []);

  async function getNewAlbums() {
    try {
      const response = await axiosClient.get(`/album/list`)
      const responseData = await response.data.data.content;
      setNewAlbums(responseData);
    } catch (error) {
      console.error('앨범 목록을 가져올 수 없습니다.', error);
    }
  }

  async function getTop10Albums() {
    try {
      const response = await axiosClient.get(`/album/streamingTop10Albums`)
      const responseData = await response.data.data;
      setTop10Albums(responseData);
    } catch (error) {
      console.error('앨범 목록을 가져올 수 없습니다.', error);
    }
  }

  async function getRecommendAlbums() {
    try {
      const response = await axiosClient.get(`/album/recommendAlbum`)
      const responseData = await response.data.data;
      setRecommendAlbums(responseData);
    } catch (error) {
      console.error('앨범 목록을 가져올 수 없습니다.', error);
    }
  }

  useEffect(() => {
    const getAlbums = async () => {
      await getNewAlbums();
      await getTop10Albums();
      await getRecommendAlbums();
    }

    getAlbums();
  }, [isLogin]);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">COM,MA</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem image='/images/liked.png' name='좋아요 표시한 노래' href='liked'/>
          </div>
        </div>
      </Header>
      {isLogin ? (
          <div className="mt-2 mb-7 px-6">
            <div className="fle justify-between items-center">
              <h1 className="text-white text-2xl font-semibold">{userInfos.nickname}님을 위한 맞춤 곡</h1>
            </div>
            <div>
              <PageContent albums={recommendAlbums}/>
            </div>
          </div>
      ) : (
          <div className="mt-2 mb-7 px-6">
            <div className="fle justify-between items-center">
              <h1 className="text-white text-2xl font-semibold">추천 곡</h1>
            </div>
            <div>
              <PageContent albums={recommendAlbums}/>
            </div>
          </div>
      )}
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">최근 가장 많이 재생된 곡</h1>
        </div>
        <div>
          <PageContent albums={top10Albums}/>
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">새로 나온 곡</h1>
        </div>
        <div>
          <PageContent albums={newAlbums}/>
        </div>
      </div>
    </div>
  )
}
