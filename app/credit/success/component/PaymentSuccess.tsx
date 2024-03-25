"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axiosClient from "@/libs/axiosClient";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const paymentKey = searchParams.get("paymentKey");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          paymentKey,
          orderId,
          amount,
        };

        const response = await axiosClient.post("/credit/confirm", requestData);

        const json = await response.data;

        toast.success("결제가 완료되었습니다.");
        router.replace("/credit?msg=결제가 완료되었습니다.");
      } catch (error) {
        const errorObj = error as Error;
        toast.error(`결제에 실패하였습니다. : (${errorObj.message})`);
      }
    };

    fetchData();
  }, [amount, orderId, paymentKey, router]);

  return (
    <div className="container my-4 space-y-4">
      <div className="card-body bg-base-100 dark:bg-gray-800">
        <h1>결제 성공</h1>
        <p className="text-primary-dark dark:text-primary">
          주문번호 : {orderId}
        </p>
        <p className="text-primary-dark dark:text-primary">
          충전금액 : {amount}
        </p>
        <p className="text-primary-dark dark:text-primary">
          결제키 : {paymentKey}
        </p>
        <a
          className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-3"
          href="/credit"
        >
          돌아가기
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
