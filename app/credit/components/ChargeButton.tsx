"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import ChargeCredit from "./ChargeCredit";
import { toast } from "react-hot-toast";
import { Button, Box } from "@mui/material";
import CreditModal from "./CreditModal"

const CreditLogs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const OpenModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    toast.error("크레딧 충전을 취소하였습니다.");
    setIsOpen(false);
  };

  return (
      <Box margin={1}>
        <Button variant="outlined" color="warning" onClick={OpenModal}>충전하기</Button>
        <CreditModal
          onChange={closeModal}
          title="크레딧 충전"
          isOpen={isOpen}
        >
          <ChargeCredit onChange={closeModal} />
        </CreditModal>
      </Box>
  );
};

export default CreditLogs;
