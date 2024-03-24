"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { GetCookie } from "@/libs/auth";
import Modal from "@/components/Modal";
import Payment from "./Payment";
import axiosClient from "@/libs/axiosClient";
import { Button } from "@mui/material";

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

    try {
      const response = await axiosClient.post("/credit/charges", {
        chargeAmount,
      });

      const resp = await response.data;

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
          <Button variant="outlined" color="warning" type="submit">
            충전하기
          </Button>
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
