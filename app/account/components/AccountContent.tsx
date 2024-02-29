'use client'

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";

const AccountContent = () => {
    const router = useRouter();
    const { isLoading, subscription, user } = useUser()

    //only for signed in users
    useEffect(()=>{
        if(!isLoading && !user){
            router.replace('/')
        }
    },[isLoading,user,router])

    const handleClick = async () => {
        toast.success('Redirected to customer portal!')
    }

    return (
        <div className="mb-7 px-6">
            <div className="flex flex-col gap-y-4">
                <p>You are currently on the <b>Spotify Premium</b> plan</p>
                <Button className="w-[300px]" onClick={handleClick}>Open Customer Portal</Button>
            </div>
        </div>
    )
}

export default AccountContent