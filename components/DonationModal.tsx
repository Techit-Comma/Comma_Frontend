'use client'
import React, {FormEvent} from 'react'
import Modal from './Modal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {loginState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {useRecoilState} from "recoil";
import Button from "@mui/material/Button";
import axiosClient from "@/libs/axiosClient";
import useDonationModal from "@/hooks/useDonationModal";
import {Checkbox, Container, FormControlLabel, TextField} from "@mui/material";
import {Box} from "@material-ui/core";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {toast} from "react-hot-toast";

const CreatePlaylistModal = () => {

  const donationModal = useDonationModal()
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoDataState);

  const router = useRouter()

  const onChange = (open:boolean) => {
      if(!open){
          donationModal.onClose()
      }
  }

  const [donationRequest, setDonationRequest] = useState({
    patronName: '',
    anonymous: false,
    artistName: '',
    amount: '',
    message: '',
  });
  const [isRegular, setIsRegular] = useState(false);
  const [date, setDate] = useState(null);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setDonationRequest((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegularChange = (event: FormEvent) => {
    setIsRegular(event.target.checked);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isRegular) {
      try {
        const response = await axiosClient.post(`/donation/regular`, donationRequest, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success(response.data);
        donationModal.onClose()
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axiosClient.post(`/donation/once`, donationRequest, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        toast.success(response.data);
        donationModal.onClose()
      } catch (error) {
        console.log(error);
      }
    }
  }

  const theme = createTheme({
    palette: {
      mode: 'dark', // 다크 모드 사용 설정
    },
  });

  return (
    <Modal title='아티스트에게 후원하기' description='좋아하는 아티스트에게 후원해보세요!' isOpen={donationModal.isOpen} onChange={onChange}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" fullWidth id="username" label="후원자 명" name="patronName" autoComplete="username"
                       autoFocus value={donationRequest.patronName} onChange={handleChange} disabled/>
            <FormControlLabel control={<Checkbox checked={donationRequest.anonymous} onChange={handleChange} name="anonymous" color="primary" />} label="익명 설정" />
            <TextField margin="normal" required fullWidth name="artistName" label="아티스트 명" type="text" id="artistName"
                       autoComplete="artist-name" placeholder="후원 받을 아티스트의 아이디를 입력해주세요."
                       value={donationRequest.artistName} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="amount" label="금액" type="number" id="amount"
                       autoComplete="amount" placeholder="후원하고자 하는 금액을 입력해주세요." value={donationRequest.amount}
                       onChange={handleChange} inputProps={{ step: 1000 }} />
            <FormControlLabel control={<Checkbox checked={isRegular} onChange={handleRegularChange} name="isRegular" color="primary" />} label="정기 후원" />
            {isRegular ? (
                <TextField margin="normal" required fullWidth name="date" label="정기 후원일" type="date" id="date"
                                     value={date} onChange={(e) => setDate(e.target.value)}/>
            ) : (
                <TextField margin="normal" required fullWidth name="message" label="응원 메세지" type="text" id="message"
                           autoComplete="message" placeholder="응원 메세지를 남겨보세요." value={donationRequest.message} onChange={handleChange}/>
            )}
            <Button type="submit" fullWidth variant="outlined" color="primary" sx={{ mt: 3, mb: 2 }}>등록</Button>
          </Box>
        </Container>
      </ThemeProvider>
    </Modal>
  )
}

export default CreatePlaylistModal