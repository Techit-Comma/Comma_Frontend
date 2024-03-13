'use client'
import useAlbumReleaseModal from "@/hooks/useAlbumReleaseModal";
import { useRouter } from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import Modal from "./Modal";
import Input from "@/components/Input";
import {useRecoilState} from "recoil";
import Button from '@mui/material/Button';
import Divider from '@material-ui/core/Divider';
import { toast } from "react-hot-toast";
import {loginState, baseUrl} from "@/store/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Login} from "@/libs/auth";

const AlbumReleaseModal = () => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {onClose, isOpen} = useAlbumReleaseModal()

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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (formData) {
            const jsonData: {[key: string]: string} = {};
            for (let pair of formData.entries()) {
                jsonData[pair[0]] = pair[1] as string;
            }

            const response = await fetch(requestUrl + `/member/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if(errorData.validMessages !== null){
                    if (errorData.validMessages.username) {
                        toast.error(errorData.validMessages.username);
                        return;
                    }

                    if (errorData.validMessages.password) {
                        toast.error(errorData.validMessages.password);
                        return;
                    }
                }
                toast.error(errorData.message); // Exception 으로 처리 된 message
                return;
            }

            const responseData = await response.json();
            const { username, memberId, accessToken, refreshToken } = responseData.data;

            Login(username, memberId, accessToken, refreshToken, setIsLogin);
            toast.success("로그인 되었습니다.");
            onClose();
        }
    }

    return (
        <Modal title='로그인' description="로그인 후 모든 서비스를 이용해보세요!" isOpen={isOpen} onChange={onChange}>
            <div className="container">
                <div className="flex flex-col">
                    <div className="flex flex-col m-5 items-center">
                        <Button className="w-full !mb-3" variant="outlined" color="inherit" startIcon={<FontAwesomeIcon icon={faGoogle}/>} style={{textTransform: 'none'}}>
                            Google로 계속하기
                        </Button>
                        <Button className="w-full" variant="outlined" color="inherit" startIcon={<FontAwesomeIcon icon={faGithub}/>} style={{textTransform: 'none'}}>
                            Github로 계속하기
                        </Button>
                    </div>
                    <Divider variant="middle" style={{ background: 'gray' }}/>
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="flex flex-col m-5">
                            <label htmlFor="email" className="form-label mb-2">아이디</label>
                            <Input placeholder="아이디를 입력해주세요" value={id} name="username" onChange={(event)=>setId(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-5">
                            <label htmlFor="password" className="form-label mb-2">비밀번호</label>
                            <Input placeholder="비밀번호를 입력해주세요" type="password" value={password} name="password" onChange={(event)=>setPassword(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-5">
                            <Button variant="outlined" color="primary" type="submit"><FontAwesomeIcon icon={faDoorOpen}/>&nbsp;로그인</Button>
                        </div>
                        <div className="flex flex-col m-5 items-center">
                            <span className="text-center text-opacity-30 mb-5"> ------ 처음 이용하시나요? ------ </span>
                            <Button className="w-full mb-3" variant="outlined" color="inherit"><FontAwesomeIcon icon={faUserPlus}/>&nbsp;회원가입</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default AlbumReleaseModal