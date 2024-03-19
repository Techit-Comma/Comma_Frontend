'use client'

import React, { useState } from "react";
import { Box, Typography, Avatar, Grid } from '@material-ui/core';
import Button from "@/components/Button";
import useAlbumReleaseModal from '@/hooks/useAlbumReleaseModal';
import {useRecoilState} from 'recoil';
import {Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {makeStyles} from '@material-ui/core/styles';

interface AlbumReleaseFormProps {
    filePath: string;
    imagePath: string;
}

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
});

const AlbumReleaseForm: React.FC<AlbumReleaseFormProps> = ({ filePath, imagePath = "" }) => {
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("default");
    const [artist, setArtist] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const albumModal = useAlbumReleaseModal()
    const classes = useStyles();


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
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box className="flex flex-col m-5 items-center">
                        <Box display="flex" justifyContent="flex-start" alignItems="center" width="400px" height="400px">
                            <Avatar variant="square"
                                    src={imagePath || "https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"}
                                    alt="Album Cover" style={{width: '100%', height: '100%'}}/>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} className="flex flex-col">
                    <TextField
                        required
                        variant="outlined"
                        label="앨범 명"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={classes.outlinedInput}
                    />

                    <Box mb={2} />

                    <FormControl variant="outlined" className={classes.outlinedInput}>
                        <InputLabel id="genre-label">장르</InputLabel>
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
                    <TextField
                        required
                        variant="outlined"
                        label="작곡가 명"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className={classes.outlinedInput}
                    />
                    <Box mt={2} />
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="라이센스"/>
                        <FormControlLabel required control={<Checkbox />} label="유료곡" />
                    </FormGroup>
                    <TextField
                        required
                        variant="outlined"
                        label="라이센스 설명"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className={classes.outlinedInput}
                    />
                    <Box mt={2} />
                    <TextField
                        required
                        variant="outlined"
                        label="가격"
                        type="number"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        className={classes.outlinedInput}
                    />
                </Grid>
            </Grid>
            <div>
                <Button type="submit" className='bg-white px-6 py-2'>앨범 등록</Button>
            </div>
        </form>
    );
};


export default AlbumReleaseForm;
