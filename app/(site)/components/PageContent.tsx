'use client'

import {AlbumData, Song} from "@/types"
import SongItem from "@/components/SongItem"
import useOnPlay from "@/hooks/useOnPlay"

//remember typescript forces you to define the types of props so in this case we are passing an array called songs
interface Props {
    albums: AlbumData[]
}

const PageContent = ({albums}:Props) => {

    const onPlay = useOnPlay(albums);

    if(albums?.length === 0){
        return(
            <div className="mt-4 text-neutral-400">곡이 없습니다.</div>
        )
    }

    //we have songs to show
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
            {albums?.map((album)=>(
                <SongItem key={album.id} onClick={()=>onPlay(album)} data={album}/>
            ))}
        </div>
    )
}

export default PageContent