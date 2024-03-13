'use client'

import React, { useState } from "react";
import { Box, Typography, Avatar } from '@material-ui/core';
import Button from "@/components/Button";
import useAlbumReleaseModal from '@/hooks/useAlbumReleaseModal';

const AlbumReleaseForm: React.FC = () => {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const albumModal = useAlbumReleaseModal()
    const onSubmit = (data: any) => {
        // Handle form submission here
        console.log(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, artist, releaseDate, coverImage });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Button onClick={albumModal.onOpen} className='bg-transparent text-neutral-300 font-medium'>Sign
                    Uggp</Button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', margin: 5, width: '50%', position: 'relative'}}>
                <Typography variant="h6">앨범 이미지</Typography>
                <Box display="block" width={256} height={256} position="relative">
                    <Avatar variant="square"
                            src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"
                            alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                </Box>
            </div>

            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album Title"/>
            <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist"/>
            <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)}/>
            <input type="file" onChange={(e) => setCoverImage(e.target.files[0])}/>

            <div>
            <Button type="submit" className='bg-white px-6 py-2'>앨범 등록</Button>
            </div>
        </form>
    );
};

export default AlbumReleaseForm;
