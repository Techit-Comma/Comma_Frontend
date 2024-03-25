'use client'

import Header from "@/components/Header";
import Image from "next/image";
import PlaylistContent from "../components/PlaylistContent";
import axiosClient from "@/libs/axiosClient";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AlbumData} from "@/types";

export const revalidate = 0;

interface PlaylistDetail {
    title: string;
    description: string;
    producerUsername: string;
    producerNickname: string;
    albumList: AlbumData[];
}

const Playlist = () => {
    const { id } = useParams();
    const router = useRouter();
    const [playlistDetail, setPlaylistDetail] = useState<PlaylistDetail>();
    async function getPlaylist() {
        try {
            const response = await axiosClient.get(`/playlist/${id}`)
            const responseData = await response.data.data;
            setPlaylistDetail(responseData);
        } catch (error) {
            console.error('재생목록 상세 정보를 불러오지 못했습니다.', error);
        }
    }

    useEffect(() => {
        getPlaylist();
    }, []); // 의존성 배열에 isLogin 추가

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header>
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row items-center gap-x-5">
                        <div className="relative h-32 w-32 lg:h-44 lg:w-44">
                            <Image fill src='/images/liked.png' alt='playlist' className="object-cover"/>
                        </div>
                        <div className="flex flex-col gap-y-2 mt-4 md:mt-0 text-center md:text-left lg:text-left">
                            <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">{playlistDetail?.title}</h1>
                            <a className="text-white text-md sm:text-lg lg:text-2xl font-bold m-2 cursor-pointer" onClick={() => router.push(`/member/${playlistDetail?.producerUsername}`)}>
                                {playlistDetail?.producerNickname}
                            </a>
                            <p className="text-white text-xs m-2">{playlistDetail?.description}</p>
                        </div>
                    </div>
                </div>
            </Header>
            <PlaylistContent albums={playlistDetail?.albumList}/>
        </div>
    )
}

export default Playlist