"use client";

import { useEffect } from "react";
import { useState } from "react";
import { GetCookie } from "@/libs/auth";
import Modal from "@/components/Modal";
import ChargeCredit from "../charge/components/ChargeCredit";
import { toast } from "react-hot-toast";
import WithdrawModal from "./WithdrawModal"

const CreditLogs = () => {
  const [restCredit, setRestCredit] = useState(null);
  const [creditLogs, setCreditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

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
        setRestCredit(data.restCredit);
        setCreditLogs(data.creditLogDtos.content);
        setTotalPages(data.creditLogDtos.totalPages);
      } catch (error) {
        const errorObj = error as Error;
        toast.error(`크레딧 내역을 불러오는 데 실패하였습니다. (${errorObj.message})`);
      }
    };

    fetchData();
  }, [currentPage]);

  const OpenModal = () => {
    setIsOpen(true); 
  }

  const closeModal = () => {
    toast.error('크레딧 충전을 취소하였습니다.');
    setIsOpen(false); 
  }



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
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold">현재 크레딧</h1>
        {/* <button><a href='credit/charge'>충전하기</a></button> */}
        <button onClick={OpenModal}>충전하기</button>
        <Modal onChange={closeModal} title='크레딧 충전' description="금액을 선택하세요" isOpen={isOpen} ><ChargeCredit /></Modal>
        {/* <button onClick={OpenModal}>출금하기</button> */}
        <WithdrawModal />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
          {restCredit}
        </div>
      </div>
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
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            이전 페이지
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            다음 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditLogs;
