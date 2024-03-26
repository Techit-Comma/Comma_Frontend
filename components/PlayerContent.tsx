'use client'
import {AlbumData} from "@/types";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import {BsPauseFill,BsPlayFill} from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js'
import {IoMdClose} from "react-icons/io";
import AddPlaylistButton from "@/components/AddPlaylistButton";

interface Props{
    album: AlbumData;
}

const PlayerContent = ({album}:Props) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(0.2);
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume===0 ? HiSpeakerXMark:HiSpeakerWave

    // m3u8 URL 변환
    const m3u8Url = makeCdnUrl(album?.fileUrl); // 여기서 songUrl은 변환하기 전의 원본 URL

    //Audio
    function makeCdnUrl(filePath: string) {
        const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
        const matches = filePath.match(regex); // regex와 일치하는 것을 모두 찾습니다.

        if (matches && matches.length > 0) {
            const match = matches[0]; // 첫 번째 일치 항목을 사용합니다.
            return `https://93vswghb2545.edge.naverncp.com/hls/nFxFqLx6-cT9DRRzYgr~-w__/music/output/${match}_,64,128,256,kbps.m4a.smil/master.m3u8`;
        }
        console.log("Failed to make CDN url");
        return "";
    }

    //play next song
    const onPlayNext = () =>{
        if(player.albums.length === 0){
            return
        }
        const currentIndex = player.albums.findIndex((album)=>album === player.activeAlbum) //find current song index in playlist
        const nextSong = player.albums[currentIndex+1] //find next song index in playlist

        if(!nextSong){ //if current song is last song go back to start
            return player.setAlbum(player.albums[0])
        }
        player.setAlbum(nextSong) //else play next song
    }

    //play prev song
    const onPlayPrev = () =>{ //for going back a song
        if(player.albums.length === 0){
            return
        }
        const currentIndex = player.albums.findIndex((album)=>album === player.activeAlbum) //find current song index in playlist
        const prevSong = player.albums[currentIndex-1] //find prev song index in playlist

        if(!prevSong){ //if current song is first song go back to end
            return player.setAlbum(player.albums[player.albums.length-1])
        }
        player.setAlbum(prevSong) //else play prev song
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume; // 볼륨 상태에 따라 audio 태그의 볼륨을 조절합니다.
        }
    }, [volume]); // 볼륨 상태가 변경될 때마다 실행됩니다.

    useEffect(() => {
        const audio = audioRef.current;
        let hls : Hls | undefined;

        if (audio && m3u8Url) {
            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(m3u8Url);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, function() {
                    if (isPlaying) {
                        audio.play().catch(err => console.error('Playback error:', err));
                    }
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                // Hls.isSupported()가 false인 경우
                // Safari 같은 일부 브라우저는 네이티브로 m3u8 재생을 지원
                audio.src = m3u8Url;
                if (isPlaying) {
                    audio.play().catch(err => console.error('Playback error:', err));
                }
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [m3u8Url]); // m3u8Url이 변경될 때만 Hls 인스턴스를 생성하거나 파괴합니다.

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };


    // 재생 및 일시 정지 로직
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying]); // isPlaying이 변경될 때마다 오디오 요소의 play 또는 pause 메서드를 호출합니다.

    const toggleMute = () => {
        if (volume > 0) {
            setVolume(0);
            if (audioRef.current) audioRef.current.volume = 0;
        } else {
            setVolume(0.5);
            if (audioRef.current) audioRef.current.volume = 0.5;
        }
    };

    return (
        <div className="player relative">
            <div className="w-full h-1 bg-gray-200">
                <div className="h-full bg-gradient-to-br from-neutral-900 via-neutral-900 to-blue-800" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 h-full px-4 pt-2">
                <div className="flex w-full justify-start">
                    <div className="flex items-center gap-x-4">
                        <MediaItem data={album}/>
                        <LikeButton data={album}/>
                        <AddPlaylistButton album={album}/>
                    </div>
                </div>
                <div
                    className="flex md:hidden col-auto w-full justify-end items-center"> {/*mobile play pause button*/}
                    <div onClick={handlePlayPause}
                         className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'>
                        <Icon size={30} className='text-black'/>
                    </div>
                </div>

                <div
                    className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                    <AiFillStepBackward size={30}
                                        className='text-neutral-400 cursor-pointer hover:text-white transition'
                                        onClick={onPlayPrev}/>
                    <div
                        className='flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer'
                        onClick={handlePlayPause}>
                        <Icon size={30} className='text-black'/>
                    </div>
                    <AiFillStepForward size={30}
                                       className='text-neutral-400 cursor-pointer hover:text-white transition'
                                       onClick={onPlayNext}/>
                </div>

                <div className="hidden md:flex w-full justify-end pr-10">
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <VolumeIcon className="cursor-pointer" size={34} onClick={toggleMute}/>
                        <Slider value={volume} onChange={(value) => setVolume(value)}/>
                    </div>
                </div>
                <button
                    className='text-neutral-400 hover:text-white absolute top-[10px] right-[10px] infline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'
                    onClick={player.reset}>
                    <IoMdClose/>
                </button>
                <audio ref={audioRef}
                       onLoadedMetadata={(e: React.SyntheticEvent<HTMLAudioElement>) => setDuration(e.currentTarget.duration)}
                       onTimeUpdate={(e: React.SyntheticEvent<HTMLAudioElement>) => setCurrentTime(e.currentTarget.currentTime)}
                       onEnded={onPlayNext}
                       hidden/>
            </div>
        </div>
    )
}

export default PlayerContent