'use client'

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import {AlbumData} from "@/types"
import { useRouter } from "next/navigation"
import {useEffect, useState} from "react"
import useOnPlay from "@/hooks/useOnPlay"
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";

interface Props{
    albums: AlbumData[]
}

const
    LikedContent = ({albums}:Props) => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);
    const onPlay = useOnPlay(albums)

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
    }, [isLoading, router]);

    if(albums.length === 0){
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">좋아요한 곡이 없습니다.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {albums.map((album)=>(
                <div className="flex items-center gap-x-4 w-full" key={album.id}>
                    <div className="flex-1">
                        <MediaItem onClick={(id)=>onPlay(album)} data={album}/>
                    </div>
                    <LikeButton data={album}/>
                </div>
            ))}
        </div>
    )
}

export default LikedContent