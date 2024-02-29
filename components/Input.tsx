import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

//we want our input to have all the base functionality of react input with with extra features

//this doc creates that little pop up when we click the + button aka the dark bg and add a song pop up
interface Props extends React.InputHTMLAttributes<HTMLInputElement>{}

const Input = forwardRef<HTMLInputElement, Props>(({
    className,
    type,
    disabled,
    ...props
},ref)=>{
    return(
        <input type={type} className={twMerge(`flex w-full rounded-md bg-neutral-700 border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none`,className)} disabled={disabled} ref={ref} {...props}/>
    )
})

Input.displayName='Input'

export default Input