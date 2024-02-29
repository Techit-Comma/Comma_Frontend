import React from 'react'
import { IconType } from 'react-icons'
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';//I think tw merge allows you to do the pass styling in as classnames trick

interface Props{
    icon:IconType;
    label:string;
    active?:boolean;
    href:string;
}

const SidebarItem: React.FC<Props> = ({icon:Icon,label,active,href}) => {
  return (
    <Link href={href} className={twMerge(`flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1`,active && 'text-white')}>
        <Icon size={26}/>
        <p className='truncate w-full'>{label}</p>
    </Link>
  )
}

export default SidebarItem