import { Song } from "@/types";

import usePlayer from "./usePlayer";
//import useSubscribeModal from "./useSubscribeModal";
import useAuthModal from "./useAuthModal";
import {useRecoilState} from "recoil";
import {loginState} from "@/providers/RecoilContextProvider";

//basically when use clicks the button play current song based on id but also create a playlist of the played songs
const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  //const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const [isLogin, setIsLogin] = useRecoilState(loginState);

  const onPlay = (id: string) => {
    if (!isLogin) {
      return authModal.onOpen();
    }

    // if (!subscription) {
    //   return subscribeModal.onOpen();
    // }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }

  return onPlay;
};

export default useOnPlay;