// hooks/useAlbumDeleteModal.ts
import { create } from 'zustand'

interface AlbumDeleteModalStore {
    isOpen: boolean;
    albumId: string | number | null;
    onOpen: (id: string | number) => void;
    onClose: () => void;
}

const useAlbumDeleteModal = create<AlbumDeleteModalStore>((set) => ({
    isOpen: false,
    albumId: null,
    onOpen: (id: string | number) => set({ isOpen: true, albumId: id }),
    onClose: () => set({ isOpen: false, albumId: null }),
}))

export default useAlbumDeleteModal