'use client'
import useUploadModal from '@/hooks/useUploadModal'
import React from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Modal from './Modal'
import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { toast } from 'react-hot-toast'
import uniqid from 'uniqid'
import { useRouter } from 'next/navigation'
import {loginState} from "@/store/store";
import {useRecoilState} from "recoil";

const UploadModal = () => {

    const uploadModal = useUploadModal()
    const [isLoading, setIsLoading] = useState(false)
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const router = useRouter()

    const {register, handleSubmit, reset} = useForm<FieldValues>({
        defaultValues:{
            author:'',
            title:'',
            song:null,
            image:null
        }
    })

    const onChange = (open:boolean) => {
        if(!open){
            reset()
            uploadModal.onClose()
        }
    }

    const onSubmit: SubmitHandler<FieldValues> =  async (values) => {
        try{
            setIsLoading(true) //I think this is the upload process so if we encounter an error we want to stop uploading 
            const imgFile = values.image?.[0]
            const songFile = values.song?.[0]

            if(!imgFile || !songFile || !isLogin){
                toast.error('Missing fields')
                return
            }

            const uniqueID = uniqid()

            //upload song
            // const {data: songData, error: songError} = await 3supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`,songFile, {cacheControl: '3600', upsert: false})
            //
            // if(songError){
            //     setIsLoading(false)
            //     return toast.error('Failed song upload')
            // }
            //
            // //upload image
            // const {data: imageData, error: imageError} = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`,imgFile, {cacheControl: '3600', upsert: false})
            //
            // if(imageError){
            //     setIsLoading(false)
            //     return toast.error('Failed image upload')
            // }
            // const {error:supabaseError} = await supabaseClient.from('songs').insert({
            //     user_id: user.id,
            //     title:values.title,
            //     author:values.author,
            //     image_path: imageData.path,
            //     song_path: songData.path
            // })
            //
            // if(supabaseError){
            //     setIsLoading(false)
            //     return toast.error(supabaseError.message)
            // }
            //
            // //succesful upload
            // router.refresh()
            // setIsLoading(false)
            // toast.success('Song created!')
            // reset()
            // uploadModal.onClose()


        }catch(error){
            toast.error('Something went wrong')
        }finally{
            //finally defines the code to run whether or not an error is thrown
            setIsLoading(false)
        }


    }

  return (
    <Modal title='Add a song' description='Upload a mp3 file' isOpen={uploadModal.isOpen} onChange={onChange}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'> {/*notice how we specifed the submit function in the form, that means for the submit button itself we dont need an onclick bc we alrdy defined it here*/}
            <Input id='title' disabled={isLoading} {...register('title',{required:true})} placeholder='Song title'/>
            <Input id='author' disabled={isLoading} {...register('author',{required:true})} placeholder='Artist'/>
            <div>
                <div className='pb-1'>Select a song file</div>
                <Input id='song' type='file' disabled={isLoading} {...register('song',{required:true})} accept='.mp3'/>
            </div>
            <div>
                <div className='pb-1'>Upload album cover</div>
                <Input id='image' type='file' disabled={isLoading} {...register('image',{required:true})} accept='image/*'/>
            </div>
            <Button disabled={isLoading} type='submit'>Create</Button>
        </form>
    </Modal>
  )
}

export default UploadModal