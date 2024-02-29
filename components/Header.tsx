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

interface Props{
    children:React.ReactNode;
    className?:string
}
const Header: React.FC<Props> = ({children,className}) => {
    const router = useRouter()
    const handleLogout =  async () => {
        //reset any playing songs
        router.refresh()

        // if(error){
        //     toast.error(error.message)
        // }else{
        //     toast.success('Logged out!')
        // }
    }
    const authModal = useAuthModal()
    const {user} = useUser()

    return (
        <div className={twMerge(`h-fit bg-gradient-to-br from-blue-950 via-neutral-900 to-neutral-900 p-6`,className)}> {/*using the twMerge merges the stylings passed in with classname with the predefined stylings*/}
            <div className='w-full mb-4 flex items-center justify-between'>
                <div className='hidden md:flex gap-x-2 items-center'>
                    <button className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition' onClick={()=>router.back()}> {/*remember we cant just call a function from router with the onclick hence empty callback function that calls the router func*/}
                        <RxCaretLeft size={35} className='text-white'/>
                    </button>
                    <button className='rounded-full bg-black flex items-center justify-center hover:opacity-75 transition' onClick={()=>router.forward()}>
                        <RxCaretRight size={35} className='text-white'/>
                    </button>
                </div>
                <div className='flex md:hidden gap-x-2 items-center'> {/*med and larger devices is hidden*/}
                    {/*only for mobile*/}
                    <button className='rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition'>
                        <HiHome className='text-black' size={20}/>
                    </button>
                    <button className='rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition'>
                        <BiSearch className='text-black' size={20}/>
                    </button>
                </div>
                <div className='flex justify-between items-center gap-x-4'>
                    {user?(
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