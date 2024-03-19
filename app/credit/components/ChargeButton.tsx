"use client";

import { useEffect } from "react";
import { useState } from "react";
import { GetCookie } from "@/libs/auth";
import Modal from "@/components/Modal";
import ChargeCredit from "./ChargeCredit";
import { toast } from "react-hot-toast";
import WithdrawModal from "./WithdrawButton";

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
    <div className="mt-2 mb-7 px-6">
      <div className="mb-2">
        <button onClick={OpenModal}>충전하기</button>
        <Modal
          onChange={closeModal}
          title="크레딧 충전"
          description="금액을 선택하세요"
          isOpen={isOpen}
        >
          <ChargeCredit />
        </Modal>
      </div>
    </div>
  );
};

export default CreditLogs;
