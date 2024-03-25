"use client";

import { Box, Button, ButtonGroup, Divider, Tab, Tabs } from "@mui/material";
import React from "react";

interface Props {
  username: string;
}

const Navigator = ({ username }: Props) => {
  const [value, setValue] = React.useState("one");

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
          value="one"
          label="홈"
          className="text text-white"
          href={`/${username}`}
        />
        <Tab value="three" label="앨범" className="text text-white" />
        <Tab
          value="two"
          label="커뮤니티"
          href={`/${username}/community`}
          className="text text-white"
        />
      </Tabs>
    </Box>
  );
};

export default Navigator;