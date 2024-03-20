import { GetCookie } from "@/libs/auth";
import toast from "react-hot-toast";

interface Props {
  withdrawId: string;
  loadWithdraws: () => void;
}

const ApproveButton = ({ withdrawId, loadWithdraws }: Props) => {
  async function approveWithdraw() { 
    try {
      const accessToken = GetCookie("accessToken");

      if (!accessToken) {
        toast.error("로그인 해주세요.");
        return;
      }

      const response = await fetch(
        `http://localhost:8090/admin/credit/withdraws/${withdrawId}/do`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
          },
        }
      );

      const resp = await response.json();

      if (!response.ok) {
        toast.error(resp.message);
        return;
      }
      loadWithdraws(); 
      toast.success("출금 승인 성공");
    } catch (error) {
      toast.error("출금 승인에 실패하였습니다.");
    }
  }

  return <button onClick={approveWithdraw}>승인</button>; // withdrawId를 함수 내에서 사용하도록 수정
};

export default ApproveButton;
