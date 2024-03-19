'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GetCookie } from '@/libs/auth';

interface ApplyWithdrawProps {
    onCloseModal: () => void;
  }

const ApplyWithdraw: React.FC<ApplyWithdrawProps> = ({ onCloseModal }) => {
  const router = useRouter();

  useEffect(() => {
    const handleSubmit = async (event: any) => {
      event.preventDefault();
      
      const form = event.target;
      const bankName = form.elements['bankName'].value;
      const bankAccountNo = form.elements['bankAccountNo'].value;
      const withdrawAmount = form.elements['withdrawAmount'].value;

      const accessToken = GetCookie('accessToken'); 

      if (!accessToken) {
        toast.error('로그인 해주세요.');
        return;
      }

      try {
        const response = await fetch('http://localhost:8090/credit/withdraws', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${accessToken}`
          },
          body: JSON.stringify({ bankName, bankAccountNo, withdrawAmount })
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message);
          return;
        }

        toast.success('출금 신청을 완료하였습니다.');
        onCloseModal();
        router.push('/credit');
      } catch (error) {
        toast.error('출금 신청하는 데 실패하였습니다.');
      }
    };

    const form = document.getElementById('withdrawForm');
    form!.addEventListener('submit', handleSubmit);

    return () => {
      form!.removeEventListener('submit', handleSubmit);
    };
  }, [onCloseModal, router]);

  return (
    <div className="container bg-base-100 dark:bg-gray-800 my-4 w-full">
      <div className="card card-body">
        <div>
          <p className="font-extrabold text-primary-dark dark:text-primary text-3xl mb-3">출금 신청</p>
        </div>
        <form id="withdrawForm">
          <div className="mt-5">
            <label htmlFor="bankName" className="text-primary-dark dark:text-primary me-2"><i className="fa-solid fa-building-columns me-3"></i>은행명 </label>
            <select
              className="select select-bordered w-full max-w-xs bg-base-100 dark:bg-gray-600 text-primary-dark dark:text-primary ms-12"
              name="bankName"
              id="bankName"
              required
            >
              <option value="" disabled selected>은행을 선택하세요</option>
              <option value="신한은행">신한은행</option>
              <option value="국민은행">국민은행</option>
              <option value="하나은행">하나은행</option>
              <option value="우리은행">우리은행</option>
            </select>
          </div>
          <div className="mt-5">
            <label className="text-primary-dark dark:text-primary" htmlFor="bankAccountNo"><i className="fa-solid fa-money-check-dollar me-3"></i> 계좌번호 </label>
            <input
              className="input input-bordered w-10/12 max-w-xs bg-base-100 dark:bg-gray-600 ms-10"
              type="text"
              name="bankAccountNo"
              id="bankAccountNo"
              placeholder="계좌번호를 입력하세요 ('-' 없이)"
              required
            />
          </div>
          <div className="mt-5">
            <label className="text-primary-dark dark:text-primary" htmlFor="withdrawAmount"><i className="fa-solid fa-sack-dollar me-3"></i>출금신청액 </label>
            <input
              className="input input-bordered w-10/12 max-w-xs bg-base-100 dark:bg-gray-600 ms-6"
              type="text"
              name="withdrawAmount"
              id="withdrawAmount"
              placeholder="금액을 입력하세요"
              required
            />
          </div>
          <div className="flex justify-center">
            <button className="btn dark:btn-primary hover:btn-primary dark:hover:btn-ghost mt-5" type="submit"><i className="fa-solid fa-check"></i>출금 신청하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyWithdraw;
