import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardHeader,
} from "@/components/ui/card";

import { Button } from "../ui/button";
import Link from "next/link";
import { type UserType } from "@/types/user";

const FriendCard = ({ friend, mainButton, alternateButton, handleMain, handleAlternate }: { friend: UserType, mainButton?: string, alternateButton?: string, handleMain?: () => void, handleAlternate?: () => void }) => {

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
                query: { id: friend.id },
            }}
        >
            <Card className="w-full h-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform mb-5 flex flex-row justify-between items-center">
                <CardHeader className="flex flex-row justify-center items-center">
                    <div className="flex justify-center items-center w-full">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={friend.image ?? 'https://github.com/shadcn.png'} />
                            <AvatarFallback>{friend.name}</AvatarFallback>
                        </Avatar>
                        <p className="ml-5">{friend.name}</p>
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
            </Card>
        </Link>
    )
}

export default FriendCard;