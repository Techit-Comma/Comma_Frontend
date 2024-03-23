import Header from "@/components/Header"
import AlbumReleaseForm from "./components/AlbumReleaseForm";
import AlbumModalForm from "./components/AlbumModalForm";
import SearchInput from "@/components/SearchInput";
import SearchContent from "@/app/search/components/SearchContent";

const AlbumRegistrationPage = async () => {
    const handleFormSubmit = (data: any) => {
        // Here, you would typically send the data to the server.
        console.log(data);
    };

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">앨범 등록하기</h1>
                    <AlbumModalForm/>
                </div>
            </Header>
            <div className="m-20">
                <AlbumReleaseForm/>
            </div>
        </div>
    )
};

export default AlbumRegistrationPage;