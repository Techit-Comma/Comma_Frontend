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

export const AlbumInfoContent = () => {
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [albumData, setAlbumData] = useState<AlbumData | null>(null);
    const pathname = usePathname();
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
            <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
                <Header className="from-bg-neutral-900">
                    <div className="mb-20 flex flex-col gap-y-6">
                        <h1 className="text-white text-3xl font-semibold">앨범 정보</h1>
                        <div>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box className="flex flex-col mt-5  items-center">
                                        <Box display="flex" justifyContent="flex-start" alignItems="center"
                                             width="400px"
                                             height="400px">
                                            <Avatar variant="square"
                                                    src={albumData ? albumData.imgUrl : "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                                                    alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                                        </Box>
                                        <Stack className="m-5" direction="row" spacing={1}>
                                            {/*<Chip className={classes.chip} avatar={<Avatar>C</Avatar>} label={`Composer [ ${albumData?.artistNickname} ]`} />*/}
                                            <Chip className={classes.chip} label={albumData?.permit ? '무료' : '유료'}/>
                                            <Chip className={classes.chip} label={albumData?.genre}/>
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
                        </div>
                    </div>
                </Header>
            </div>
            <Player albumData={albumData} /> {/* Player 컴포넌트에 albumData prop 전달 */}
        </div>
    );
};