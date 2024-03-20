'use client'
import React, { useMemo } from 'react'
import {usePathname} from 'next/navigation'
import {HiHome} from 'react-icons/hi'
import {BiSearch} from 'react-icons/bi'
import Box from './Box'
import SidebarItem from './SidebarItem'
import Playlist from './Playlist'
import { Song } from '@/types'
import usePlayer from '@/hooks/usePlayer'
import { twMerge } from 'tailwind-merge'
import Follow from "@/components/Follow";

interface Props{
    children: React.ReactNode;
    songs: Song[]
}

const Sidebar: React.FC<Props> = ({children, songs}) => {
    const player = usePlayer()
    const pathname=usePathname();
    const routes = useMemo(()=>[
        //I think this is just defining the urls for the home and search page
        //routes is an array 
        {
            icon: HiHome,
            label:'Home',
            active:pathname !== '/search',
            href:'/'
        },{
            icon: BiSearch,
            label:'Search',
            active:pathname === '/search',
            href:'/search'
        }
    ],[pathname])

    return (
        <div className={twMerge(`flex h-full`,player.activeId && 'h-[calc(100%-80px)]')}>
            <div className='hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2'> {/*on med devices its flex mobile its hidden*/}
                <Box>
                    <div className='flex flex-col gap-y-4 px-5 py-4'>
                        {routes.map((item)=>(
                            <SidebarItem key={item.label} {...item}/> //spreading the rest of the props
                        ))}
                    </div>
                </Box>
                <Box className='overflow-y-auto h-full'>
                    <Follow/>
                </Box>
                <Box className='overflow-y-auto h-full'>
                    <Playlist songs={songs}/>
                </Box>
            </div> 
            <main className='h-full flex-1 overflow-y-auto py-2'>
                {children}
            </main>
        </div>
    )
}

export default Sidebar