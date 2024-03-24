'use client'

import {TbPlaylist} from 'react-icons/tb' 
import {AiOutlinePlus} from 'react-icons/ai'
import useAuthModal from '@/hooks/useAuthModal'
import useUploadModal from '@/hooks/useUploadModal'
import { Song } from '@/types'
import MediaItem from './MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import axiosClient from "@/libs/axiosClient";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface Props{
    songs:Song[]
}

interface PlaylistItem {
    playlistId: number;
    title: string;
    producerUsername: string;
    producerNickname: string;
}

const Playlist = () => {

    const authModal = useAuthModal()
    const uploadModal = useUploadModal()
    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>();

    const onClick = () => {
        //if not logged in send to auth 
        if(!isLogin){
            return authModal.onOpen()
        }
        return uploadModal.onOpen()
    }

    async function getPlaylists() {
        try {
            const response = await axiosClient.get('/playlist')
            const responseData = await response.data.data;
            setPlaylist(responseData);
        } catch (error) {
            console.error('재생목록 불러오기에 실패했습니다.', error);
        }
    }

    useEffect(() => {
        if (isLogin) {
            getPlaylists();
        }
    }, [isLogin]); // 의존성 배열에 isLogin 추가
  
    return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
            <div className="inline-flex items-center gap-x-2">
                {/*all the weird 'components' are just icons we got from react-icons*/}
                <TbPlaylist size={26} className='text-neutral-400'/>
                <p className='text-neutral-400 font-medium text-md'>재생목록</p>
            </div>
            <AiOutlinePlus onClick={onClick} size={20} className='text-neutral-400 cursor-pointer hover:text-white transition'/> {/*to create the color change once hover effect do hover:text-somecolor and transition, also set the default color too*/}
        </div>
        <div className='flex flex-col gap-y-2 mt-4 px-3'>
            {isLogin ? (
                <div>
                    {playlist?.map((item) => (
                        <div key={item.playlistId} onClick={() => router.push(`/playlist/${item.playlistId}`)} className="hover:opacity-75 cursor-pointer mb-2.5">
                            <a className="ml-3 text-sm text-neutral-400 font-bold">{item.title}</a>
                            <p className="ml-3 text-xs text-neutral-400">{item.producerNickname}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p className="ml-3 text-sm text-neutral-400">로그인 후 이용하실 수 있습니다.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Playlist