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
        <AlbumInfoContent/>
    );
};

export default AlbumInfoPage;