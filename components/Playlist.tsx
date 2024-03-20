'use client'

import {TbPlaylist} from 'react-icons/tb' 
import {AiOutlinePlus} from 'react-icons/ai'
import useAuthModal from '@/hooks/useAuthModal'
import useUploadModal from '@/hooks/useUploadModal'
import { Song } from '@/types'
import MediaItem from './MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import {useRecoilState} from "recoil";
import {loginState} from "@/store/store";

interface Props{
    songs:Song[]
}

const Playlist = ({songs}:Props) => {

    const authModal = useAuthModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const uploadModal = useUploadModal()
    const onPlay = useOnPlay(songs)

    const onClick = () => {
        //if not logged in send to auth 
        if(!isLogin){
            return authModal.onOpen()
        }
        return uploadModal.onOpen()

    }
  
    return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
            <div className="inline-flex items-center gap-x-2">
                {/*all the weird 'components' are just icons we got from react-icons*/}
                <TbPlaylist size={26} className='text-neutral-400'/>
                <p className='text-neutral-400 font-medium text-md'>Playlist</p>
            </div>
            <AiOutlinePlus onClick={onClick} size={20} className='text-neutral-400 cursor-pointer hover:text-white transition'/> {/*to create the color change once hover effect do hover:text-somecolor and transition, also set the default color too*/}
        </div>
        <div className='flex flex-col gap-y-2 mt-4 px-3'>
            {songs.map((song)=>(
                <MediaItem onClick={(id:string)=>onPlay(id)} key={song.id} data={song}/>
            ))}
        </div>
    </div>
  )
}

export default Playlist