import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => { //if no id return
    if (!id) {
      return;
    }

    setIsLoading(true); //loading the song

    const fetchSong = async () => { //fetch the data from the supabase client from the songs table, select * where the id equals the id passed in
      const { data, error } = await supabaseClient.from('songs').select('*').eq('id', id).single();

      if (error) {  //if error
        setIsLoading(false);
        return toast.error(error.message);
      }
      //if no error
      setSong(data as Song);
      setIsLoading(false); //finished loading
    }

    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(() => ({
    isLoading,
    song
  }), [isLoading, song]);
};

export default useGetSongById;