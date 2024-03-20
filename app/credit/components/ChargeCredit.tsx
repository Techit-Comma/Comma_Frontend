"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { GetCookie } from '@/libs/auth';
import Modal from '@/components/Modal';
import Payment from './Payment';

const ChargeCredit = () => {
  const router = useRouter();
  const [chargeAmount, setChargeAmount] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [chargeId, setChargeId] = useState('');
  const [chargeCode, setChargeCode] = useState('');
  const [charger, setCharger] = useState('');

  const openModal = () => {
    setOpen(true); 
  }

  const closeModal = () => {
    setOpen(false); 
  }

  const cancelPayment = () => {
    toast.error('결제를 취소하였습니다.')
    setOpen(false); 
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const accessToken = GetCookie('accessToken');

    if (!accessToken) {
      closeModal(); 
      toast.error('로그인이 필요합니다.');
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
      setChargeId(resp.chargeId);
      setChargeCode(resp.chargeCode);
      setCharger(resp.username); 

      openModal(); 

    } catch (error) {
        console.log('Error 발생')
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
      <Modal isOpen={isOpen} onChange={cancelPayment} title='크레딧 충전' description={'충전금액' + chargeAmount} ><Payment username={charger} chargeCode={chargeCode} chargeAmount={chargeAmount} onCloseModal={closeModal} /></Modal>
    </div>
  );
};

export default ChargeCredit;