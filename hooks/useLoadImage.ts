import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

//all this does is go to the database and get a specific image corresponding to a song
const useLoadImage = (song: Song) =>{
    const supabaseClient = useSupabaseClient()

    if(!song){
        return null
    }

    const {data: imageData} = supabaseClient.storage.from('images').getPublicUrl(song.image_path) //remember supabseCLient is an instance of our connection to the db, we are accessing the images and getting the image url

    return imageData.publicUrl
}

export default useLoadImage