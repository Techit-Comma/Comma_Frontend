'use client'

import React, { useEffect } from 'react'
import { useState } from 'react'
import AuthModal from '@/components/AuthModal'
import CreatePlaylistModal from '@/components/CreatePlaylistModal'
import AlbumReleaseModal from "@/components/Album/AlbumReleaseModal";
import PlaylistModal from "@/components/PlaylistModal";
import DonationModal from "@/components/DonationModal";
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
          <DonationModal/>
          <CreatePlaylistModal/>
          <AlbumReleaseModal/>
          <AlbumDeleteModal/>
        </>
    )
}

export default ModalProvider