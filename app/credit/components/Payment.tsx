"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { toast } from "react-hot-toast";
import { Box, Button } from "@mui/material";

interface Props {
  username: string;
  chargeCode: string;
  chargeAmount: string;
  onChange: () => void;
}

export function Payment({
                          username,
                          chargeCode,
                          chargeAmount,
                          onChange,
                        }: Props) {
  const widgetClientKey = "test_ck_5OWRapdA8dmGZpoK9jpA3o1zEqZK";
  const customerKey = username;
  const [paymentWidget, setPaymentWidget]: [any, any] = useState(null);
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
    const paymentMethodsWidget: any = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(chargeAmount);
  }, [chargeAmount]);

  const handlePaymentRequest = async () => {
    try {
      setTimeout(async () => {
        onChange();
      }, 1000);

      await paymentWidget?.requestPayment({
        orderId: chargeCode,
        orderName: "크레딧 충전",
        successUrl: `${window.location.origin}/credit/success`,
        failUrl: `${window.location.origin}/credit/fail`,
      });
    } catch (error) {
      const errorObj = error as Error;
      toast.error(`결제 요청에 실패하였습니다. : (${errorObj.message})`);
    }
  };

  return (
      <Box>
        <div id="payment-widget" />
        <div id="agreement" />
        <Box marginTop={2}>
          <Button
              variant="outlined"
              color="warning"
              onClick={handlePaymentRequest}
          >
            결제하기
          </Button>
        </Box>
      </Box>
  );
}

export default Payment;