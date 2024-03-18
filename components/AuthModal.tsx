'use client'
import useAuthModal from "@/hooks/useAuthModal";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import Modal from "./Modal";
import Input from "@/components/Input";
import {useRecoilState} from "recoil";
import Button from '@mui/material/Button';
import Divider from '@material-ui/core/Divider';
import {toast} from "react-hot-toast";
import {baseUrl, loginMemberId, loginState, loginUsername} from "@/store/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Login} from "@/libs/auth";

const AuthModal = () => {
    const router = useRouter()
    const {onClose, isOpen} = useAuthModal();
    // 페이지 및 전역 상태 관리
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [username, setUsername] = useRecoilState(loginUsername);
    const [memberId, setMemberId] = useRecoilState(loginMemberId);
    const [requestUrl, setRequestUrl] = useRecoilState(baseUrl);

    useEffect(()=>{
        if(isLogin){
            router.refresh()
            onClose()
        }
    },[isLogin, router, onClose])

    const onChange = (open:boolean) =>{
        if(!open){
            onClose()
            setFormState(false)
        }
    }

    // Form 상태 변경 / false = 로그인, true = 회원가입
    const [formState, setFormState] = useState(false);

    // Oauth
    async function googleOauth() {
        const response = await fetch(requestUrl + `/oauth/google`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message); // Exception 으로 처리 된 message
            return;
        }

        window.location.href = await response.text();
    }

    async function githubOauth() {
        const response = await fetch(requestUrl + `/oauth/github`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.message); // Exception 으로 처리 된 message
            return;
        }

        window.location.href = await response.text();
    }

    // Login Form
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function loginSubmit(event: FormEvent<HTMLFormElement>) {
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

            Login(username, memberId, accessToken, refreshToken, setIsLogin, setUsername, setMemberId);
            toast.success("로그인 되었습니다.");
            onClose();
        }
    }

    // Join Form
    const [joinId, setJoinId] = useState<string>("");
    const [joinPassword, setJoinPassword] = useState<string>("");
    const [joinPasswordCheck, setJoinPasswordCheck] = useState<string>("");
    const [joinNickname, setJoinNickname] = useState<string>("");
    const [joinEmail, setJoinEmail] = useState<string>("");

    async function joinSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (formData) {
            const jsonData: {[key: string]: string} = {};
            for (let pair of formData.entries()) {
                jsonData[pair[0]] = pair[1] as string;
            }

            const response = await fetch(requestUrl + `/member/join`, {
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

                    if (errorData.validMessages.nickname) {
                        toast.error(errorData.validMessages.nickname);
                        return;
                    }

                    if (errorData.validMessages.password) {
                        toast.error(errorData.validMessages.password);
                        return;
                    }

                    if (errorData.validMessages.email) {
                        toast.error(errorData.validMessages.email);
                        return;
                    }
                }
                toast.error(errorData.message); // Exception 으로 처리 된 message
                return;
            }


            toast.success("회원가입이 완료되었습니다.");
            setFormState(false);
        }
    }

    return (
        <Modal title={formState ? '회원가입' : '로그인'} description={formState ? '회원가입 후 모든 서비스를 이용해보세요!' : '로그인 후 모든 서비스를 이용해보세요!'} isOpen={isOpen} onChange={onChange}>
            <div className="container">
                <div className="flex flex-col">
                    {formState ? (
                        <div>
                            <form method="post" onSubmit={joinSubmit}>
                                <div className="flex flex-col m-5 !mt-0">
                                    <label htmlFor="email" className="form-label mb-2">아이디</label>
                                    <Input placeholder="아이디를 입력해주세요" value={joinId} name="username"
                                           onChange={(event) => setJoinId(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="password"
                                           className="form-label mb-2">비밀번호</label>
                                    <Input placeholder="비밀번호를 입력해주세요" type="password"
                                           value={joinPassword} name="password"
                                           onChange={(event) => setJoinPassword(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="password" className="form-label mb-2">비밀번호
                                        확인</label>
                                    <Input placeholder="비밀번호 다시 한 번 입력해주세요" type="password"
                                           value={joinPasswordCheck} name="passwordCheck"
                                           onChange={(event) => setJoinPasswordCheck(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="password"
                                           className="form-label mb-2">닉네임</label>
                                    <Input placeholder="닉네임을 입력해주세요" type="text" value={joinNickname}
                                           name="nickname"
                                           onChange={(event) => setJoinNickname(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="password"
                                           className="form-label mb-2">이메일</label>
                                    <Input placeholder="이메일을 입력해주세요" type="email" value={joinEmail}
                                           name="email"
                                           onChange={(event) => setJoinEmail(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <Button variant="outlined" color="primary"
                                            type="submit"><FontAwesomeIcon
                                        icon={faUserPlus}/>&nbsp;회원가입</Button>
                                </div>
                            </form>
                            <div className="flex flex-col m-5 mt-0 items-center">
                                <span className="text-center text-opacity-30 mb-5"> ------ 이미 회원이신가요? ------ </span>
                                <Button className="w-full" variant="outlined" color="inherit"
                                        onClick={() => setFormState(!formState)}>
                                    <FontAwesomeIcon
                                        icon={faDoorOpen}/>&nbsp;로그인 하러가기
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col m-5 mt-0 items-center">
                                <Button className="w-full !mb-3" variant="outlined" color="inherit"
                                        startIcon={<FontAwesomeIcon icon={faGoogle}/>}
                                        style={{textTransform: 'none'}} onClick={googleOauth}>
                                    Google로 계속하기
                                </Button>
                                <Button className="w-full" variant="outlined" color="inherit"
                                        startIcon={<FontAwesomeIcon icon={faGithub}/>}
                                        style={{textTransform: 'none'}} onClick={githubOauth}>
                                    Github로 계속하기
                                </Button>
                            </div>
                            <Divider variant="middle" style={{background: 'gray'}}/>
                            <form method="post" onSubmit={loginSubmit}>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="email" className="form-label mb-2">아이디</label>
                                    <Input placeholder="아이디를 입력해주세요" value={id} name="username"
                                           onChange={(event) => setId(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <label htmlFor="password"
                                           className="form-label mb-2">비밀번호</label>
                                    <Input placeholder="비밀번호를 입력해주세요" type="password"
                                           value={password} name="password"
                                           onChange={(event) => setPassword(event.target.value)}/>
                                </div>
                                <div className="flex flex-col m-5">
                                    <Button variant="outlined" color="primary"
                                            type="submit"><FontAwesomeIcon
                                        icon={faDoorOpen}/>&nbsp;로그인</Button>
                                </div>
                            </form>
                            <div className="flex flex-col m-5 mt-0 items-center">
                                <span className="text-center text-opacity-30 mb-5"> ------ 처음 이용하시나요? ------ </span>
                                <Button className="w-full" variant="outlined" color="inherit" onClick={() => setFormState(!formState)}>
                                    <FontAwesomeIcon icon={faUserPlus}/>&nbsp;회원가입
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default AuthModal