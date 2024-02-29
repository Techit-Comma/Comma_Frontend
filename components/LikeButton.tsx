'use client'

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props{
    songId: string;
}

const LikeButton = ({songId}:Props) => {

    const router = useRouter()
    const { supabaseClient } = useSessionContext()
    const authModal = useAuthModal()
    const { user } = useUser()

    const [isLiked, setIsLiked] = useState<boolean>(false)

    useEffect(()=>{
        if(!user?.id){
            return
        }

        const fetchData = async () => {
            //fetch the songs that are liked by current user
            const { data, error } = await supabaseClient.from('liked_songs').select('*').eq('user_id', user.id).eq('song_id', songId).single()

            if(!error && data){
                setIsLiked(true)
            }
        }

        fetchData()
    },[songId, supabaseClient, user?.id])

    const Icon = isLiked ? AiFillHeart : AiOutlineHeart

    const handleLike = async () => {
        if(!user){ //open auth if logged out and try to like
            return authModal.onOpen()
        }

        if(isLiked){
            //pressing like on a liked song will unlike it
            const {error} = await supabaseClient.from('liked_songs').delete().eq('user_id',user.id).eq('song_id',songId)

            if(error){
                toast.error(error.message)
            }else{
                setIsLiked(false)
            }
        }else{
            //like the song aka insert into song
            const {error} = await supabaseClient.from('liked_songs').insert({song_id: songId, user_id: user.id})

            if(error){
                toast.error(error.message)
            }else{
                setIsLiked(true)
                toast.success('Liked!')
            }
        }
        router.refresh()
    }

    return (
        <button className="hover:opacity-75 transition" onClick={handleLike}>
            <Icon color={isLiked ? '#1e40af' : 'white'} size={25}/>
        </button>
    )
}

export default LikeButton