'use client';

import {RecoilRoot, atom, RecoilState} from 'recoil';
import React from 'react';
import {UserInfos, PlaylistItem, FollowItem} from "@/types";

export const baseUrl = atom({
  key: "url",
  default: "http://localhost:8090",
});// https://---

export const loginState = atom({
  key: "login",
  default: false,
});

export const userInfoDataState : RecoilState<UserInfos> = atom({
  key: "userInfoDataState",
  default: {
    memberId: "0",
    username: "",
    nickname: "",
    email: "",
    profileImageUrl: "",
  }
});

export const userInfoState = atom({
  key: 'userInfoState',
  default: false,
});


export const followDataState : RecoilState<FollowItem[]> = atom({
  key: "followDataState",
  default: [],
});


export const playlistDataState : RecoilState<PlaylistItem[]> = atom({
  key: 'playlistDataState',
  default: [],
});

export const playlistState = atom({
  key: 'playlistState',
  default: false,
});

export const filePathState = atom({
  key: 'filePathState',
  default: '',
});

export const imagePathState = atom({
  key: 'imagePathState',
  default: '',
});

export const searchDataState = atom({
  key: 'searchDataState',
  default: '',
});

export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
