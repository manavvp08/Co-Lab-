import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import FriendCard from "@/components/friend/user";
import { User } from "lucide-react";

const FriendSuggestions = () => {

    const { data: friendSuggestions, refetch: refetchFriendSuggestions } = api.friend.showSuggestions.useQuery();
    const { data: pendingRequests, refetch: refetchPendingRequests } = api.friend.getPendingRequests.useQuery();
    const { data: friendRequests, refetch: refetchFriendRequests } = api.friend.getFriendRequests.useQuery();
    const sendFriendRequest = api.friend.createFriendRequest.useMutation();

    const [friendSuggestionList, setFriendSuggestionList] = useState(friendSuggestions);

    useEffect(() => {
        setFriendSuggestionList(friendSuggestions);
    }, [friendSuggestions]);

    const handleSendFriendRequest = async (id: string) => {
        sendFriendRequest.mutate({ friendId: id });
        await refetchFriendSuggestions();
        setFriendSuggestionList(friendSuggestionList?.filter((friendSuggestion) => friendSuggestion.id !== id));
    }

    const handleRemoveFriendSuggestion = async (id: string) => {
        await refetchFriendSuggestions();
        setFriendSuggestionList(friendSuggestionList?.filter((friendSuggestion) => friendSuggestion.id !== id));
    }

    return (
        <div className="text-center mt-10 ml-0 lg:ml-5 md:ml-5 xl:ml-5">
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">Friend Suggestions</h1>
            {friendSuggestionList && friendSuggestionList.length > 0 ? (
                <ScrollArea className="h-full lg:h-[450px] xl:h-[450px] flex flex-col pb-5 mt-10">
                    {friendSuggestionList?.filter((friendSuggestion) => {
                        const isPending = pendingRequests?.some((pendingRequest) => pendingRequest.friend.id === friendSuggestion.id);
                        const isRequested = friendRequests?.some((friendRequest) => friendRequest.friend.id === friendSuggestion.id);

                        return !isPending && !isRequested;
                    }).map((friendSuggestion) => (
                        <FriendCard key={friendSuggestion.id} friend={friendSuggestion} mainButton={"Request"} alternateButton={"Remove"} handleMain={() => handleSendFriendRequest(friendSuggestion.id)} handleAlternate={() => handleRemoveFriendSuggestion(friendSuggestion.id)} />
                    ))}

                </ScrollArea>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <User className="w-20 h-20 text-gray-400" />
                    <p className="text-gray-400 mt-5">No friends yet</p>
                </div>
            )}
        </div >
    )
}

export default FriendSuggestions;