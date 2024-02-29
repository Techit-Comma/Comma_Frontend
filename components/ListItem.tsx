'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import {FaPlay} from 'react-icons/fa'

interface Props{
    image:string;
    name:string;
    href:string;
}
//doing the other method of defining props, hopefully it works
const ListItem = ({image,name,href}:Props) => {

    const router = useRouter()
    const onClick = () =>{
        //add auth
        router.push(href)
    }

  return (
    <button className='relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4' onClick={onClick}>
        <div className='relative min-h-[64px] min-w-[64px]'>
            <Image className='object-cover' fill src={image} alt='img'/>
        </div>
        <p className='font-medium truncate py-5'>{name}</p>
        <div className='absolute transition opacity-0 rounded-full flex items-center justify-center bg-blue-500 p-4 drop-shadow-md right-5 group-hover:opacity-100 hover:scale-110'> {/*notice the largest parent has a group classname and this has group-hover this tells tailwind whenever I hover on the parent do an effect aka change opacity on the child, then hovering over the child itself adds another effect the scale effect*/}
            <FaPlay className='text-black'/>
        </div>
    </button>
  )
}

export default ListItem