import Header from "@/components/Header";
import PasswordChangeForm from "@/app/account/modify/components/PasswordChangeForm";

export const revalidate = 0;

const ModifyPassword = async () => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div>
          <h1 className="text-white text-3xl font-semibold">비밀번호 변경</h1>
        </div>
      </Header>
      <PasswordChangeForm />
    </div>
  );
}

export default ModifyPassword
