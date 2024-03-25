'use client'

import useAuthModal from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {UserInfos} from "@/types";

interface Props{
    songId: string;
}

const LikeButton = ({songId}:Props) => {

    const router = useRouter()
    const authModal = useAuthModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);
    const [isLiked, setIsLiked] = useState<boolean>(false)

    useEffect(()=>{
        if(!userInfos.memberId){
            return
        }

    },[songId])

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    const handleLike = async () => {
        if(!isLogin){ //open auth if logged out and try to like
            return authModal.onOpen()
        }

        if(isLiked){
            //pressing like on a liked song will unlike it

            setIsLiked(false)
            toast.success('좋아요를 취소했습니다!')
        }else{
            //like the song aka insert into song

            setIsLiked(true)
            toast.success('좋아요를 했습니다!')
        }
        router.refresh()
    }

    return (
        <button className="hover:opacity-75 transition" onClick={handleLike}>
            <Icon color={isLiked ? '#1e40af' : 'white'} size={25}/>
        </button>
    )
}

export default LikeButton