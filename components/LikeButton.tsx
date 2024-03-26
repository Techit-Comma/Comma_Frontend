'use client'

import useAuthModal from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {AlbumData, UserInfos} from "@/types";
import axiosClient from "@/libs/axiosClient";

interface Props{
    data: AlbumData
}

const LikeButton = ({data}: Props) => {

    const router = useRouter()
    const authModal = useAuthModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);
    const [isLiked, setIsLiked] = useState<boolean>(false)

    useEffect(()=>{
        if(!userInfos.memberId){
            return
        }

        const fetchData = async () => {
            await getAlbumLike();
        }

        fetchData();
    },[data])

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    const handleLike = async () => {
        if(!isLogin){ //open auth if logged out and try to like
            return authModal.onOpen()
        }

        if(isLiked){
            await disLikeAlbum();
            toast.success('좋아요를 취소했습니다!')
        }else{
            await likeAlbum();
            toast.success('좋아요를 했습니다!')
        }
        router.refresh()
    }

    async function getAlbumLike() {
        try{
            const res = await axiosClient.get(`/album/${data.id}/like`);
            const resData = await res.data.data;
            setIsLiked(!resData)
        } catch (error) {
            console.log(error);
        }
    }

    async function likeAlbum() {
        try{
            await axiosClient.post(`/album/${data.id}/like`,data.id);
            setIsLiked(true)
        } catch (error) {
            console.log(error);
        }
    }

    async function disLikeAlbum() {
        try{
            await axiosClient.post(`/album/${data.id}/cancelLike`,data.id);
            setIsLiked(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button className="hover:opacity-75 transition" onClick={handleLike}>
            <Icon color={isLiked ? '#1e40af' : 'white'} size={25}/>
        </button>
    )
}

export default LikeButton