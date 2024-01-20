import { ScrollArea } from "@/components/ui/scroll-area";

import { api } from "@/utils/api";
import { useEffect, useState } from "react";

import FriendCard from "@/components/friend/friend";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";

const FriendRequests = () => {

    const { data: sessionData, status } = useSession();

    const { data: friendRequests, refetch: refetchFriendRequests } = api.friend.getFriendRequests.useQuery();
    const acceptFriendRequest = api.friend.acceptFriendRequest.useMutation();
    const rejectFriendRequest = api.friend.rejectFriendRequest.useMutation();

    const [friendRequestList, setFriendRequestList] = useState(friendRequests);

    useEffect(() => {
        setFriendRequestList(friendRequests);
    }, [friendRequests]);

    const handleAcceptFriendRequest = async (id: string) => {
        acceptFriendRequest.mutate({ id });
        await refetchFriendRequests();
        setFriendRequestList(friendRequestList?.filter((friendRequest) => friendRequest.id !== id));
    }

    const handleRejectFriendRequest = async (id: string) => {
        rejectFriendRequest.mutate({ id });
        await refetchFriendRequests();
        setFriendRequestList(friendRequestList?.filter((friendRequest) => friendRequest.id !== id));
    }

    return (
        <div className="text-center mt-10 ml-0 lg:ml-5 md:ml-5 xl:ml-5">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">Friend Requests</h1>
            {friendRequestList && friendRequestList.length > 0 ? (
                <ScrollArea className="h-full lg:h-[450px] xl:h-[450px]  flex flex-col justify-center pb-5 mt-10">
                    {friendRequestList?.map((friendRequest) => (
                        <FriendCard key={friendRequest.id} userId={sessionData?.user.id ?? ""} friend={friendRequest} mainButton={"Accept"} alternateButton={"Reject"} handleMain={() => handleAcceptFriendRequest(friendRequest.id)} handleAlternate={() => handleRejectFriendRequest(friendRequest.id)} />
                    ))}
                </ScrollArea>
            ) : (
                <div className="flex flex-col items-center justify-center h-96">
                    <User className="w-20 h-20 text-gray-400" />
                    <p className="text-gray-400 mt-5">No friend requests yet</p>
                </div>
            )}
        </div >
    )
}

export default FriendRequests;