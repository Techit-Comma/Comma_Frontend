'use client'; 

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { GetCookie } from "@/libs/auth";
import ApproveButton from "./ApproveButton";
import RejectButton from "./RejectButton";

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

      const withdrawsResponse = await fetch(
        `http://localhost:8090/admin/credit/withdraws?page=${currentPage}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
          },
        }
      );

      const data = await withdrawsResponse.json();

      if (!withdrawsResponse.ok) {
        toast.error(data.message);
        return;
      }

      setWithdraws(data.withdraws.content);
      setTotalPages(data.withdraws.totalPages);
    } catch (error) {
      toast.error("출금 신청 내역을 불러오는 데 실패하였습니다.");
    }
  }, [currentPage]); 

  useEffect(() => {
    loadWithdraws();
  }, [currentPage, loadWithdraws]);

  function previousPage() {
    setCurrentPage((n) => Math.max(n - 1, 1));
  }

  function nextPage() {
    setCurrentPage((n) => n + 1);
  }

  function movePage(pageNumber: any) {
    setCurrentPage(pageNumber);
  }

  return (
    <div>
      <p>출금 신청 내역</p>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>신청인</th>
            <th>은행명</th>
            <th>계좌번호</th>
            <th>출금신청액</th>
            <th>처리상태</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {withdraws.map((log: any, index: number) => (
            <tr key={index}>
              <td>{new Date(log.applyDate).toLocaleDateString("ko-KR")}</td>
              <td>{log.applicantName}</td>
              <td>{log.bankName}</td>
              <td>{log.bankAccountNo}</td>
              <td>{log.withdrawAmount}</td>
              <td>
                {log.withdrawDoneDate ? "출금 완료" : ""}
                {log.withdrawCancelDate ? "출금 거절" : ""}
                {log.withdrawDoneDate === null && log.withdrawCancelDate === null
                  ? "미처리"
                  : ""}
              </td>
              {log.withdrawDoneDate === null && log.withdrawCancelDate === null && (
                <td>
                  <ApproveButton withdrawId={log.id} loadWithdraws={loadWithdraws} />
                  <RejectButton withdrawId={log.id} loadWithdraws={loadWithdraws} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {currentPage > 1 && <button onClick={previousPage}>이전 페이지</button>}
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => movePage(index + 1)}>
            {index + 1}
          </button>
        ))}
        {currentPage < totalPages && <button onClick={nextPage}>다음 페이지</button>}
      </div>
    </div>
  );
}

export default Withdrawals;
