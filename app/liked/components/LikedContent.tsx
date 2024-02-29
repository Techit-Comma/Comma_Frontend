'use client'

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useOnPlay from "@/hooks/useOnPlay"

interface Props{
    songs: Song[]
}

const LikedContent = ({songs}:Props) => {
    const router = useRouter()
    const {isLoading, user} = useUser()
    const onPlay = useOnPlay(songs)

    useEffect(()=> {
        if(!isLoading && !user){
            router.replace('/') //not logged in go home
        }
    },[isLoading, user, router])

    if(songs.length === 0){
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">No liked songs.</div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song)=>(
                <div className="flex items-center gap-x-4 w-full" key={song.id}>
                    <div className="flex-1">
                        <MediaItem onClick={(id)=>onPlay(id)} data={song}/>
                    </div>
                    <LikeButton songId={song.id}/>
                </div>
            ))}
        </div>
    )
}

export default LikedContent