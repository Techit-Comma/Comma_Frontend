import { atom } from "recoil";

export const baseUrl = atom({
  key: "url",
  default: "http://localhost:8090",
});// https://---

export const loginState = atom({
  key: "login",
  default: false,
});

export const loginUsername = atom({
  key: "username",
  default: "프로필",
});

export const loginMemberId = atom({
  key: "memberId",
  default: "0",
});

