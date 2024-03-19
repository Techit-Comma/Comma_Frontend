import { Button } from "@mui/material";

interface Props{
    username: string
}

const Navigator = ({username}: Props) => {

    return (
        <div className="flex item-center">
            <Button className="text text-xl">홈</Button>
            <Button href={`/${username}/community`} className="text text-xl">커뮤니티</Button>
        </div>

    );
}

export default Navigator; 