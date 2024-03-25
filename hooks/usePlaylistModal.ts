import {create} from 'zustand'
import {AlbumData} from "@/types";

interface PlaylistModalStore{
    isOpen:boolean;
    albumId?:number;
    setAlbumId: (albumId: number) => void;
    onOpen:()=>void;
    onClose:()=>void;
}

const usePlaylistModal = create<PlaylistModalStore>((set)=>({
    isOpen: false,
    albumId: undefined,
    setAlbumId: (albumId: number) => set({albumId: albumId}),
    onOpen: () => set({isOpen:true}),
    onClose: () => set({isOpen:false}),
}))

export default usePlaylistModal