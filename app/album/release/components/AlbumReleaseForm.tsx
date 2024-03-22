'use client'

import React, {FormEvent, useEffect, useState} from "react";
import { Box, Typography, Avatar, Grid } from '@material-ui/core';
import Button from "@/components/Button";
import {Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {makeStyles} from '@material-ui/core/styles';
import { useRecoilValue, useRecoilState } from 'recoil';
import {imagePathState, filePathState, loginState} from "@/providers/RecoilContextProvider";
import axiosClient from "@/libs/axiosClient";
import {toast} from "react-hot-toast";
import { useRouter } from "next/navigation"
import {CheckAccessToken} from "@/libs/auth";

const useStyles = makeStyles({
    outlinedInput: {
        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
        },
        '& .MuiOutlinedInput-input': {
            color: 'white',
        },
        '& .MuiInputLabel-outlined': {
            color: 'white',
        },
    },
    overlay: {
        zIndex: 0,
    },
});

const AlbumReleaseForm = () => {
    // Album Form
    const [albumname, setTitle] = useState("");
    const [genre, setGenre] = useState("default");
    const [license, setLicense] = useState(false);
    const [licenseDescription, setLicenseDescription] = useState("");
    const [permit, setPermit] = useState(false);
    const [price, setPrice] = useState(0);

    const filePath = useRecoilValue(filePathState);
    const imgPath = useRecoilValue(imagePathState);

    const classes = useStyles();
    const router = useRouter();

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
            toast.error("로그인 후 이용 할 수 있습니다.")
            router.replace('/');
        }
    }, [isLoading, router]);

    // useEffect(() => {
    //     console.log('imagePathState changed:', imgPath);
    //     console.log('filePathState changed:', filePath);
    // }, [imgPath, filePath]);

    async function releaseSubmit()  {
        const formData = new FormData();

        if (formData) {
            try {
                formData.append('albumname', albumname);
                formData.append('filePath', filePath);
                formData.append('imgPath', imgPath);
                formData.append('genre', genre);
                formData.append('license', license ? 'true' : 'false');
                formData.append('licenseDescription', licenseDescription);
                formData.append('permit', permit ? 'true' : 'false');
                formData.append('price', price.toString());

                await axiosClient.post('/album/release', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                toast.success("앨범 등록이 완료되었습니다.");
                router.push("/");
            } catch (error) {
                toast.error('앨범 등록에 실패했습니다.', error);
                return undefined;
            }
        }
    }

    return (
        <form method="post" onSubmit={releaseSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box className="flex flex-col m-5">
                        <Box display="flex" justifyContent="flex-start" alignItems="center" width="400px" height="400px">
                            <Avatar variant="square"
                                    src={imgPath || "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                                    alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} className="flex flex-col">
                    <TextField
                        required
                        variant="outlined"
                        label="앨범 명"
                        value={albumname}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`${classes.outlinedInput} ${classes.overlay}`}
                    />

                    <Box mb={2} />

                    <FormControl variant="outlined" className={classes.outlinedInput}>
                        <InputLabel id="genre-label" className={classes.overlay}>장르</InputLabel>
                        <Select
                            labelId="genre-label"
                            value={genre}
                            label="genre"
                            onChange={(e) => setGenre(e.target.value as string)}
                        >
                            <MenuItem value="default">Default</MenuItem>
                            <MenuItem value="rock">Rock</MenuItem>
                            <MenuItem value="pop">Pop</MenuItem>
                            <MenuItem value="jazz">Jazz</MenuItem>
                            <MenuItem value="classical">Classical</MenuItem>
                        </Select>
                    </FormControl>
                    <Box mt={2} />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={license}
                                    onChange={(e) => setLicense(e.target.checked)}
                                />
                            }
                            label="라이센스"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={permit}
                                    onChange={(e) => setPermit(e.target.checked)}
                                />
                            }
                            label="유료설정"
                        />
                    </FormGroup>
                    {license && (
                        <TextField
                            variant="outlined"
                            label="라이센스 설명"
                            value={licenseDescription}
                            onChange={(e) => setLicenseDescription(e.target.value)}
                            className={classes.outlinedInput}
                        />
                    )}
                    <Box mt={2} />
                    {permit && (
                        <TextField
                            variant="outlined"
                            label="가격"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            className={classes.outlinedInput}
                        />
                    )}
                </Grid>
            </Grid>
            <div>
                <Button type="submit" className='bg-white px-6 py-2 mt-20'>앨범 등록</Button>
            </div>
        </form>
    );
};


export default AlbumReleaseForm;
