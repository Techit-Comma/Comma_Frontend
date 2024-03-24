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
    const songUrl = player.activeAlbum?.fileUrl;

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

    if(!songUrl || !activeAlbum){
        return null
    }

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-black h-[80px]'>
            <PlayerContent song={convertAlbumDataToSong(activeAlbum)} songUrl={songUrl}/>
        </div>
    )
}
