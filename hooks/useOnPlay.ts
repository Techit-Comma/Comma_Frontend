import {AlbumData} from "@/types";

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";

//basically when use clicks the button play current song based on id but also create a playlist of the played songs
const useOnPlay = (albums: AlbumData[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const [isLogin, setIsLogin] = useRecoilState(loginState);

  return (album: AlbumData) => {
    console.log(album);
    if (!isLogin) {
      return authModal.onOpen();
    }

    player.setAlbum(album);
    player.setAlbums(albums?.map((album) => album));
  };
};

export default useOnPlay;