'use client';
import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Container, Paper, Grid } from '@mui/material';
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { loginState, userInfoState } from "@/providers/RecoilContextProvider";
import { toast } from "react-hot-toast";
import { UserInfos } from "@/types";
import { CheckAccessToken, GetCookie } from "@/libs/auth";
import Input from "@/components/Input";
import ProfileImageChange from "./ProfileImageChange"

function AccountChangeForm() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState(loginState);
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);

    const [isLoading, setIsLoading] = useState(true);
    const [username] = useState(userInfos.username);
    const [nickname, setNickname] = useState(userInfos.nickname);
    const [email, setEmail] = useState(userInfos.email);

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
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box p={2}>
                        <form method="post">
                            <div className="flex flex-col m-2 mb-10">
                                <label htmlFor="username" className="form-label mb-2">아이디</label>
                                <Input type="text" value={username} name="username" />
                            </div>
                            <div className="flex flex-col m-2 mt-10">
                                <label htmlFor="nickname" className="form-label mb-2">닉네임</label>
                                <Input placeholder="닉네임을 입력해주세요" type="text" value={nickname} name="password" readOnly onChange={(event) => setNickname(event.target.value)} />
                            </div>
                            <div className="flex flex-col m-2 mt-5">
                                <label htmlFor="email" className="form-label mb-2">이메일</label>
                                <Input placeholder="이메일을 입력해주세요" type="email" value={email} name="password" onChange={(event) => setEmail(event.target.value)} />
                            </div>
                        </form>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ProfileImageChange />
                </Grid>
            </Grid>
            <Box display="flex" justifyContent="end" mt={4}>
                <Button variant="outlined" color="primary" type="submit" sx={{ mr: 2 }}>수정</Button>
                <Button variant="outlined" color="warning">취소</Button>
            </Box>
        </Container>
    );
}

export default AccountChangeForm;
