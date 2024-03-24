'use client'
import useAlbumDeleteModal from "@/hooks/useAlbumDeleteModal";
import Modal from "../Modal";
import Divider from '@material-ui/core/Divider';
import React, {useEffect, useState} from 'react';
import { toast } from "react-hot-toast";
import {baseUrl, filePathState, imagePathState, loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken, GetCookie} from "@/libs/auth";
import { useRecoilState } from 'recoil';
import {useRouter} from "next/navigation";
import {green, red} from "@mui/material/colors";
import Button from "@mui/material/Button";
import axiosClient from "@/libs/axiosClient";
const AlbumDeleteModal = () => {
    const {onClose, isOpen, albumId} = useAlbumDeleteModal()

    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLogin) {
            onClose();
        }
    }, [isLoading, router]);

    const onChange = (open:boolean) =>{
        if(!open){
            onClose()
        }
    }

    async function handleDelete() {
        try {
            // 앨범 삭제 API 호출
            await axiosClient.delete(`/album/${albumId}`);
            toast.success('앨범이 성공적으로 삭제되었습니다.');
            router.push("/");
            onClose();
        } catch (error) {
            toast.error('앨범 삭제에 실패했습니다.');
        }
    }

    return (
        <Modal title='앨범 삭제하기' description="정말로 앨범을 삭제할까요?" isOpen={isOpen} onChange={onChange}>
            <Divider variant="middle" style={{background: 'gray'}}/>
            <p className="text-center m-3" style={{color: red[500], fontWeight: 'bold'}}>
                이 작업은 되돌릴 수 없습니다!
            </p>
            <Divider variant="middle" style={{background: 'gray'}}/>
            <div className="flex flex-col mt-10 items-center">
                <Button variant="contained" color="error" fullWidth style={{background: red[500], fontWeight: 'bold'}} onClick={handleDelete}>
                    삭제하기
                </Button>
            </div>
        </Modal>
    )
}

export default AlbumDeleteModal