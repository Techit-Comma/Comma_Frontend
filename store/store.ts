import { atom } from "recoil";

export const baseUrl = atom({
  key: "url",
  default: "http://localhost:8090",
});// https://---

export const loginState = atom({
  key: "login",
  default: false,
});

export const usernameState = atom({
  key: "username",
  default: "comma_username",
});

export const memberIdState = atom({
  key: "memberId",
  default: "0",
});

export const nicknameState = atom({
  key: "nickname",
  default: "",
});

export const profileImageUrlState = atom({
  key: "profileImageUrl",
  default: "comma_profileImageUrl",
});

