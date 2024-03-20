'use client'

import useGetSongById from '@/hooks/useGetSongById'
import usePlayer from '@/hooks/usePlayer'
import useLoadSongUrl from '@/hooks/useLoadSongUrl'
import PlayerContent from './PlayerContent'
import {Song, AlbumData} from "@/types";

interface PlayerProps {
    albumData: AlbumData | null
}

export const Player = ({albumData}: PlayerProps) => {
    const player = usePlayer()
    const songUrl = albumData?.fileUrl;
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
    const song = albumData ? convertAlbumDataToSong(albumData) : null;

    if(!song || !songUrl){
        return null
    }

    return (
        // <div className='fixed bottom-0 bg-black w-full py-2 h-[80px] px-4'>
        //     <PlayerContent song={song} key={songUrl} songUrl={songUrl}/>
        // </div>
        <div className='fixed bottom-0 left-0 right-0 bg-black py-2 h-[81px] px-4'>
        {albumData?.fileUrl &&
            <PlayerContent song={convertAlbumDataToSong(albumData)}
                           songUrl={albumData.fileUrl}/>}
        </div>
    )
}
