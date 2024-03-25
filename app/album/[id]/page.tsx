'use client'

import {AlbumInfoContent} from "@/app/album/[id]/components/AlbumInfoContent";
import React, {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {AlbumData, UserInfos} from "@/types";
import {usePathname} from "next/navigation";
import axiosClient from "@/libs/axiosClient";
import Header from "@/components/Header";
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import useAlbumDeleteModal from "@/hooks/useAlbumDeleteModal";
import {useRecoilState} from "recoil";
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
export default function AlbumInfoPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);
    const pathname = usePathname();
    const {onOpen} = useAlbumDeleteModal();
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);

    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        const getAlbum = async() => {
            await getAlbumData();
            if (!albumData) {
                return;
            }
        }

        getAlbum();
        setIsMounted(true);
    }, [pathname]);

    if (!isMounted) {
        return null;
    }

    async function getAlbumData() {
        // 앨범 ID를 가져오기 위해 경로를 파싱합니다.
        const albumId = pathname.split('/').pop();
        try{
            const res = await axiosClient.get(`/album/detail/${albumId}`);
            const resData = await res.data.data;
            setAlbumData(resData);
        } catch (error) {
            console.log(error);
        }
    }

    if (!albumData) {
        return null;
    }

    async function handleDelete() {
        if (albumData) {
            onOpen(albumData.id);
        }
    }

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mb-2 flex justify-between items-center">
                    <h1 className="text-white text-3xl font-semibold">앨범 정보</h1>
                    {!isLoading && albumData?.artistNickname === userInfos.nickname && (
                        <div>
                            <IconButton color="primary" aria-label="edit" onClick={() => {toast.error("수정할 수 없습니다.")}}>
                                <EditIcon fontSize="large"/>
                            </IconButton>
                            <IconButton color="secondary" aria-label="delete" onClick={handleDelete}>
                                <DeleteIcon fontSize="large"/>
                            </IconButton>
                        </div>
                    )}
                </div>
            </Header>
            <AlbumInfoContent album={albumData}/>
        </div>
    );
};