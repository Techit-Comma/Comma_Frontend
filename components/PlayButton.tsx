import React from 'react'
import { FaPlay } from 'react-icons/fa'
import {AlbumData} from "@/types";

interface Props{
  onClick: ()=>void
}

const PlayButton = ({onClick}:Props) => {
  return (
    //remember how the group works, we made in the group in the song item component so when the song item is hovered over this play button renders, then when the play button itself is hovered it scales up as well
    <button className='transition opacity-0 rounded-full flex items-center bg-blue-500 p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110' onClick={onClick}>
        <FaPlay className='text-black'/>
    </button>
  )
}

export default PlayButton