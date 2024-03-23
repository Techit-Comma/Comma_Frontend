import { create } from 'zustand';
import {AlbumData} from "@/types";

interface PlayerStore {
  albums: AlbumData[];
  activeAlbum?: AlbumData;
  setAlbum: (album: AlbumData) => void;
  setAlbums: (albums: AlbumData[]) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  albums: [],
  activeAlbum: undefined,
  setAlbum: (album: AlbumData) => set({ activeAlbum: album }),
  setAlbums: (albums: AlbumData[]) => set({ albums }),
  reset: () => set({ albums: [], activeAlbum: undefined })
}));

export default usePlayer;