import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import CreditLogs from "./components/CreditLogs";
import WithdrawLog from "./components/WithdrawLog";

export const revalidate = 0;

export default async function Home() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">크레딧 페이지</h1>
        </div>
      </Header>
      <CreditLogs />
      <WithdrawLog />
    </div>
  );
}
