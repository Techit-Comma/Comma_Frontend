import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

const Button = forwardRef<HTMLButtonElement, Props>(({
    className,
    children,
    disabled,
    type = 'button',
    ...props
},ref)=>{
    return(
        //i am so confused I got no idea, I guess all we did was create a custom component that extends the normal html component
        <button type={type} className={twMerge(`w-full rounded-full bg-blue-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className)} disabled={disabled} ref={ref} {...props}>
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button