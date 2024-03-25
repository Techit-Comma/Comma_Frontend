"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GetCookie } from "@/libs/auth";
import axiosClient from "@/libs/axiosClient";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  Select,
} from "@mui/material";

interface ApplyWithdrawProps {
  onCloseModal: () => void;
}

const ApplyWithdraw: React.FC<ApplyWithdrawProps> = ({ onCloseModal }) => {
  const router = useRouter();

  useEffect(() => {
    const handleSubmit = async (event: any) => {
      event.preventDefault();

      const form = event.target;
      const bankName = form.elements["bankName"].value;
      const bankAccountNo = form.elements["bankAccountNo"].value;
      const withdrawAmount = form.elements["withdrawAmount"].value;

      const accessToken = GetCookie("accessToken");

      if (!accessToken) {
        toast.error("로그인 해주세요.");
        return;
      }

      try {
        const response = await axiosClient.post("/credit/withdraws", {
          bankName,
          bankAccountNo,
          withdrawAmount,
        });

        const data = await response.data;

        toast.success("출금 신청을 완료하였습니다.");
        onCloseModal();
        router.push("/credit");
      } catch (error) {
        toast.error("출금 신청하는 데 실패하였습니다.");
      }
    };

    const form = document.getElementById("withdrawForm");
    form!.addEventListener("submit", handleSubmit);

    return () => {
      form!.removeEventListener("submit", handleSubmit);
    };
  }, [onCloseModal, router]);

  return (
    <Box sx={{ width: 400, height: 300}}>
      <form id="withdrawForm">
        <Box display="flex" flexDirection="column" margin={2} sx={{backgroundColor: "#e0e0e0" }}>
          <Box margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="bankName">은행명</InputLabel>
              <Select
                native
                inputProps={{
                  name: "bankName",
                  id: "bankName",
                }}
                required
              >
                <option value="" disabled selected>
                  은행을 선택하세요
                </option>
                <option value="신한은행">신한은행</option>
                <option value="국민은행">국민은행</option>
                <option value="하나은행">하나은행</option>
                <option value="우리은행">우리은행</option>
              </Select>
            </FormControl>
          </Box>
          <Box margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="bankAccountNo">계좌번호</InputLabel>
              <Input
                id="bankAccountNo"
                type="text"
                placeholder="계좌번호를 입력하세요 ('-' 없이)"
                required
              />
            </FormControl>
          </Box>
          <Box margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="withdrawAmount">출금신청액</InputLabel>
              <Input
                id="withdrawAmount"
                type="text"
                placeholder="금액을 입력하세요"
                required
              />
            </FormControl>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button variant="outlined" color="warning" type="submit">
            출금 신청하기
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ApplyWithdraw;
