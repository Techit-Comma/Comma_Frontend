"use client";

import { useEffect } from "react";
import { useState } from "react";
import { GetCookie } from "@/libs/auth";
import Modal from "@/components/Modal";
import ChargeCredit from "./ChargeCredit";
import { toast } from "react-hot-toast";
import WithdrawModal from "./WithdrawButton";

const CreditLogs = () => {
  const [restCredit, setRestCredit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = GetCookie("accessToken");

        const response = await fetch(
          `http://localhost:8090/credit/creditlogs/mine`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.log("not ok");
        }
        const data = await response.json();
        setRestCredit(data.restCredit);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(
          `크레딧 내역을 불러오는 데 실패하였습니다. (${errorObj.message})`
        );
      }
    };

    fetchData();
  }, []);

  const OpenModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    toast.error("크레딧 충전을 취소하였습니다.");
    setIsOpen(false);
  };

  return (
    <div className="mt-2 mb-7 px-6">
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">현재 크레딧</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          {restCredit}
        </div>
      </div>
    </div>
  );
};

export default CreditLogs;
