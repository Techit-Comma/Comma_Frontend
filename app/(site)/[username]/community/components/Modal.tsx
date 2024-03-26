import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {IoMdClose} from 'react-icons/io'    

interface Props{
    isOpen:boolean;
    onChange: (open:boolean) => void;
    title: string;
    children: React.ReactNode
}

//this is created the sign in page aka when the page darks aka change opacity and the signin pop up opens
//or just any pop up page where the regular page is darken and a window pops up, the actual content of the pop up is passed in via children hence modular
const Modal = ({isOpen, onChange, title, children}:Props) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
        <Dialog.Portal>
            <Dialog.Overlay className='bg-neutral-900/90 backdrop-blur-sm fixed inset-0'/>
            <Dialog.Content className='fixed drop-shadow-md border border-neutral-700 top-[50%] left-[50%] max-h-full h-full md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-800 p-[25px] focus:outline-none' >
                <Dialog.Title className='text-2xl text-center font-bold mb-4'>
                    {title}
                </Dialog.Title>
                <div>{children}</div>
                <Dialog.Close asChild>
                    <button className='text-neutral-400 hover:text-white absolute top-[10px] right-[10px] infline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'>
                        <IoMdClose/>
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal