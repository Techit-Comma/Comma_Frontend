import Header from "@/components/Header";
import UserProfile from "./components/UserProfile";
import Navigator from "./components/Navigator";

export default async function Home({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username;

  
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator tabValue="홈" username={username} />
        </div>
      </Header>
    </div>
  );
}
