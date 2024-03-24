"use client";

import { Button, ButtonGroup, Divider } from "@mui/material";

interface Props {
  username: string;
}

const Navigator = ({ username }: Props) => {
  return (
    <div className="flex item-center">
        <Button href={`/${username}`} sx={{ color: 'white' }} className="text text-xl ms-3">
          홈
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: 'white' }} />
        <Button href={`/${username}/community`} sx={{ color: 'white' }}  className="text text-xl ms-3">
          커뮤니티
        </Button>
    </div>
  );
};

export default Navigator;
