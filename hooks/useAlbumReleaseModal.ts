import {create} from 'zustand'

interface AlbumReleaseModalStore{
    isOpen:boolean;
    onOpen:()=>void;
    onClose:()=>void;
}

const useAlbumReleaseModal = create<AlbumReleaseModalStore>((set)=>({
    isOpen: false,
    onOpen: () => set({isOpen:true}),
    onClose: () => set({isOpen:false}),
}))

export default useAlbumReleaseModal