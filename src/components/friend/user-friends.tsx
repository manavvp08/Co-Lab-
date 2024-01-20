import { api } from "@/utils/api";
import { useState, useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import FriendCard from "@/components/friend/friend";

const UserFriends = ({ id }: { id: string }) => {

    const { data: friends } = api.friend.getFriendsByUserId.useQuery({ id: id });
    const [friendList, setFriendList] = useState(friends);

    useEffect(() => {
        setFriendList(friends);
    }, [friends]);

    return (
        <div className="text-center mt-10 ml-5 mx-10">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">All Friends</h1>
            {friendList ? (
                <ScrollArea className="h-[450px] flex flex-col pb-5 mt-10">
                    {friendList?.map((friend) => (
                        <FriendCard key={friend.id} userId={id} friend={friend} />
                    ))}
                </ScrollArea>
            ) : (
                <div>
                    <p className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-200">No friends yet</p>
                </div>
            )}

        </div >
    );
}

export default UserFriends;