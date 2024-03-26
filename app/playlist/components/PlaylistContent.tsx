'use client'

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import {AlbumData, Song} from "@/types"
import { useRouter } from "next/navigation"
import React, {useEffect, useState} from "react"
import useOnPlay from "@/hooks/useOnPlay"
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {FaPlay} from "react-icons/fa";

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
                </div>
            ))}
            <div className="absolute bottom-8 right-10">
                <button className='transition rounded-full flex items-center bg-blue-500 p-4' onClick={()=>onPlay(albums[0])}>
                    <FaPlay className='text-black'/>
                </button>
            </div>
        </div>
    )
}

export default PlaylistContent