'use client'
import { Song } from "@/types";
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

interface Props{
    song: Song;
    songUrl: string;
}

const PlayerContent = ({song, songUrl}:Props) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(0.1);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume===0 ? HiSpeakerXMark:HiSpeakerWave

    // m3u8 URL 변환
    const m3u8Url = makeCdnUrl(songUrl); // 여기서 songUrl은 변환하기 전의 원본 URL

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

    // const [play,{pause, sound}] = useSound(songUrl,{
    //     volume:volume,
    //     onplay:()=>setIsPlaying(true),
    //     onend:()=>{setIsPlaying(false), onPlayNext()}, //stop current song and play next song
    //     onpause:()=>setIsPlaying(false),
    //     format:['m4a']
    // })

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
        else
        {
            if(audio === null){
                console.log("audio is null");
            }

            if(m3u8Url === ""){
                console.log("m3u8Url is empty");
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [m3u8Url, isPlaying]);

    // 재생 및 일시 정지 로직
    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (volume > 0) {
            setVolume(0);
            if (audioRef.current) audioRef.current.volume = 0;
        } else {
            setVolume(1);
            if (audioRef.current) audioRef.current.volume = 1;
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song}/>
                    <LikeButton songId={song.id}/>
                </div>
            </div>
            <div className="flex md:hidden col-auto w-full justify-end items-center"> {/*mobile play pause button*/}
                <div onClick={handlePlayPause}
                     className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'>
                    <Icon size={30} className='text-black'/>
                </div>
            </div>

            <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                <AiFillStepBackward size={30} className='text-neutral-400 cursor-pointer hover:text-white transition'
                                    onClick={onPlayPrev}/>
                <div className='flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer'
                     onClick={handlePlayPause}>
                    <Icon size={30} className='text-black'/>
                </div>
                <AiFillStepForward size={30} className='text-neutral-400 cursor-pointer hover:text-white transition'
                                   onClick={onPlayNext}/>
            </div>

            <div className="hidden md:flex w-full justify-end pr-10">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon className="cursor-pointer" size={34} onClick={toggleMute}/>
                    <Slider value={volume} onChange={(value) => setVolume(value)}/>
                </div>
            </div>
            <button className='text-neutral-400 hover:text-white absolute top-[10px] right-[10px] infline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none' onClick={player.reset}>
                <IoMdClose/>
            </button>
            <audio ref={audioRef} hidden/>
        </div>
    )
}

export default PlayerContent