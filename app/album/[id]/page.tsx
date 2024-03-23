'use client'

import {AlbumInfoContent} from "@/app/album/[id]/components/AlbumInfoContent";
import React, {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {AlbumData} from "@/types";
import {usePathname} from "next/navigation";
import axiosClient from "@/libs/axiosClient";
import Header from "@/components/Header";
import {FaPlay} from "react-icons/fa";

export default function AlbumInfoPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);
    const pathname = usePathname();

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

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mb-2">
                    <h1 className="text-white text-3xl font-semibold">앨범 정보</h1>
                </div>
            </Header>
            <AlbumInfoContent album={albumData}/>
        </div>
    );
};