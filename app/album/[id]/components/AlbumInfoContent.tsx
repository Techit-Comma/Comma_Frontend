'use client'
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Avatar, Box, Grid, Typography} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {baseUrl} from "@/store/store";
import { usePathname, useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import {Chip, Stack} from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

const useStyles = makeStyles({
    // 기존 스타일 유지
    chip: {
        color: 'black !important',
        backgroundColor: 'whitesmoke !important',
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


type AlbumData = {
    imgUrl: string;
    albumname: string;
    artistNickname: string;
    genre: string;
    licenseDescription: string;
    permit: boolean;
    price: number;
};

export const AlbumInfoContent = () => {
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const classes = useStyles();
    useEffect(() => {
        getAlbumData();
        setIsMounted(true);
    }, [pathname]);

    if (!isMounted) {
        return null;
    }

    async function getAlbumData() {
        // 앨범 ID를 가져오기 위해 경로를 파싱합니다.
        const albumId = pathname.split('/').pop();
        console.log(albumData?.albumname);
        const res = await fetch(`${requestUrl}/album/detail/${albumId}`, {
            method: 'GET'
        });

        if (res.ok) {
            const { data } = await res.json();
            setAlbumData(data);
        } else {
            toast.error('앨범 불러오기 실패');
        }
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box className="flex flex-col m-5 items-center">
                        <Box display="flex" justifyContent="flex-start" alignItems="center" width="400px" height="400px">
                            <Avatar variant="square"
                                    src={albumData ? albumData.imgUrl : "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                                    alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                        </Box>
                        <Stack className="m-5" direction="row" spacing={1}>
                            <Chip className={classes.chip} avatar={<Avatar>C</Avatar>} label={`Composer [ ${albumData?.artistNickname} ]`} />
                            <Chip className={classes.chip} label={albumData?.permit ? '무료' : '유료'} />
                            <Chip className={classes.chip} label={albumData?.genre} />
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} className="flex flex-col">
                    <Typography className={classes.Typography} variant="h2" gutterBottom>
                        {albumData?.albumname}
                    </Typography>

                    <Typography className={classes.Typography} variant="h5" gutterBottom>
                        {albumData?.licenseDescription}
                    </Typography>
                </Grid>
            </Grid>
            {/* 음원 재생 버튼 추가 */}
            <IconButton className={classes.playButton} onClick={() => console.log('음원 재생')}>
                <PlayCircleFilledWhiteIcon fontSize="inherit" style={{ fontSize: 70 }} />
            </IconButton>
        </div>
    );
};