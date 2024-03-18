'use client'
import Header from "@/components/Header"
import ListItem from "@/components/ListItem"
import PageContent from "./components/PageContent"
import {getLoginState, oauthLogin} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {
  memberIdState,
  loginState,
  usernameState,
  nicknameState,
  profileImageUrlState, baseUrl
} from "@/store/store";
import {useSearchParams, useRouter} from "next/navigation";
import {useEffect} from "react";

export const revalidate = 0

export default function Home() {
  const router = useRouter()
  const songs = [] //get all the songs from the db

  // 페이지 및 전역 상태 관리
  const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [memberId, setMemberId] = useRecoilState(memberIdState);
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [profileImageUrl, setProfileImageUrl] = useRecoilState(profileImageUrlState);

  // Oauth 로그인 처리
  const searchParams = useSearchParams();

  useEffect(() => {
    const oauth = searchParams.get("oauth");
    if (oauth) {
      oauthLogin(setIsLogin);
      toast.success("로그인 되었습니다.");

      router.push('/');
    }

    getLoginState(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
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
              <h1 className="text-white text-2xl font-semibold">{nickname}님을 위한 맞춤 곡</h1>
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
