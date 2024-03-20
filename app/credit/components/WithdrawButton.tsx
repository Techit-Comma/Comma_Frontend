"use client";

import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import ApplyWithdraw from "./ApplyWithdraw";
import { useState } from "react";

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
    <div className="mt-2 mb-7 px-6">
      <div className="mb-2">
        <button onClick={OpenModal}>출금하기</button>
        <Modal
          onChange={closeModal}
          title="크레딧 출금"
          description="출금 신청"
          isOpen={isOpen}
        >
          <ApplyWithdraw onCloseModal={finishWithdraw} />
        </Modal>
      </div>
    </div>
  );
};

export default WithdrawModal;
