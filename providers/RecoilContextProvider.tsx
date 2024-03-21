'use client';

import {RecoilRoot, atom, RecoilState} from 'recoil';
import React from 'react';
import {UserInfos} from "@/types";

export const baseUrl = atom({
  key: "url",
  default: "http://localhost:8090",
});// https://---

export const loginState = atom({
  key: "login",
  default: false,
});

export const userInfoState : RecoilState<UserInfos> = atom({
  key: "username",
  default: {
    memberId: "0",
    username: "",
    nickname: "",
    profileImageUrl: "",
  }
});
export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
