'use client'

import useAuthModal from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    AiFillFileAdd,
    AiFillHeart,
    AiOutlineFileAdd,
    AiOutlineHeart,
    AiOutlineUsergroupAdd, AiTwotoneFileAdd, AiTwotoneFolderAdd
} from "react-icons/ai";
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {AlbumData, UserInfos} from "@/types";
import {faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import usePlaylistModal from "@/hooks/usePlaylistModal";

interface Props{
    album: AlbumData;
}

const AddPlaylistButton = ({album}:Props) => {

    const router = useRouter()
    const authModal = useAuthModal()
    const playlistModal = usePlaylistModal();
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);

    useEffect(()=>{
        if(!userInfos.memberId){
            return
        }

    },[album])

    const handleAddPlaylist = async () => {
        if(!isLogin){ //open auth if logged out and try to like
            return authModal.onOpen()
        }

        playlistModal.setAlbumId(album.id);
        return playlistModal.onOpen();
    }

    return (
        <button className="hover:opacity-75 transition" onClick={handleAddPlaylist}>
            <FontAwesomeIcon icon={faSquarePlus} size="lg" />
        </button>
    )
}

export default AddPlaylistButton