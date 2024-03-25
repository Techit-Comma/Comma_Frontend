"use client";

import { Box, Button, ButtonGroup, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import {useRouter} from "next/navigation";

interface Props {
  username: string;
  tabValue: string; 
}


const Navigator = ({ username, tabValue }: Props) => {
  const router = useRouter();
  const [value, setValue] = React.useState(tabValue); 

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

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
        <Tab value="앨범" label="앨범" className="text text-white" />
             onClick={() => router.replace(`/${username}/album`)}/>
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
