'use client'
import useAlbumReleaseModal from "@/hooks/useAlbumReleaseModal";
import Modal from "../Modal";
import Divider from '@material-ui/core/Divider';
import React, {useEffect, useState} from 'react';
import { toast } from "react-hot-toast";
import {baseUrl, filePathState, imagePathState, loginState} from "@/providers/RecoilContextProvider";
//MUI 파일 드롭존
import { DropzoneArea } from 'material-ui-dropzone';
//MUI Progress Step
import HorizontalLinearAlternativeLabelStepper from "@/components/Album/AlbumReleaseProgress";
//MUI Circle Progress
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {CheckAccessToken, GetCookie} from "@/libs/auth";
import { useRecoilState } from 'recoil';
import {useRouter} from "next/navigation";
const AlbumReleaseModal = () => {
    const {onClose, isOpen} = useAlbumReleaseModal()
    const [step, setStep] = useState(0);
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [filePath, setFilePath] = useRecoilState(filePathState);
    const [imagePath, setImagePath] = useRecoilState(imagePathState);

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

    async function handleAudioUpload(file: File) {
        console.log('handleFileUpload called');
        console.log('Files:', file);
        setIsLoading(true);

        const token = GetCookie('accessToken');
        const headers = token ? { 'Authorization': token } : undefined;

        const res = await fetch(`${requestUrl}/streaming/upload?filename=${encodeURIComponent(file.name)}`, {
            method: 'GET',
            headers: headers
        });

        const statElement = document.getElementById('stat');

        if (res.ok) {
            const { data } = await res.json();

            // Presigned URL로 파일 업로드
            const uploadRes = await fetch(data.uploadUrl, { method: 'PUT', body: file });

            console.log(data);
            if (uploadRes.ok) {
                if (statElement) statElement.innerHTML = '업로드 성공!';
                toast.success('업로드 성공');
                setFilePath(data.uploadUrl);
                setStep(1);
                setIsLoading(false);
            } else {
                if (statElement) statElement.innerHTML = '업로드 실패!';
                toast.error('업로드 실패');
                setIsLoading(false);
            }
        } else {
            if (statElement) statElement.innerHTML = 'Presigned URL을 받아오는 데 실패했습니다.';
            toast.error('Presigned URL 받아오기 실패');
            setIsLoading(false);
        }
    }

    async function handleImageUpload(file: File) {
        console.log('handleImageUpload called');
        console.log('Files:', file);
        setIsLoading(true);

        const token = GetCookie('accessToken');
        const headers = token ? { 'Authorization': token } : undefined;

// Create a new FormData instance
        const formData = new FormData();

// Append the file to the 'file' field
        formData.append('musicImageFile', file);

        const res = await fetch(`${requestUrl}/album/upload`, {
            method: 'POST',
            body: formData,  // Pass the FormData instance as the body
            headers: headers
        });
        const statElement = document.getElementById('stat');

        const { data } = await res.json();

        if (res.ok) {
            if (statElement) statElement.innerHTML = '업로드 성공!';
            toast.success('업로드 성공');
            setImagePath(data);
            onClose();
            setIsLoading(false);
        } else {
            if (statElement) statElement.innerHTML = '업로드 실패!';
            toast.error('업로드 실패');
            setIsLoading(false);
        }
    }

    const onChange = (open:boolean) =>{
        if(!open){
        }
    }

    return (
        <Modal title='앨범 등록하기' description={step === 0 ? "앨범 파일을 등록해주세요." : "앨범 이미지를 변경해주세요."} isOpen={isOpen}  onChange={onChange}>
            <HorizontalLinearAlternativeLabelStepper activeStep={step}/>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                step === 0 ? (
                    <>
                        <Divider variant="middle" style={{background: 'gray'}}/>
                        <p className="text-center m-3">
                            앨범 파일의 크기는 50MB 미만<br/>
                            앨범 확장자 ( MP3 , MP4 , WAV )
                        </p>
                        <Divider variant="middle" style={{background: 'gray'}}/>
                        <div className="container">
                            <div className="flex flex-col">
                                <div className="flex flex-col m-5 items-center">
                                    <DropzoneArea
                                        filesLimit={1}
                                        dropzoneText={""}
                                        acceptedFiles={['audio/*']}
                                        maxFileSize={50000000}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                handleAudioUpload(files[0]);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Add the content for the next step here
                    <div>
                        <Divider variant="middle" style={{background: 'gray'}}/>
                        <p className="text-center m-3">
                            앨범 이미지의 크기는 10MB 미만<br/>
                        </p>
                        <Divider variant="middle" style={{background: 'gray'}}/>
                        <div className="container">
                            <div className="flex flex-col">
                                <div className="flex flex-col m-5 items-center">
                                    <DropzoneArea
                                        filesLimit={1}
                                        dropzoneText={""}
                                        acceptedFiles={['image/*']}
                                        maxFileSize={10000000}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                handleImageUpload(files[0]);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </Modal>
    )
}

export default AlbumReleaseModal