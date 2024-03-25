'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'
import AuthModal from '@/components/AuthModal'
import PlaylistModal from '@/components/PlaylistModal'
import AlbumReleaseModal from "@/components/Album/AlbumReleaseModal";
import AlbumDeleteModal from "@/components/Album/AlbumDeleteModal";

const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }

    return (
        <>
            <AuthModal/>
            <PlaylistModal/>
            <AlbumReleaseModal/>
            <AlbumDeleteModal/>
        </>
    )
}

export default ModalProvider