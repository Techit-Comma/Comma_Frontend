"use client";

import Image from "next/image";
import { useEffect } from "react";
import { GetCookie } from "@/libs/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import axiosClient from "@/libs/axiosClient";

interface Props {
  username: string;
}

const UserProfile = ({ username }: Props) => {
  const [profileImage, setProfileImage] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/member/${username}`);

        const data = await response.data;
        setProfileImage(data.data.profileImageUrl);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(`정보를 불러오는 데 실패하였습니다. (${errorObj.message})`);
      }
    };

    fetchData();
  }, [username]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="flex items-center">
      <Image
        className="rounded-full"
        src={profileImage}
        width={200}
        height={200}
        alt="프로필 사진"
        onLoad={handleImageLoad}
      />
      <div className="flex-col ms-10">
        <p className="text text-5xl">{username}</p>
        <Button variant="outlined" color="primary">
          후원하기
        </Button>
        <Button variant="outlined" color="warning" className="ms-2">
          팔로우
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
