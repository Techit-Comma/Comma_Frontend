"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import axiosClient from "@/libs/axiosClient";
import useDonationModal from "@/hooks/useDonationModal";
import {followDataState, followState, userInfoDataState} from "@/providers/RecoilContextProvider";
import {FollowItem} from "@/types";
import {useRecoilState} from "recoil";

interface Props {
  username: string;
}

const UserProfile = ({ username }: Props) => {
  const donationModal = useDonationModal();
  const [followData, setFollowData] = useRecoilState<FollowItem[]>(followDataState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoDataState)
  const [followUpdate, setFollowUpdate] = useRecoilState(followState);

  const [isFollow, setIsFollow] = useState(false);
  const [myPageState, setMyPageState] = useState(false);
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

    userInfo.username === username ? setMyPageState(true) : setMyPageState(false);
    if (!myPageState) {
      followData.map((data) =>
          data.username === username ? setIsFollow(true) : setIsFollow(false));
    }

  }, [username]);

  async function follow() {
    try {
      await axiosClient.post(`/follow/${username}`);
      toast.success("팔로우 되었습니다.")
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`정보를 불러오는 데 실패하였습니다. (${errorObj.message})`);
    }

    setIsFollow(true);
    setFollowUpdate(true);
  }

  async function unFollow() {
    try {
      await axiosClient.delete(`/follow/${username}`);
      toast.success("팔로우가 취소되었습니다.")
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`정보를 불러오는 데 실패하였습니다. (${errorObj.message})`);
    }

    setIsFollow(false);
    setFollowUpdate(true);
  }


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
        <p className="text text-5xl mb-5">{username}</p>
        {myPageState ? (
            <>
            </>
        ) : (
            <>
              <Button variant="outlined" color="primary" onClick={donationModal.onOpen}>
                후원하기
              </Button>
              {isFollow ? (
                  <Button variant="outlined" color="warning" className="ms-2" onClick={() => unFollow()}>
                    언팔로우
                  </Button>
              ) : (
                  <Button variant="outlined" color="success" className="ms-2" onClick={() => follow()}>
                    팔로우
                  </Button>
              )}
            </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
