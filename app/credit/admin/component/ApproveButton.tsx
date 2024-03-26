import { GetCookie } from "@/libs/auth";
import axiosClient from "@/libs/axiosClient";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

interface Props {
  withdrawId: string;
  loadWithdraws: () => void;
}

const ApproveButton = ({ withdrawId, loadWithdraws }: Props) => {
  async function approveWithdraw() { 
    try {
      const response = await axiosClient.put(
        `/admin/credit/withdraws/${withdrawId}/do`
      );

      const resp = await response.data;

      loadWithdraws(); 
      toast.success("출금 승인 성공");
    } catch (error) {
      toast.error("출금 승인에 실패하였습니다.");
    }
  }

  return <Button variant="outlined" color="success" onClick={approveWithdraw}>승인</Button>; // withdrawId를 함수 내에서 사용하도록 수정
};

export default ApproveButton;
