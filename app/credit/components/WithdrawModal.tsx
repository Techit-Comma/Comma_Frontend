"use client";

import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import ApplyWithdraw from "./ApplyWithdraw";
import { useState } from "react";

//this is created the sign in page aka when the page darks aka change opacity and the signin pop up opens
//or just any pop up page where the regular page is darken and a window pops up, the actual content of the pop up is passed in via children hence modular
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

  return(
    <div>
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
  )

};

export default WithdrawModal;
