"use client";

import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosClient from "@/libs/axiosClient";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const CreditLogs = () => {
  const [creditLogs, setCreditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(
          `/credit/creditlogs/mine?page=${currentPage}`
        );

        const data = await response.data;

        setCreditLogs(data.creditLogDtos.content);
        setTotalPages(data.creditLogDtos.totalPages);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(
          `크레딧 내역을 불러오는 데 실패하였습니다. (${errorObj.message})`
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
      mode: 'dark', // 다크 모드 사용 설정
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
          크레딧 내역
        </Typography>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor: '#2a3eb1'}}>
            <TableRow>
              <TableCell align="center">날짜</TableCell>
              <TableCell align="center">이벤트 타입</TableCell>
              <TableCell align="center">변동 크레딧</TableCell>
              <TableCell align="center">잔여 크레딧</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creditLogs.map((log: any, index: number) => (
              <TableRow key={index}>
                <TableCell align="center">
                  {format(new Date(log.createDate), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell align="center">{log.eventType}</TableCell>
                <TableCell align="center">{log.creditChangeAmount}</TableCell>
                <TableCell align="center">{log.restCredit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {creditLogs.length === 0 && (
        <Typography variant="body1" color="white">
          크레딧 내역이 없습니다
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

// {format(new Date(log.createDate), "yyyy-MM-dd HH:mm")}

export default CreditLogs;
