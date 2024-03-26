'use client'
import React, {useEffect, useState} from 'react'
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import {RxCaretLeft,RxCaretRight} from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import ProfileButton from "@/components/ProfileButton";
import NotificationButton from "@/components/NotificationButton";
import {UserInfos} from "@/types";

interface Props{
    children:React.ReactNode;
    className?:string
}
const Header: React.FC<Props> = ({children,className}) => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);
    const authModal = useAuthModal()

    return (
        <div className={twMerge(`h-fit bg-gradient-to-br from-blue-950 via-neutral-900 to-neutral-900 p-6`,className)}>
            <div className='w-full mb-4 flex items-center justify-between'>
                <div className='hidden md:flex gap-x-2 items-center'>
                    <button className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition' onClick={()=>router.back()}>
                        <RxCaretLeft size={35} className='text-white'/>
                    </button>
                    <button className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition' onClick={()=>router.forward()}>
                        <RxCaretRight size={35} className='text-white'/>
                    </button>
                </div>
                <div className='flex md:hidden gap-x-2 items-center'>
                    {/*only for mobile*/}
                    <button className='rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition'>
                        <HiHome className='text-black' size={20}/>
                    </button>
                    <button className='rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition'>
                        <BiSearch className='text-black' size={20}/>
                    </button>
                </div>
                <div className='flex justify-between items-center gap-x-4'>
                    {isLogin?(
                        //logged in
                        <div className='flex gap-x-4 items-center'>
                            <NotificationButton />
                            <ProfileButton className='w-10 h-10' profileImageUrl={userInfos.profileImageUrl} username={userInfos.username}></ProfileButton>
                        </div>
                    ):(
                        //not logged in
                        <div className='flex gap-x-4 items-center'>
                            <Button onClick={authModal.onOpen} className='bg-white px-6 py-2'>Login</Button>
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
}

export default Header