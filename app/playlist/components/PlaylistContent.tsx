'use client'

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import {AlbumData, Song} from "@/types"
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

const PlaylistContent = ({albums}:Props) => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);
    const onPlay = useOnPlay(albums)

    if(albums?.length === 0){
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">아직 재생목록에 곡이 없습니다.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {albums?.map((album)=>(
                <div className="flex items-center gap-x-4 w-full" key={album.id}>
                    <div className="flex-1">
                        <MediaItem onClick={(id)=>onPlay(album)} data={album}/>
                    </div>
                    <LikeButton songId={album.id}/>
                </div>
            ))}
        </div>
    )
}

export default PlaylistContent