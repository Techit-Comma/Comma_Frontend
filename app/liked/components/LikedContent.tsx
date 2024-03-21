'use client'

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import { Song } from "@/types"
import { useRouter } from "next/navigation"
import {useEffect, useState} from "react"
import useOnPlay from "@/hooks/useOnPlay"
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";

interface Props{
    songs: Song[]
}

const LikedContent = ({songs}:Props) => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);
    const onPlay = useOnPlay(songs)

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

    if(songs.length === 0){
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No liked songs.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song)=>(
                <div className="flex items-center gap-x-4 w-full" key={song.id}>
                    <div className="flex-1">
                        <MediaItem onClick={(id)=>onPlay(id)} data={song}/>
                    </div>
                    <LikeButton songId={song.id}/>
                </div>
            ))}
        </div>
    )
}

export default LikedContent