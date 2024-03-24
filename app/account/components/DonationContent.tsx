'use client'

import { useRouter } from "next/navigation"
import React, {useEffect, useState} from "react";
import {CheckAccessToken, LogoutProcess} from "@/libs/auth";
import {Card, CardContent, Checkbox, Container, FormControlLabel, TextField} from "@mui/material";
import {toast} from "react-hot-toast";
import {useRecoilState} from "recoil";
import {loginState, userInfoState} from "@/providers/RecoilContextProvider";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Box, Grid, Typography} from "@material-ui/core";
import Button from "@mui/material/Button";
import axiosClient from "@/libs/axiosClient";
import {UserInfos} from "@/types";

interface Donation {
    patronUsername: string;
    artistUsername: string;
    amount: number;
    message: string;
    time: string;
}

interface RegularDonation {
    patronUsername: string;
    artistUsername: string;
    executeDay: number;
    amount: number;
    anonymous: boolean;
}

interface DonationUpdate {
    patronName: string;
    artistName: string;
    executeDay: number;
}

const DonationContent = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useRecoilState<boolean>(loginState); // 로그인 상태를 나타내는 state의 타입을 지정합니다.
    const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoState);
    const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태를 나타내는 state의 타입을 지정합니다.
    useEffect(() => {
        // 로그인 상태 확인 로직
        CheckAccessToken().then((loggedIn: boolean) => {
            setIsLogin(loggedIn);
            setIsLoading(false); // 로그인 상태 확인이 완료됨
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !isLogin) {
            toast.error("로그인 후 이용 할 수 있습니다.")
            router.replace('/');
        }
    }, [isLoading, isLogin, router]);

    const handleLogout = async () => {
        await LogoutProcess();
        toast.success("로그아웃 되었습니다!");
        router.push("/");
    }

    const [date] = useState<Date>(new Date()); // Date 타입으로 state를 선언합니다.
    const [donationResponse, setDonationResponse] = useState<Donation[]>([]); // Donation 배열 타입으로 state를 선언합니다.
    const [donationResponseArt, setDonationResponseArt] = useState<Donation[]>([]); // Donation 배열 타입으로 state를 선언합니다.
    const [donationRegularResponse, setDonationRegularResponse] = useState<RegularDonation[]>([]); // RegularDonation 배열 타입으로 state를 선언합니다.
    const [donationUpdate, setDonationUpdate] = useState<DonationUpdate>({ // DonationUpdate 타입으로 state를 선언합니다.
        patronName: userInfos.username as string,
        artistName: "",
        executeDay: 1,
    });
    const [donationUpdateCheck, setDonationUpdateCheck] = useState<boolean[]>([]); // boolean 배열 타입으로 state를 선언합니다.

    useEffect(() => {
        if (!userInfos.username) return;
        const fetchDonations = async () => {
            try {
                const [patronRes, artistRes, regularRes] = await Promise.all([
                    axiosClient.get(`/donation/list/patron/${userInfos.username}`),
                    axiosClient.get(`/donation/list/artist/${userInfos.username}`),
                    axiosClient.get(`/donation/list/patron/${userInfos.username}/regular`),
                ]);
                setDonationResponse(patronRes.data.data);
                setDonationResponseArt(artistRes.data.data);
                setDonationRegularResponse(regularRes.data.data);
                setDonationUpdateCheck(new Array(regularRes.data.data.length).fill(false));
            } catch (error) {
                console.log(error);
            }
        };
        fetchDonations();
    }, [userInfos]);

    const toggleDonationUpdateCheck = (index: number) => {
        const updatedChecks = [...donationUpdateCheck];
        updatedChecks[index] = !updatedChecks[index];
        setDonationUpdateCheck(updatedChecks);
    };

    const handleDonationRegularUpdateRequest = async (donation: Donation) => {
        setDonationUpdate((prev) => ({
            ...prev,
            artistName: donation.artistUsername,
            executeDay: date.getDate(),
        }));
        try {
            const response = await axiosClient.patch(`/donation/regular`, donationUpdate, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success(response.data.data);
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDonationRegularDelete = async (artistName: string, executeDay: number) => {
        setDonationUpdate({ ...donationUpdate, artistName, executeDay });
        try {
            const response = await axiosClient.delete(`/donation/regular`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: donationUpdate,
            });
            toast.success(response.data.data);
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };
    const theme = createTheme({
        palette: {
            mode: 'dark', // 다크 모드 사용 설정
        },
    });

    return (
        <div className="mb-7 px-6">
            <ThemeProvider theme={theme}>
                <Container>
                    <Box sx={{ my: 4, spaceY: 4 }} >
                        <Grid container spacing={2}>
                            {/* 후원 목록 */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" gutterBottom>후원 목록</Typography>
                                {!donationResponse ? (
                                    <Typography>후원 목록이 없습니다.</Typography>
                                ) : (
                                    donationResponse.map(donation => (
                                        <Card sx={{ m: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6">{donation.patronUsername}</Typography>
                                                <Typography>{donation.message}</Typography>
                                                <Typography>{donation.amount}원</Typography>
                                                <Typography>To. {donation.artistUsername}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Grid>

                            {/* 후원 받은 목록 */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" gutterBottom>후원 받은 목록</Typography>
                                {!donationResponseArt ? (
                                    <Typography>후원 받은 목록이 없습니다.</Typography>
                                ) : (
                                    donationResponseArt.map(donation => (
                                        <Card sx={{ m: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6">{donation.patronUsername}</Typography>
                                                <Typography>{donation.message}</Typography>
                                                <Typography>{donation.amount}원</Typography>
                                                <Typography>From. {donation.patronUsername}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Grid>

                            {/* 정기 후원 목록 */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" gutterBottom>정기 후원 목록</Typography>
                                {!donationRegularResponse ? (
                                    <Typography>후원 목록이 없습니다.</Typography>
                                ) : (
                                    donationRegularResponse.map((donation, index) => (
                                        <Card sx={{ m: 2 }} key={index}>
                                            <CardContent>
                                                <Typography>Me ➡ {donation.amount}원 ➡ {donation.artistUsername}</Typography>
                                                <Typography>매월 {donation.executeDay}일</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                                    <Button variant="outlined" onClick={() => handleDonationRegularUpdateRequest(index)}>후원일 수정</Button>
                                                    <Button variant="outlined" onClick={() => handleDonationRegularDelete(donation.artistUsername, donation.executeDay)}>후원 취소</Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    )
}

export default DonationContent