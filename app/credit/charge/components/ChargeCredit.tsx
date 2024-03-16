"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GetCookie } from '@/libs/auth';
import Modal from '@/components/Modal';
import Payment from './Payment';

const ChargeCredit = () => {
  const router = useRouter();
  const [chargeAmount, setChargeAmount] = useState('');
  const [isOpen, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true); 
  }

  const closeModal = () => {
    console.log('결제를 취소하였습니다.');
    setOpen(false); 
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // 기본 제출 행동 방지

    const accessToken = GetCookie('accessToken');

    if (!accessToken) {
        // 차후 처리 
      return;
    }

    try {
      const response = await fetch('http://localhost:8090/credit/charges', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${accessToken}`,
        },
        body: JSON.stringify({ chargeAmount }),
      });

      if (!response.ok) {
        console.log('NOT OK')
        return;
      }

      const resp = await response.json();
      const chargeId = resp.chargeId;

      openModal(); 

      // await router.push(`/credit/charge/payment?chargeId=${chargeId}`);
    } catch (error) {
        console.log('Error 발생')
    }
  };

  return (
    <div className="container my-4 space-y-4">
      <div className="card-body bg-base-100 dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <label className="label text-2xl text-primary-dark dark:text-primary font-bold mb-2" htmlFor="chargeAmount">
              <i className="fa-solid fa-bolt me-3"></i>크레딧 충전
            </label>
          </div>
          <div>
            <select
              className="select select-bordered w-full max-w-xs text-primary-dark dark:text-primary mb-5"
              name="chargeAmount"
              id="chargeAmount"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              required
            >
              <option value="" disabled>충전할 금액을 선택하세요.</option>
              <option value="10000">10,000원</option>
              <option value="20000">20,000원</option>
              <option value="30000">30,000원</option>
              <option value="40000">40,000원</option>
              <option value="50000">50,000원</option>
            </select>
          </div>
          <button type="submit" className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost">충전하기</button>
        </form>
      </div>
      <Modal isOpen={isOpen} onChange={closeModal} title='크레딧 충전' description={'충전금액' + chargeAmount} ><Payment /></Modal>
    </div>
  );
};

export default ChargeCredit;