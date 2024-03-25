'use client'

import MediaItem from "@/components/MediaItem"
import {AlbumData} from "@/types"
import { useRecoilValue } from "recoil"
import { searchDataState } from "@/providers/RecoilContextProvider"

const SearchContent = () => {
    const searchData = useRecoilValue(searchDataState) as unknown as AlbumData[];

    if(searchData.length===0){
        return(
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">해당되는 음악을 찾을 수 없습니다.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {searchData.map((album)=>(
                <div className="flex items-center gap-x-4 w-full" key={album.id}>
                    <div className="flex-1">
                        <MediaItem data={album}/>
                    </div>
                    {/*add like button here*/}
                    {/*<LikeButton songId={song.id}/>*/}
                </div>
            ))}
        </div>
    )
}

export default SearchContent