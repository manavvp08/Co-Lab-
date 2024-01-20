import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardHeader,
} from "@/components/ui/card";

import { Button } from "../ui/button";
import Link from "next/link";
import { type FriendType } from "@/types/friend";

const FriendCard = ({ userId, friend, mainButton, alternateButton, handleMain, handleAlternate }: { userId: string, friend: FriendType, mainButton?: string, alternateButton?: string, handleMain?: () => void, handleAlternate?: () => void }) => {

    const handleClick = (e: React.MouseEvent, f: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        f();
    };

    return (

        <Link
            key={friend.id}
            href={{
                pathname: '/profile/[id]',
                query: { id: friend.user.id === userId ? friend.friend.id : friend.user.id },
            }}
        >
            <Card className="w-full h-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform flex flex-row justify-between items-center mb-5">
                <CardHeader className="flex flex-row justify-center items-center">
                    <div className="flex justify-center items-center w-full">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={(friend.user.id === userId ? friend.friend.image : friend.user.image) ?? 'https://github.com/shadcn.png'} />
                            <AvatarFallback>{(friend.user.id === userId ? friend.friend.name : friend.user.name)}</AvatarFallback>
                        </Avatar>
                        <p className="ml-5">{(friend.user.id === userId ? friend.friend.name : friend.user.name)}</p>
                    </div>
                </CardHeader>
                <div className="flex flex-row gap-x-3 justify-center items-center mr-5">
                    {mainButton &&
                        <Button className="bg-indigo-600 hover:bg-indigo-700 dark:text-white" onClick={(e) => { handleClick(e, handleMain!) }}>{mainButton}</Button>
                    }
                    {alternateButton &&
                        <Button onClick={(e) => { handleClick(e, handleAlternate!) }}>{alternateButton}</Button>
                    }
                </div>
            </Card >
        </Link>
    )
}

export default FriendCard;
