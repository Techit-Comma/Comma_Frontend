'use client'
import Header from "@/components/Header"
import ListItem from "@/components/ListItem"
import PageContent from "./components/PageContent"
import {CheckAccessToken, getLoginState, oauthLogin} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {loginState, userInfoState} from "@/store/store";
import {useSearchParams, useRouter} from "next/navigation";
import {useEffect} from "react";
import {UserInfos} from "@/types";

export const revalidate = 0

export default function Home() {
  const router = useRouter()
  const songs = [] //get all the songs from the db

  // 페이지 및 전역 상태 관리
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);

  // Oauth 로그인 처리
  const searchParams = useSearchParams();

  useEffect(() => {
    const getUserInfo = async () => {
      const oauth = searchParams.get("oauth");
      if (oauth) {
        setIsLogin(await oauthLogin());
        toast.success("로그인 되었습니다.");

        router.push('/');
      }

      const userLoginState = await getLoginState();

      setIsLogin(await CheckAccessToken());

      if (userLoginState) {
        setUserInfos(userLoginState);
      }
    }

    getUserInfo();
  }, []);


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
              <PageContent songs={songs}/>
            </div>
          </div>
      ) : (
          <div></div>
      )}
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">최근 가장 많이 재생된 곡</h1>
        </div>
        <div>
          <PageContent songs={songs}/>
        </div>
      </div>
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">새로 나온 곡</h1>
        </div>
        <div>
          <PageContent songs={songs}/>
        </div>
      </div>
    </div>
  )
}
