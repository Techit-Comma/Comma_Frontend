import React, { useState, useEffect } from "react";
import Header from "@/components/Header"
import ListItem from "@/components/ListItem"

export const revalidate = 0

export default async function Home() {

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">크레딧 페이지</h1>
      </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="fle justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">출금 신청 내역</h1>
        </div>
        <div>
          {/* 출금 신청 내역 테이블 들어갈 자리  */}
        </div>
      </div>
    </div>
  )
}
