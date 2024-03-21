'use client'

import { Button, Box } from '@mui/material';
import {useRouter} from "next/navigation";
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";
import {CheckAccessToken} from "@/libs/auth";
import {toast} from "react-hot-toast";
import {useEffect, useState} from "react";
import Input from "@/components/Input";
import Divider from "@material-ui/core/Divider";

function PasswordChangeForm() {

    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState(loginState);

    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordCheck, setNewPasswordCheck] = useState("");

    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLogin) {
            toast.error("로그인 후 이용 할 수 있습니다.")
            router.replace('/');
        }
    }, [isLoading, router]);

    return (
        <div className="container mx-auto my-4 space-y-4">
            <div className="flex flex-col items-center">
                <form method="post" className="w-full">
                    <Box display="flex" flexDirection="column" alignItems="start" justifyContent="center">
                        <div className="flex flex-col m-2 mb-10 w-2/3">
                            <label htmlFor="password"
                                   className="form-label mb-2">기존 비밀번호</label>
                            <Input placeholder="기존 비밀번호를 입력해주세요" type="password"
                                   value={password} name="password"
                                   onChange={(event) => setPassword(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-2 mt-10 w-2/3">
                            <label htmlFor="newPassword"
                                   className="form-label mb-2">새 비밀번호</label>
                            <Input placeholder="새 비밀번호를 입력해주세요" type="password"
                                   value={newPassword} name="newPassword"
                                   onChange={(event) => setNewPassword(event.target.value)}/>
                        </div>
                        <div className="flex flex-col m-2 mt-5 w-2/3">
                            <label htmlFor="newPasswordCheck"
                                   className="form-label mb-2 w-full">새 비밀번호 확인</label>
                            <Input placeholder="새 비밀번호를 다시 한 번 입력해주세요" type="password"
                                   value={newPasswordCheck} name="newPasswordCheck"
                                   onChange={(event) => setNewPasswordCheck(event.target.value)}/>
                        </div>

                    </Box>
                    <Box display="flex" justifyContent="end" className="mt-10">
                        <Button variant="outlined" color="primary" type="submit" className="mr-3 w-2/12">
                            수정
                        </Button>
                        <Button variant="outlined" color="warning" className="w-2/12">
                            취소
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
}

export default PasswordChangeForm;
