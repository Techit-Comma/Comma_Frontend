'use client'
import useUploadModal from '@/hooks/useUploadModal'
import React, {FormEvent} from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Modal from './Modal'
import { useState } from 'react'
import Input from './Input'
import { toast } from 'react-hot-toast'
import uniqid from 'uniqid'
import { useRouter } from 'next/navigation'
import {loginState} from "@/providers/RecoilContextProvider";
import {useRecoilState} from "recoil";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import axiosClient from "@/libs/axiosClient";

const PlaylistModal = () => {

    const uploadModal = useUploadModal()
    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useRecoilState(loginState);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter()

    const onChange = (open:boolean) => {
        if(!open){
            uploadModal.onClose()
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
                uploadModal.onClose();
            } catch (error) {
                toast.error('재생목록 생성에 실패했습니다.', error);
                return undefined;
            }
        }
    }

  return (
    <Modal title='새 플레이리스트' description='나만의 플레이리스트 만들기' isOpen={uploadModal.isOpen} onChange={onChange}>
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

export default PlaylistModal