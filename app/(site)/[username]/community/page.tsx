"use client"

import Header from "@/components/Header";
import UserProfile from "../components/UserProfile";
import Navigator from "../components/Navigator";
import WriteArticle from "./components/WriteArticle"
import ArticleList from "./components/ArtitcleList";
import { useRecoilState } from "recoil";
import { UserInfos } from "@/types";
import { userInfoState } from "@/providers/RecoilContextProvider";
import { Divider } from "@mui/material";

export default function Home({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator tabValue="커뮤니티" username={username} />
        </div>
      </Header>

      <ArticleList username={username} />
    </div>
  );
}
