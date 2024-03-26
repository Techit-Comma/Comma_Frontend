'use client'

import {AlbumData} from "@/types"
import PlayButton from "./PlayButton"
import {Avatar} from "@material-ui/core";
import React from "react";
import {useRouter} from "next/navigation";

interface Props{
    data: AlbumData
    onClick: ()=>void
}

const SongItem = ({data,onClick}:Props) => {//getting the specific path for the image

  const router = useRouter();

    return (
        <div className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3'>
            <div className="relative aspect-square w-full h-full rounded-md overflow-hidden" onClick={() => router.push(`/album/${data.id}`)}>
              <Avatar variant="square"
                      src={data.imgUrl ? data.imgUrl : "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                      alt="Album Cover" style={{width: '100%', height: '100%'}}/>
            </div>
            <div className="flex flex-col items-start w-full pt-4 gap-y-1">
                <p className="font-semibold truncate w-full">{data.albumname}</p>
                <p className="text-neutral-400 text-sm pb-4 w-full truncate">By {data.artistNickname}</p>
            </div>
            <div className="absolute bottom-24 right-5">
                <PlayButton onClick={onClick} />
            </div>
        </div>
    )
}

export default SongItem