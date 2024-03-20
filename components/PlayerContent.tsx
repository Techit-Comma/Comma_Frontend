'use client'
import { Song } from "@/types";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import {BsPauseFill,BsPlayFill} from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface Props{
    song: Song;
    songUrl: string;
}

const PlayerContent = ({song, songUrl}:Props) => {

    const player = usePlayer()
    const [volume, setVolume] = useState(0.1)
    const [isPlaying, setIsPlaying] = useState(false)

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume===0 ? HiSpeakerXMark:HiSpeakerWave

    //play next song
    const onPlayNext = () =>{
        if(player.ids.length===0){
            return
        }
        const currentIndex = player.ids.findIndex((id)=>id===player.activeId) //find current song index in playlist
        const nextSong = player.ids[currentIndex+1] //find next song index in playlist

        if(!nextSong){ //if current song is last song go back to start
            return player.setId(player.ids[0])
        }
        player.setId(nextSong) //else play next song
    }

    //play prev song
    const onPlayPrev = () =>{ //for going back a song
        if(player.ids.length===0){
            return
        }
        const currentIndex = player.ids.findIndex((id)=>id===player.activeId) //find current song index in playlist
        const prevSong = player.ids[currentIndex-1] //find prev song index in playlist

        if(!prevSong){ //if current song is first song go back to end
            return player.setId(player.ids[player.ids.length-1])
        }
        player.setId(prevSong) //else play prev song
    }

    const [play,{pause, sound}] = useSound(songUrl,{
        volume:volume,
        onplay:()=>setIsPlaying(true),
        onend:()=>{setIsPlaying(false), onPlayNext()}, //stop current song and play next song
        onpause:()=>setIsPlaying(false),
        format:['mp3']
    })

    useEffect(()=>{
        sound?.play()
        return () => {
            sound?.unload()
        }
    },[sound])


    //clicking the play button
    const handlePlay = () => {
        if(!isPlaying){
            play()
        }else{
            pause()
        }
    }

    const toggleMute = () => {
        if(volume===0){
            setVolume(1)
        }else{
            setVolume(0)
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song}/>
                    <LikeButton songId={song.id}/>
                </div>
            </div>
            <div className="flex md:hidden col-auto w-full justify-end items-center"> {/*mobile play pause button*/}
                <div onClick={handlePlay} className='h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer'>
                    <Icon size={30} className='text-black'/>
                </div>
            </div>
            
            <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                <AiFillStepBackward size={30} className='text-neutral-400 cursor-pointer hover:text-white transition' onClick={onPlayPrev}/>
                <div className='flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer' onClick={handlePlay}>
                    <Icon size={30} className='text-black'/>
                </div>
                <AiFillStepForward size={30} className='text-neutral-400 cursor-pointer hover:text-white transition' onClick={onPlayNext}/>
            </div>

            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon className="cursor-pointer" size={34} onClick={toggleMute}/>
                    <Slider value={volume} onChange={(value)=>setVolume(value)}/>
                </div>
            </div>
        </div>
    )
}

export default PlayerContent