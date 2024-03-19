
import Header from "@/components/Header";
import UserProfile from "../component/UserProfile";
import Navigator from "../component/Navigator";

export default async function Home({ params }: { params: { username: string } }) {  

  const username = params.username; 


  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <UserProfile username={username} />
        <div className="mt-5">
          <Navigator username={username} />
        </div>
      </Header>

      <h1>커뮤니티</h1>
    </div>
  );
}
