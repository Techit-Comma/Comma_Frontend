'use client'
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Avatar, Box, Grid, Typography} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {baseUrl} from "@/providers/RecoilContextProvider";
import { usePathname, useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import {Chip, Stack} from "@mui/material";
import {AlbumData} from "@/types";
import Header from "@/components/Header";
import {Player} from "@/components/Player";
import useOnPlay from "@/hooks/useOnPlay";
import PlayButton from "@/components/PlayButton";
import {FaPlay} from "react-icons/fa";

const useStyles = makeStyles({
    // 기존 스타일 유지
    chip: {
        color: 'black !important',
        backgroundColor: 'whitesmoke !important',
        width: '100px',
    },
    Typography: {
        color: 'white',
        fontWeight: 'bold',
    },
    // 재생 버튼 스타일 추가
    playButton: {
        color: 'white', // 버튼 색상
        backgroundColor: '#4caf50', // 버튼 배경색
        '&:hover': {
            backgroundColor: '#388e3c', // 호버 시 배경색
        },
        position: 'fixed'
    },
});

interface Props {
    album: AlbumData
}

export const AlbumInfoContent = ({album}:Props) => {
    const onPlay = useOnPlay([album]);

    const classes = useStyles();

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box className="flex flex-col mt-5  items-center">
                        <Box display="flex" justifyContent="flex-start" alignItems="center"
                             width="400px"
                             height="400px">
                            <Avatar variant="square"
                                    src={album ? album.imgUrl : "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                                    alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                        </Box>
                        <Stack className="m-5" direction="row" spacing={1}>
                            {/*<Chip className={classes.chip} avatar={<Avatar>C</Avatar>} label={`Composer [ ${albumData?.artistNickname} ]`} />*/}
                            <Chip className={classes.chip} label={album?.permit ? '무료' : '유료'}/>
                            <Chip className={classes.chip} label={album?.genre}/>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} className="flex flex-col">
                    <Typography className={classes.Typography} variant="h2" gutterBottom>
                        {album?.albumname}
                    </Typography>

                    <Typography className={classes.Typography} variant="h5" gutterBottom>
                        {album?.licenseDescription}
                    </Typography>
                </Grid>
            </Grid>
            <div className="absolute bottom-8 right-10">
                <button className='transition rounded-full flex items-center bg-blue-500 p-4' onClick={()=>onPlay(album)}>
                    <FaPlay className='text-black'/>
                </button>
            </div>
        </div>
    );
};