import React, { useState, useEffect } from "react";
import Header from "@/components/Header"
import PaymentSuccess from "./component/PaymentSuccess";

export const revalidate = 0

export default async function Home() {

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">크레딧 충전 성공</h1>
      </div>
      </Header>
      <PaymentSuccess />
    </div>
  )
}
