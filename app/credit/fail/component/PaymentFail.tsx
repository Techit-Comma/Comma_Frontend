"use client";

import { useEffect } from "react";
import { GetCookie } from "@/libs/auth";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const PaymentFail = () => {

  const searchParam = useSearchParams(); 
  const code = searchParam.get('code');
  const message = searchParam.get('message');

  return (
    <div className="container my-4 space-y-4">
      <div className="card-body bg-base-100 dark:bg-gray-800">
        <h1 className="mb-3 text-primary-dark dark:text-primary">결제 실패</h1>
        <p className="text-primary-dark dark:text-primary">실패 코드 : {code}</p>
        <p className="text-primary-dark dark:text-primary">실패 원인 : {message}</p>

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

export default PaymentFail;
