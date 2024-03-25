'use client'
import useCreatePlaylistModal from '@/hooks/useCreatePlaylistModal'
import React, {FormEvent} from 'react'
import Modal from './Modal'
import { useState } from 'react'
import Input from './Input'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {loginState, playlistDataState, playlistState} from "@/providers/RecoilContextProvider";
import {useRecoilState} from "recoil";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import axiosClient from "@/libs/axiosClient";

const CreatePlaylistModal = () => {

    const createPlaylistModal = useCreatePlaylistModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [playlist, setPlaylist] = useRecoilState(playlistDataState)
    const [playlistUpdate, setPlaylistUpdate] = useRecoilState(playlistState);


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter()

    const onChange = (open:boolean) => {
        if(!open){
            createPlaylistModal.onClose()
        }
    }

    async function createPlaylist(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (formData) {
            const jsonData: {[key: string]: string} = {};
            for (let pair of formData.entries()) {
                jsonData[pair[0]] = pair[1] as string;
            }
            try {
                await axiosClient.post('/playlist', jsonData);
                toast.success("재생목록이 생성되었습니다.");
                setPlaylistUpdate(true);
                createPlaylistModal.onClose();
            } catch (error) {
                toast.error('재생목록 생성에 실패했습니다.', error);
                return undefined;
            }
        }
    }

  return (
    <Modal title='새 플레이리스트' description='나만의 플레이리스트 만들기' isOpen={createPlaylistModal.isOpen} onChange={onChange}>
        <form onSubmit={createPlaylist} className='flex flex-col gap-y-4'>
            <Input id='title' name='title' value={title} placeholder='제목'
                   onChange={(event) => setTitle(event.target.value)}/>
            <Input id='description' name='description' value={description} placeholder='설명'
                   onChange={(event) => setDescription(event.target.value)}/>
            <Button className="w-full" variant="outlined" color="primary" type="submit">
                <FontAwesomeIcon icon={faPlus}/>&nbsp;생성
            </Button>
        </form>
    </Modal>
  )
}

export default CreatePlaylistModal