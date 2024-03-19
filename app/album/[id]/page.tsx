import Header from "@/components/Header"
import SearchInput from "@/components/SearchInput";
import SearchContent from "@/app/search/components/SearchContent";
import AlbumReleaseForm from "@/app/album/release/components/AlbumReleaseForm";
import {AlbumInfoContent} from "@/app/album/[id]/components/AlbumInfoContent";

const AlbumInfoPage = async () => {
    const handleFormSubmit = (data: any) => {
        // Here, you would typically send the data to the server.
        console.log(data);
    };

    return (
        <div>
            <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
                <Header className="from-bg-neutral-900">
                    <div className="mb-2 flex flex-col gap-y-6">
                        <h1 className="text-white text-3xl font-semibold">앨범 정보</h1>
                        <AlbumInfoContent/>
                    </div>
                </Header>
            </div>
        </div>
    );
};

export default AlbumInfoPage;