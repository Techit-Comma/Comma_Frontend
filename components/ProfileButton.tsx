import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    profileImageUrl?: string;
}

const ProfileButton = forwardRef<HTMLButtonElement, Props>(({
    className,
    children,
    disabled,
    type = 'button',
    profileImageUrl,
    ...props
},ref)=>{
    return(
        <button
            type={type}
            className={twMerge(`w-full rounded-full bg-blue-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`,className)}
            disabled={disabled}
            ref={ref}
            {...props}
            style={{
                backgroundImage: `url(${profileImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {children}
        </button>
    )
})

ProfileButton.displayName = 'ProfileButton'

export default ProfileButton