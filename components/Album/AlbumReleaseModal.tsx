'use client'
import useAlbumReleaseModal from "@/hooks/useAlbumReleaseModal";
import Modal from "../Modal";
import Divider from '@material-ui/core/Divider';
import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { baseUrl } from "@/store/store";
//MUI 파일 드롭존
import { DropzoneArea } from 'material-ui-dropzone';
//MUI Progress Step
import HorizontalLinearAlternativeLabelStepper from "@/components/Album/AlbumReleaseProgress";
//MUI Circle Progress
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AlbumReleaseModal = () => {
    const {onClose, isOpen} = useAlbumReleaseModal()
    const [step, setStep] = useState(0);
    const [filePath, setFilePath] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (open:boolean) =>{
        if(!open){
            onClose()
        }
    }

    async function handleAudioUpload(file: File) {
        console.log('handleFileUpload called');
        console.log('Files:', file);
        setIsLoading(true);

        const res = await fetch(`${baseUrl}/streaming/upload?filename=${encodeURIComponent(file.name)}`, {
            method: 'GET',
            headers: {
                //'Authorization': getCookie('accessToken'),
            }
        });

        const statElement = document.getElementById('stat');

        if (res.ok) {
            const { data } = await res.json();

            // Presigned URL로 파일 업로드
            const uploadRes = await fetch(data.uploadUrl, { method: 'PUT', body: file });

            if (uploadRes.ok) {
                setFilePath(data.uploadUrl);
                if (statElement) statElement.innerHTML = '업로드 성공!';
                toast.success('업로드 성공');
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

    return (
        <Modal title='앨범 등록하기' description={step === 0 ? "앨범 파일을 등록해주세요." : "앨범 이미지를 변경해주세요."} isOpen={isOpen} onChange={onChange}>
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
                                                console.log('DropzoneArea onChange event triggered');
                                                console.log('File MIME type:', files[0].type);
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
                        <p>앨범 이미지 변경 모달</p>
                        <p>현재 스텝: {step}</p>
                    </div>
                )
            )}
        </Modal>
    )
}

export default AlbumReleaseModal