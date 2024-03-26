'use client'

import useAlbumReleaseModal from "@/hooks/useAlbumReleaseModal";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";

export const AlbumModalForm = () => {
    const albumModal = useAlbumReleaseModal()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLogin) {
            albumModal.onClose();
        }
    }, [isLoading]);

    useEffect(() => {
        albumModal.onOpen();
    }, []); // Empty dependency array to run the effect only once

    if (!albumModal.isOpen) {
        return null; // If the modal is not open, do not render anything
    }

    return (
        <div>
            {/* Modal content goes here */}
        </div>
    );
};

export default AlbumModalForm;