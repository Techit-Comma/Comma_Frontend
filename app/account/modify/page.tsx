import Header from "@/components/Header";
import AccountChangeForm from "@/app/account/modify/components/AccountChangeForm";

export const revalidate = 0;

const ModifyPassword = async () => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">계정 정보 변경</h1>
        </div>
      </Header>
      <AccountChangeForm />
    </div>
  );
}

export default ModifyPassword
