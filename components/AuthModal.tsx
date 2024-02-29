'use client'
import useAuthModal from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import Modal from "./Modal";
import Input from "@/components/Input";
import Button from '@mui/material/Button';
import {useRecoilState} from "recoil";
import {loginState} from "@/store/store";

const AuthModal = () => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {onClose, isOpen} = useAuthModal()

    useEffect(()=>{
        if(isLogin){
            router.refresh()
            onClose()
        }
    },[isLogin, router, onClose])

    const onChange = (open:boolean) =>{
        if(!open){
            onClose()
        }
    }

    return (
        <Modal title='로그인' description="로그인 후 모든 서비스를 이용해보세요!" isOpen={isOpen} onChange={onChange}>
            <div className="container my-4">
                <div className="flex flex-col">
                    <form method="post">
                        <div className="flex flex-col m-5">
                            <label htmlFor="email" className="form-label mb-2">아이디</label>
                            <Input placeholder="아이디를 입력해주세요" value={id} onChange={(event)=>setId(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-5">
                            <label htmlFor="password" className="form-label mb-2">비밀번호</label>
                            <Input placeholder="비밀번호를 입력해주세요" value={password} onChange={(event)=>setPassword(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-5">
                            <Button variant="outlined" color="primary">로그인</Button>
                        </div>
                        <div className="flex flex-col m-5 items-center">
                            <span className="text-center text-opacity-30 mb-5"> ------ 처음 이용하시나요? ------ </span>
                            <Button className="w-full mb-3" variant="outlined" color="inherit">회원가입</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default AuthModal