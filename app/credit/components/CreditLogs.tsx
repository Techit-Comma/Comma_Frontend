"use client";

import { useEffect } from "react";
import { useState } from "react";
import { GetCookie } from "@/libs/auth";
import { toast } from "react-hot-toast";

const CreditLogs = () => {
  const [creditLogs, setCreditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = GetCookie("accessToken");

        const response = await fetch(
          `http://localhost:8090/credit/creditlogs/mine?page=${currentPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          console.log("not ok");
        }
        const data = await response.json();
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
    <div className="mt-2 mb-7 px-6">
      <div className="fle justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">크레딧 내역</h1>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>이벤트 타입</th>
              <th>변동 크레딧</th>
              <th> 잔여 크레딧</th>
            </tr>
          </thead>
          <tbody>
            {creditLogs.map((log: any, index: number) => (
              <tr key={index}>
                <td>{log.createDate}</td>
                <td>{log.eventType}</td>
                <td>{log.creditChangeAmount}</td>
                <td>{log.restCredit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {creditLogs.length === 0 && (
        <p>크레딧 내역이 없습니다</p>
      )}
        <div className="join flex justify-center">
          {totalPages > 0 && (
            <button
              className="join-item btn btn-square"
              onClick={handlePreviousPage}
            >이전 페이지</button>
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
            <button
              className="join-item btn btn-square"
              onClick={handleNextPage}
            >다음 페이지</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditLogs;
