"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { GetCookie } from "@/libs/auth";
import Modal from "@/components/Modal";
import Payment from "./Payment";

interface Props {
  onChange: () => void;
}

const ChargeCredit = ({ onChange }: Props) => {
  const router = useRouter();
  const [chargeAmount, setChargeAmount] = useState("");
  const [isPaymentReady, setPaymentReady] = useState(false);
  const [chargeId, setChargeId] = useState("");
  const [chargeCode, setChargeCode] = useState("");
  const [charger, setCharger] = useState("");

  const paymentReady = () => {
    setPaymentReady(true);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const accessToken = GetCookie("accessToken");

    if (!accessToken) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8090/credit/charges", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },
        body: JSON.stringify({ chargeAmount }),
      });

      if (!response.ok) {
        console.log("NOT OK");
        return;
      }

      const resp = await response.json();
      setChargeId(resp.chargeId);
      setChargeCode(resp.chargeCode);
      setCharger(resp.username);

      paymentReady(); 

    } catch (error) {
      console.log("Error 발생");
    }
  };

  return (
    <div className="container my-4 space-y-4">
      <div className="card-body bg-base-100 dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div>
            <select
              className="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary mb-5"
              name="chargeAmount"
              id="chargeAmount"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              required
            >
              <option value="" disabled>
                충전할 금액을 선택하세요.
              </option>
              <option value="10000">10,000원</option>
              <option value="20000">20,000원</option>
              <option value="30000">30,000원</option>
              <option value="40000">40,000원</option>
              <option value="50000">50,000원</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost"
          >
            충전하기
          </button>
        </form>
      </div>
      {isPaymentReady && (
        <Payment
          username={charger}
          chargeCode={chargeCode}
          chargeAmount={chargeAmount}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default ChargeCredit;
