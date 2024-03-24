import useLoadImage from "@/hooks/useLoadImage"
import usePlayer from "@/hooks/usePlayer"
import { Song } from "@/types"
import Image from "next/image"
import {useRouter} from "next/navigation";

interface Props{
    data: Song
    onClick?:(id:string) => void
}

const MediaItem = ({data, onClick}: Props) => {
    const player = usePlayer()
    const router = useRouter();
    // 이미지 URL이 유효한지 확인하는 함수
    const validateImageUrl = (url: string) => {
        try {
            // 이미지 URL이 절대 경로인지 확인합니다.
            // 주의: 이 로직은 클라이언트 사이드에서만 유효하며, 외부 URL에는 적용되지 않습니다.
            new URL(url);
            return url; // 유효한 URL
        } catch (e) {
            return 'https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg'; // 기본 이미지 경로
        }
    }

    const imageUrl = validateImageUrl(data.image_path);

    const handleClick = () => {
        console.log("gdgd");
        router.push("/album/" + data.id);
        // if(onClick){
        //     return onClick(data.id);
        // }
        //
        // // Default: player에 id 설정
        // return player.setId(data.id);
    }

    return (
        <div onClick={handleClick} className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md'>
            <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                <Image fill src={imageUrl} alt='media item' className="object-cover"/>
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate">{data.title}</p>
                <p className="text-neutral-400 text-sm truncate">{data.author}</p>
            </div>
        </div>
    )
}

export default MediaItem;
