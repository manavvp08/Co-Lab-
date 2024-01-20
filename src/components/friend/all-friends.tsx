import { ScrollArea } from "@/components/ui/scroll-area";

import { api } from "@/utils/api";
import { useEffect, useState } from "react";

import FriendCard from "@/components/friend/friend";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

const AllFriends = () => {

    const { data: sessionData, status } = useSession();

    const { data: friends, refetch: refetchFriends } = api.friend.getFriends.useQuery();
    const removeFriend = api.friend.deleteFriend.useMutation();

    const [friendList, setFriendList] = useState(friends);

    useEffect(() => {
        setFriendList(friends);
    }, [friends]);

    const handleRemoveFriend = async (id: string) => {
        removeFriend.mutate({ id });
        await refetchFriends();
        setFriendList(friendList?.filter((friend) => friend.id !== id));
    }

    return (
        <div className="text-center mt-10 ml-0 lg:ml-5 md:ml-5 xl:ml-5">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">All Friends</h1>

            {friendList && friendList.length > 0 ? (
                <ScrollArea className="h-full lg:h-[450px] xl:h-[450px]  flex flex-col pb-5 mt-10">
                    {friendList?.map((friend) => (
                        <FriendCard key={friend.id} userId={sessionData?.user.id ?? ""} friend={friend} mainButton={"Remove"} handleMain={() => handleRemoveFriend(friend.id)} />
                    ))}
                </ScrollArea>
            ) : (
                <div className="flex flex-col items-center justify-center h-96">
                    <User className="w-20 h-20 text-gray-400" />
                    <p className="text-gray-400 mt-5">No friends yet</p>
                </div>
            )}
        </div >
    )
}

export default AllFriends;