import axiosClient from "@/libs/axiosClient";
import { userInfoDataState } from "@/providers/RecoilContextProvider";
import { UserInfos } from "@/types";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

function ProfileImageChange() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [userInfos, setUserInfos] = useRecoilState<UserInfos>(userInfoDataState);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    userInfos.profileImageUrl
  );

  useEffect(() => {
    setPreviewUrl(userInfos.profileImageUrl);
  }, [userInfos.profileImageUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = async () => {
    if (!profileImage) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", profileImage);

      const response = await axiosClient.post("/member/setProfileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data: any = response.data;

      setUserInfos((prevState) => ({
        ...prevState,
        profileImageUrl: data.profileImageUrl,
      }));

      toast.success("프로필 이미지가 변경되었습니다.");
    } catch (error) {
      toast.error("프로필 이미지를 변경하는 데 실패했습니다.");
    }
  };

  return (
    <Box p={2} display="flex" flexDirection="column" alignItems="center">
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="profileImage"
          width={300}
          height={300}
          className="rounded-full"
        />
      )}
      <label htmlFor="image-upload">
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <Button
          variant="outlined"
          color="primary"
          component="span"
          className="mt-2"
        >
          이미지 선택
        </Button>
      </label>
      <Button
        variant="outlined"
        color="primary"
        className="mt-2"
        onClick={handleProfileImageChange}
      >
        프로필 변경하기
      </Button>
    </Box>
  );
}

export default ProfileImageChange;
