'use client'

import useDebounce from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import qs from 'query-string'
import Input from "./Input"
import axiosClient from "@/libs/axiosClient";
import {useRecoilState} from "recoil";
import {searchDataState} from "@/providers/RecoilContextProvider";
import {FormControl, InputLabel, MenuItem, NativeSelect, Select} from "@mui/material";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        // Global settings for InputLabel
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'whitesmoke', // 레이블 텍스트 색상 변경
                },
            },
        },
    },
});

const SearchInput = () => {
    const router = useRouter()
    const [value, setValue] = useState<string>('')
    const debouncedValue = useDebounce<string>(value,500)
    const [searchTag, setSearchTag] = useState("albumName");
    const [searchData, setSearchData] = useRecoilState(searchDataState);

    useEffect(()=>{
        const query = { //I guess this is setting the title to be debounced
            title:debouncedValue
        }
        const url = qs.stringifyUrl({url:'/search', query:query}) //remember to work searches you are adding the searched item to the url

        findAlbum();
        router.push(url) //push new url

    },[debouncedValue, router])

    useEffect(() => {
        findAlbum();
    }, [searchTag]);

    async function findAlbum() {
        if(debouncedValue.length === 0) { return; }

        console.log("find" + debouncedValue);
        console.log("find" + searchTag);
        const params = {
            kwTypes: searchTag,
            kw: debouncedValue,
            page: '1'
        };

        const response = await axiosClient.get('/album/searchAlbum', {
            params: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        setSearchData(response.data.data);
    }

    const handleSearchTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchTag(event.target.value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        검색 태그
                    </InputLabel>
                    <NativeSelect
                        defaultValue={searchTag}
                        onChange={handleSearchTagChange}
                        inputProps={{
                            name: 'searchTag',
                            id: 'uncontrolled-native',
                        }}
                        sx={{ color: 'dimgray' }}  // Add this line
                    >
                        <option value="albumName">앨범 명</option>
                        <option value="albumGenre">앨범 장르</option>
                        <option value="memberNickname">작곡가 닉네임</option>
                    </NativeSelect>
                </FormControl>
            </Box>
            <Input placeholder="어떤 음악을 찾고 싶으신가요?" value={value} onChange={(event)=>setValue(event.target.value)} className="mt-5"/>
        </ThemeProvider>
    )
}

export default SearchInput