'use client'

import useAlbumReleaseModal from "@/hooks/useAlbumReleaseModal";
import {useEffect} from "react";

export const AlbumModalForm = () => {
    const albumModal = useAlbumReleaseModal()

    useEffect(() => {
        albumModal.onOpen();
    }, []); // Empty dependency array to run the effect only once

    if (!albumModal.isOpen) {
        return null; // If the modal is not open, do not render anything
    }

    return (
        <div>
            {/* Modal content goes here */}
        </div>
    );
};

export default AlbumModalForm;