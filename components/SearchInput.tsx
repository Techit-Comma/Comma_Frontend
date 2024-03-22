'use client'

import useDebounce from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import qs from 'query-string'
import Input from "./Input"
import axiosClient from "@/libs/axiosClient";
import {useRecoilState} from "recoil";
import {searchDataState} from "@/providers/RecoilContextProvider";

const SearchInput = () => {
    const router = useRouter()
    const [value, setValue] = useState<string>('')
    const debouncedValue = useDebounce<string>(value,500)

    const [searchData, setSearchData] = useRecoilState(searchDataState);

    useEffect(()=>{
        const query = { //I guess this is setting the title to be debounced
            title:debouncedValue
        }
        const url = qs.stringifyUrl({url:'/search', query:query}) //remember to work searches you are adding the searched item to the url

        findAlbum();
        router.push(url) //push new url

    },[debouncedValue, router])

    async function findAlbum() {
        if(debouncedValue.length === 0) { return; }

        const params = {
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
        // console.log(response.data.data.length);
    }

    return (
        <Input placeholder="어떤 음악을 찾고 싶으신가요?" value={value} onChange={(event)=>setValue(event.target.value)}/> //this is the input, when it changes it calls use state set function to change value to the new value which gets passed to debounced value which gets passed into a url
    )
}

export default SearchInput