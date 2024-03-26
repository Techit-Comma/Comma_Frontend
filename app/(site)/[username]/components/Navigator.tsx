"use client";

import { Box, Button, ButtonGroup, Divider, Tab, Tabs } from "@mui/material";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axiosClient from "@/libs/axiosClient";
import toast from "react-hot-toast";
import {useRecoilState} from "recoil";
import {userInfoDataState} from "@/providers/RecoilContextProvider";

interface Props {
  username: string;
  tabValue: string; 
}


const Navigator = ({ username, tabValue }: Props) => {
  const router = useRouter();
  const [value, setValue] = React.useState(tabValue);

  const [userInfo, setUserInfo] = useRecoilState(userInfoDataState);
  const [myPageState, setMyPageState] = useState(false);



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    userInfo.username === username ? setMyPageState(true) : setMyPageState(false);
  }, [username]);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
      >
        <Tab
          value="홈"
          label="홈"
          className="text text-white"
          onClick={() => router.replace(`/${username}`)}
        />
        {myPageState ? (
            <Tab
                value="앨범"
                label="앨범"
                onClick={() => router.replace(`/${username}/album`)}
                className="text text-white"
            />
        ) : (
            <></>
        )}
        <Tab
          value="커뮤니티"
          label="커뮤니티"
          onClick={() => router.replace(`/${username}/community`)}
          className="text text-white"
        />
      </Tabs>
    </Box>
  );
};

export default Navigator;
