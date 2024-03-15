'use client'

import MediaItem from "@/components/MediaItem"
import { Song } from "@/types"
import LikeButton from "@/components/LikeButton"
import useOnPlay from "@/hooks/useOnPlay"

interface Props{
    songs:Song[]
}
const SearchContent = ({songs}:Props) => {

    const onPlay = useOnPlay(songs)

    if(songs.length===0){
        return(
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No songs found.</div>
        )
    }
    
    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song)=>(
                <div className="flex items-center gap-x-4 w-full" key={song.id}>
                    <div className="flex-1">
                        <MediaItem onClick={(id:string)=>onPlay(id)} data={song}/>
                    </div>
                    {/*add like button here*/}
                    <LikeButton songId={song.id}/>
                </div>
            ))}
        </div>
    )
}

export default SearchContent