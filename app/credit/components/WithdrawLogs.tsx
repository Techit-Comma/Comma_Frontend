"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetCookie } from "@/libs/auth";

const CreditLogs = () => {
  const [withdrawLogs, setWithdrawLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = GetCookie("accessToken");

        const response = await fetch(
          `http://localhost:8090/credit/withdraws/mine?page=${currentPage}`, // 수정: $currentPage -> currentPage
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message);
        }

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card bg-gray-light dark:bg-gray-800 p-4">
      <h1 className="text-white text-2xl font-semibold">출금 신청 내역</h1>

      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>출금신청액</th>
            <th>처리상태</th>
          </tr>
        </thead>
        <tbody>
          {withdrawLogs.map((log: any, index: number) => (
            <tr key={index}>
              <td>{log.applyDate}</td>
              <td>{log.bankName}</td>
              <td>{log.bankAccountNo}</td>
              <td>{log.withdrawAmount}</td>
              {log.withdrawDoneDate && (
                <td>
                  {log.processResult} <br />
                  {new Date(log.withdrawDoneDate).toLocaleDateString("ko-KR")}
                </td>
              )}
              {log.withdrawCancelDate && (
                <td>
                  {log.processResult} <br />
                  {new Date(log.withdrawCancelDate).toLocaleDateString("ko-KR")}
                </td>
              )}
              {!log.withdrawDoneDate && !log.withdrawCancelDate && (
                <td>처리중</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {withdrawLogs.length === 0 && (
        <p className="flex justify-center">출금 신청 내역이 없습니다</p>
      )}

      <div className="join flex justify-center">
        {totalPages > 0 && (
          <button
            className="join-item btn btn-square"
            onClick={handlePreviousPage}
          >
            이전 페이지
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`join-item btn btn-square${
                pageNumber === currentPage ? " btn-active" : ""
              }`}
              onClick={() => setCurrentPage(pageNumber)} // 수정: movePage -> setCurrentPage
            >
              {pageNumber}
            </button>
          )
        )}
        {totalPages > currentPage && (
          <button className="join-item btn btn-square" onClick={handleNextPage}>
            다음 페이지
          </button>
        )}
      </div>
    </div>
  );
};

export default CreditLogs;
