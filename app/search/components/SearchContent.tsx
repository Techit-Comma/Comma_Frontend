'use client'

import MediaItem from "@/components/MediaItem"
import {AlbumData, Song} from "@/types"
import LikeButton from "@/components/LikeButton"
import { useRecoilValue } from "recoil"
import { searchDataState } from "@/providers/RecoilContextProvider"
import {useEffect, useState} from "react";

const SearchContent = () => {
    const searchData = useRecoilValue(searchDataState) as unknown as AlbumData[];
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        if (Array.isArray(searchData)) {
            const newSongs: Song[] = searchData.map(data => {
                return {
                    id: data.id.toString(),
                    user_id: data.artistNickname,
                    author: data.artistNickname,
                    title: data.albumname,
                    song_path: data.fileUrl,
                    image_path: data.imgUrl,
                };
            });

            setSongs(newSongs);
        }

        console.log(searchData.length);
    }, [searchData]);


    if(searchData.length===0){
        return(
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">해당되는 음악을 찾을 수 없습니다.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song)=>(
                <div className="flex items-center gap-x-4 w-full" key={song.id}>
                    <div className="flex-1">
                        <MediaItem data={song}/>
                    </div>
                    {/*add like button here*/}
                    {/*<LikeButton songId={song.id}/>*/}
                </div>
            ))}
        </div>
    )
}

export default SearchContent