'use client'

import useDebounce from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import qs from 'query-string'
import Input from "./Input"

const SearchInput = () => {
    const router = useRouter()
    const [value, setValue] = useState<string>('')
    const debouncedValue = useDebounce<string>(value,500)

    useEffect(()=>{
        const query = { //I guess this is setting the title to be debounced
            title:debouncedValue
        }
        const url = qs.stringifyUrl({url:'/search', query:query}) //remember to work searches you are adding the searched item to the url

        router.push(url) //push new url 
    },[debouncedValue, router])


    return (
        <Input placeholder="What do you want to listen to?" value={value} onChange={(event)=>setValue(event.target.value)}/> //this is the input, when it changes it calls use state set function to change value to the new value which gets passed to debounced value which gets passed into a url
    )
}

export default SearchInput