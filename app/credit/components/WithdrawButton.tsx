"use client";

import toast from "react-hot-toast";
import ApplyWithdraw from "./ApplyWithdraw";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import CreditModal from "./CreditModal"


const WithdrawModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const OpenModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    toast.error("출금 신청을 취소하였습니다.");
    setIsOpen(false);
  };

  const finishWithdraw = () => {
    setIsOpen(false);
  };

  return (
      <Box margin={1}>
        <Button variant="outlined" color="primary" onClick={OpenModal}>
          출금하기
        </Button>
        <CreditModal
          onChange={closeModal}
          title="크레딧 출금"
          isOpen={isOpen}
        >
          <ApplyWithdraw onCloseModal={finishWithdraw} />
        </CreditModal>
      </Box>
  );
};

export default WithdrawModal;
