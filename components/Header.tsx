'use client'
import React, {useEffect, useState} from 'react'
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import {RxCaretLeft,RxCaretRight} from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import {FaBell, FaUserAlt} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {useRecoilState} from "recoil";
import {
    baseUrl,
    memberIdState,
    loginState,
    usernameState,
    nicknameState,
    profileImageUrlState
} from "@/store/store";
import {
    CheckAccessToken,
    GetCookie,
    getLoginState,
    LogoutProcess,
    ReissueTokens,
    SetTokenCookie
} from "@/libs/auth";
import ProfileButton from "@/components/ProfileButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {IconButton, ListItemIcon, ListItemText, MenuList, Paper} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@material-ui/core/Divider";
import {Badge} from "@mui/base";
import NotificationButton from "@/components/NotificationButton";

interface Props{
    children:React.ReactNode;
    className?:string
}
const Header: React.FC<Props> = ({children,className}) => {
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(usernameState);
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [nickname, setNickname] = useRecoilState(nicknameState);
    const [profileImageUrl, setProfileImageUrl] = useRecoilState(profileImageUrlState);
    const router = useRouter()
    const authModal = useAuthModal()

    useEffect(() => {
        getLoginState(requestUrl, setIsLogin, setUsername, setMemberId, setNickname, setProfileImageUrl);
    }, []);

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
                            <NotificationButton/>
                            <ProfileButton onClick={()=>router.push('/account')} className='w-10 h-10' profileImageUrl={profileImageUrl}></ProfileButton>
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