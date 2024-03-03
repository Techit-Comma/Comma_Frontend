'use client'
import React from 'react'
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import {RxCaretLeft,RxCaretRight} from 'react-icons/rx';
import { HiHome } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import Button from './Button';
import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {useRecoilState} from "recoil";
import {baseUrl, loginState} from "@/store/store";
import {CheckAccessToken, GetCookie, SetTokenCookie} from "@/libs/token";

interface Props{
    children:React.ReactNode;
    className?:string
}
const Header: React.FC<Props> = ({children,className}) => {
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const accessToken = GetCookie('accessToken');
    const router = useRouter()
    const handleLogout =  async () => {
        //reset any playing songs
        router.refresh()

        const response = await fetch(requestUrl+`/member/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            }
        });

        if(!response.ok){
            console.log(response);
            const errorData = await response.json();
            toast.error(errorData.message)
        }else{
            toast.success('로그아웃 되었습니다.')
        }

        SetTokenCookie('accessToken', '', 0);
        SetTokenCookie('refreshToken', '', 0);
        CheckAccessToken(setIsLogin);

        localStorage.removeItem("memberId");
        localStorage.removeItem("username")
    }
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
                            <Button onClick={handleLogout} className='bg-white px-6 py-2'>Logout</Button>
                            <Button onClick={()=>router.push('/account')} className='bg-white'><FaUserAlt/></Button>
                        </div>
                    ):(
                        //not logged in
                    <>
                        <div>
                            <Button onClick={authModal.onOpen} className='bg-transparent text-neutral-300 font-medium'>Sign Up</Button>
                        </div>
                        <div>
                            <Button onClick={authModal.onOpen} className='bg-white px-6 py-2'>Log in</Button>
                        </div>
                    </>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
}

export default Header