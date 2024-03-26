import Header from "@/components/Header"
import SearchInput from "@/components/SearchInput"
import SearchContent from "./components/SearchContent"

interface Props {
    searchParams: {
        title: string
    }
}

export const revalidate = 0;

const Search = async ({searchParams}: Props) => {

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">검색</h1>
                    <SearchInput/>
                </div>
            </Header>
            <SearchContent/>
        </div>
    )
}

export default Search