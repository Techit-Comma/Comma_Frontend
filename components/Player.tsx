'use client'

import useGetSongById from '@/hooks/useGetSongById'
import usePlayer from '@/hooks/usePlayer'
import useLoadSongUrl from '@/hooks/useLoadSongUrl'
import PlayerContent from './PlayerContent'
import {Song, AlbumData} from "@/types";
import {useEffect} from "react";
import axiosClient from "@/libs/axiosClient";

interface PlayerProps {
    albumData: AlbumData | undefined
}

export const Player = () => {
    const player = usePlayer();
    const activeAlbum = player.activeAlbum;
    const songUrl = player.activeAlbum?.fileUrl;

    useEffect(() => {
        addStreamingCount().then(r => console.log("as"));
    }, [activeAlbum]);

    const convertAlbumDataToSong = (albumData: AlbumData): Song => {
        return {
            id: albumData.id.toString(),
            user_id: "", // user_id 값이 AlbumData에 없으므로, 적절한 값을 설정해야 합니다.
            author: albumData.artistNickname,
            title: albumData.albumname,
            song_path: albumData.fileUrl,
            image_path: albumData.imgUrl,
        };
    };

    async function addStreamingCount() {
        try{
            if(activeAlbum != null)
            await axiosClient.post(`/album/${activeAlbum?.id}/streaming`,activeAlbum?.id);
        } catch (error) {
            console.log(error);
        }
    }

    if(!songUrl || !activeAlbum){
        return null
    }

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-black py-2 h-[81px] px-4'>
            <PlayerContent song={convertAlbumDataToSong(activeAlbum)} songUrl={songUrl}/>
        </div>
    )
}
