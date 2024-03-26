"use client";

import axiosClient from "@/libs/axiosClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Pagination,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { format } from "date-fns";

const CreditLogs = () => {
  const [withdrawLogs, setWithdrawLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(
          `/credit/withdraws/mine?page=${currentPage}`
        );

        const data = await response.data;

        setWithdrawLogs(data.withdraws.content);
        setTotalPages(data.withdraws.totalPages);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(
          `출금 신청 내역을 불러오는 데 실패하였습니다. (${errorObj.message})`
        );
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const theme = createTheme({
    palette: {
      mode: "dark", // 다크 모드 사용 설정
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box margin={2}>
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
            <TableHead sx={{ backgroundColor: "#2a3eb1" }}>
              <TableRow>
                <TableCell align="center">날짜</TableCell>
                <TableCell align="center">은행명</TableCell>
                <TableCell align="center">계좌번호</TableCell>
                <TableCell align="center">출금신청액</TableCell>
                <TableCell align="center">처리상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawLogs.map((log: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {format(new Date(log.applyDate), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell align="center">{log.bankName}</TableCell>
                  <TableCell align="center">{log.bankAccountNo}</TableCell>
                  <TableCell align="center">{log.withdrawAmount}</TableCell>
                  <TableCell align="center">
                    {log.withdrawDoneDate ? (
                      <>
                        출금 완료 <br />
                        {new Date(log.withdrawDoneDate).toLocaleDateString(
                          "ko-KR"
                        )}
                      </>
                    ) : log.withdrawCancelDate ? (
                      <>
                        출금 거절 <br />
                        {new Date(log.withdrawCancelDate).toLocaleDateString(
                          "ko-KR"
                        )}
                      </>
                    ) : (
                      "처리중"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {withdrawLogs.length === 0 && (
          <Typography variant="body1" className="text-white">
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
    </ThemeProvider>
  );
};

export default CreditLogs;
