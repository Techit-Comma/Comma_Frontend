"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { GetCookie } from "@/libs/auth";
import ApproveButton from "./ApproveButton";
import RejectButton from "./RejectButton";
import axiosClient from "@/libs/axiosClient";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
  Pagination,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";

function Withdrawals() {
  const [withdraws, setWithdraws] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadWithdraws = useCallback(async () => {
    try {
      const accessToken = GetCookie("accessToken");

      if (!accessToken) {
        toast.error("로그인 해주세요.");
        return;
      }

      const withdrawsResponse = await axiosClient.get(
        `/admin/credit/withdraws?page=${currentPage}`
      );

      const data = await withdrawsResponse.data;

      setWithdraws(data.withdraws.content);
      setTotalPages(data.withdraws.totalPages);
    } catch (error) {
      toast.error("출금 신청 내역을 불러오는 데 실패하였습니다.");
    }
  }, [currentPage]);

  useEffect(() => {
    loadWithdraws();
  }, [currentPage, loadWithdraws]);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      <div className="flex justify-between items-center">
        <Typography
          variant="h4"
          component="h1"
          color="white"
          fontWeight="bold"
          margin={2}
        >
          출금 신청 내역
        </Typography>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor: '#e0e0e0'}}>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>신청인</TableCell>
              <TableCell>은행명</TableCell>
              <TableCell>계좌번호</TableCell>
              <TableCell>출금신청액</TableCell>
              <TableCell>처리상태</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {withdraws.map((log: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(log.applyDate).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>{log.applicantName}</TableCell>
                <TableCell>{log.bankName}</TableCell>
                <TableCell>{log.bankAccountNo}</TableCell>
                <TableCell>{log.withdrawAmount}</TableCell>
                <TableCell>
                  {log.withdrawDoneDate ? "출금 완료" : ""}
                  {log.withdrawCancelDate ? "출금 거절" : ""}
                  {log.withdrawDoneDate === null &&
                  log.withdrawCancelDate === null
                    ? "미처리"
                    : ""}
                </TableCell>
                {log.withdrawDoneDate === null &&
                  log.withdrawCancelDate === null && (
                    <TableCell>
                      <ApproveButton
                        withdrawId={log.id}
                        loadWithdraws={loadWithdraws}                      
                      />
                      <RejectButton
                        withdrawId={log.id}
                        loadWithdraws={loadWithdraws}
                      />
                    </TableCell>
                  )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {withdraws.length === 0 && (
        <Typography variant="body1" color="white">
          출금 신청 내역이 없습니다
        </Typography>
      )}

      <Box display="flex" justifyContent="center" margin={1}>
        <Pagination
          count={totalPages}
          color="primary"
          variant="outlined"
          size="large"
          shape="rounded"
          page={currentPage}
          onChange={handlePage}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#fff",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#3f51b5",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default Withdrawals;
