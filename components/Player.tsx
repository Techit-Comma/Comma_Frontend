'use client'

import usePlayer from '@/hooks/usePlayer'
import PlayerContent from './PlayerContent'
import {AlbumData} from "@/types";
import {useEffect} from "react";
import axiosClient from "@/libs/axiosClient";

interface PlayerProps {
    albumData: AlbumData | undefined
}

export const Player = () => {
    const player = usePlayer();
    const activeAlbum = player.activeAlbum;

    useEffect(() => {
        addStreamingCount();
    }, [activeAlbum]);

    if(!activeAlbum){
        return null
    }

    async function addStreamingCount() {
        try{
            if(activeAlbum != null)
                await axiosClient.post(`/album/${activeAlbum?.id}/streaming`,activeAlbum?.id);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-black h-[80px]'>
            <PlayerContent album={activeAlbum}/>
        </div>
    )
}
