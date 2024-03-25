'use client'

import React, {FormEvent} from 'react'
import Modal from './Modal'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {loginState, playlistDataState, playlistState} from "@/providers/RecoilContextProvider";
import {useRecoilState} from "recoil";
import axiosClient from "@/libs/axiosClient";
import usePlaylistModal from "@/hooks/usePlaylistModal";
import {PlaylistItem} from "@/types";

const PlaylistModal = () => {

    const playlistModal = usePlaylistModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [playlist, setPlaylist] = useRecoilState<PlaylistItem[]>(playlistDataState);
    const [playlistUpdate, setPlaylistUpdate] = useRecoilState(playlistState);

    const router = useRouter()

    const onChange = (open:boolean) => {
        if(!open){
            playlistModal.onClose()
        }
    }

    async function addPlaylist(playlistId: number) {
        try {
            await axiosClient.post(`/playlist/${playlistId}/album`, {
              'albumId': playlistModal.albumId,
            });
            toast.success("재생목록에 추가되었습니다.");
            playlistModal.onClose();
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Modal title='재생목록에 추가' description="나만의 플레이리스트 만들기" isOpen={playlistModal.isOpen} onChange={onChange}>
        <div>
          {playlist?.map((item) => (
              <div key={item.playlistId} onClick={() => addPlaylist(item.playlistId)} className="hover:opacity-75 cursor-pointer mb-2.5">
                <a className="ml-3 text-sm text-neutral-400 font-bold">{item.title}</a>
                <p className="ml-3 text-xs text-neutral-400">{item.producerNickname}</p>
              </div>
          ))}
        </div>
    </Modal>
  )
}

export default PlaylistModal