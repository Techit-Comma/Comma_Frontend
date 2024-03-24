'use client'

import useGetSongById from '@/hooks/useGetSongById'
import usePlayer from '@/hooks/usePlayer'
import useLoadSongUrl from '@/hooks/useLoadSongUrl'
import PlayerContent from './PlayerContent'
import {Song, AlbumData} from "@/types";

interface PlayerProps {
    albumData: AlbumData | undefined
}

export const Player = () => {
    const player = usePlayer();
    const activeAlbum = player.activeAlbum;

    if(!activeAlbum){
        return null
    }

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-black h-[80px]'>
            <PlayerContent album={activeAlbum}/>
        </div>
    )
}
