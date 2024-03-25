import { GetCookie } from "@/libs/auth";
import axiosClient from "@/libs/axiosClient";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

interface Props {
  withdrawId: string;
  loadWithdraws: () => void;
}

const ApproveButton = ({ withdrawId, loadWithdraws }: Props) => {
  async function rejectWithdraw() {
    try {

      const response = await axiosClient.put(
        `/admin/credit/withdraws/${withdrawId}/reject`
      );

      const resp = await response.data;

      loadWithdraws();
      toast.success("출금 거절 성공");
    } catch (error) {
      toast.error("출금 거절에 실패하였습니다.");
    }
  }

  return <Button variant="outlined" color="warning" onClick={rejectWithdraw}>거절</Button>;
};

export default ApproveButton;
