"use client";

import Image from "next/image";
import { useEffect } from "react";
import { GetCookie } from "@/libs/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@mui/material";

interface Props {
  username: string;
}

const UserProfile = ({ username }: Props) => {
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = GetCookie("accessToken");

        if (!accessToken) {
          toast.error("로그인이 필요합니다.");
        }

        const response = await fetch(
          `http://localhost:8090/member/${username}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.log("not ok");
        }
        const data = await response.json();
        setProfileImage(data.data.profileImageUrl);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(`정보를 불러오는 데 실패하였습니다. (${errorObj.message})`);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="flex items-center">
      <Image className="rounded-full" src={profileImage} width={200} height={200} alt="프로필 사진" />
      <div className="flex-col ms-10">
        <p className="text text-5xl">{username}</p>
        <Button variant="contained">후원하기</Button>
        <Button variant="contained">팔로우</Button>
      </div>
    </div>
  );
};

export default UserProfile;
