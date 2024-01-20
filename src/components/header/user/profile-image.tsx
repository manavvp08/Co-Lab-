import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";

const ProfileImage = () => {

    const { data: sessionData, status } = useSession();

    return (
        <Avatar className="w-8 h-8">
            <AvatarImage src={sessionData?.user?.image ?? 'https://github.com/shadcn.png'} />
            <AvatarFallback>{sessionData?.user?.name}</AvatarFallback>
        </Avatar>
    )
}

export default ProfileImage;