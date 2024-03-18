"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { toast } from "react-hot-toast";
import { error } from "console";
interface Props {
  username: string;
  chargeCode: string;
  chargeAmount: string;
}

// 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요.
// 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.

// const paymentWidget = PaymentWidget(widgetClientKey, PaymentWidget.ANONYMOUS) // 비회원 결제

export function Payment({ username, chargeCode, chargeAmount }: Props) {
  const widgetClientKey = "test_ck_5OWRapdA8dmGZpoK9jpA3o1zEqZK";
  const customerKey = username;
  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, [customerKey]);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: chargeAmount },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, chargeAmount]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(chargeAmount);
  }, [chargeAmount]);

  const handlePaymentRequest = async () => {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    try {
      await paymentWidget?.requestPayment({
        orderId: chargeCode,
        orderName: "크레딧 충전",
        successUrl: `${window.location.origin}/credit/charge/success`,
        failUrl: `${window.location.origin}/credit/charge/fail`,
      });
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`결제 요청에 실패하였습니다. : (${errorObj.message})`);
    }
  };

  return (
    <div>
      {/* 결제 UI, 이용약관 UI 영역 */}
      <div id="payment-widget" />
      <div id="agreement" />
      {/* 결제하기 버튼 */}
      <button onClick={handlePaymentRequest}>결제하기</button>
    </div>
  );
}

export default Payment;
