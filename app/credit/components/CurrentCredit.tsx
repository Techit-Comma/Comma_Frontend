"use client";

import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosClient from "@/libs/axiosClient";
import PaidIcon from "@mui/icons-material/Paid";
import { Box } from "@mui/material";

const CreditLogs = () => {
  const [restCredit, setRestCredit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/credit/creditlogs/mine`);

        const data = await response.data;
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
        <Box display="flex" justifyContent="center" justifyItems="center" margin={2}>
          <h1 className="text-4xl font-bold text-white">
            <PaidIcon fontSize="large" className="me-3" />
            {restCredit}
          </h1>
        </Box>
      </div>
    </div>
  );
};

export default CreditLogs;
