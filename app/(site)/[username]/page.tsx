import Header from "@/components/Header";


export default async function Home({ params }: { params: { slug: string}}) {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">크레딧 페이지</h1>
        </div>
      </Header>
    </div>
  );
}