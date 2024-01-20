import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useState } from "react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
// import ProjectList from "@/components/project/project-list-profile";
import ViewProjectList from "@/components/project/project-list-view";
import Link from "next/link";
import ShareProfileButton from "@/components/profile/share-profile-button";
import { useEffect } from "react";

const Profile = () => {
    const { data: sessionData, status } = useSession();
    const router = useRouter();
    const { id } = router?.query;

    const { data: friends, refetch: refetchFriends } = api.friend.getFriends.useQuery();
    const { data: userFriends, refetch: refetchUserFriends } = api.friend.getFriendsByUserId.useQuery({ id: id! as string });
    const { data: user, refetch: refetchUser } = api.user.getUserById.useQuery({ id: id as string });

    const { data: exisitngChatRoom } = api.chat.getExistingChatRoom.useQuery({ userId: sessionData?.user?.id ?? '', friendId: id as string ?? '' });

    const sendFriendRequest = api.friend.createFriendRequest.useMutation();

    const createChatRoom = api.chat.createChatRoom.useMutation();

    const [requestSent, setRequestSent] = useState(false);

    if (status === 'loading') {
        return <Loading />
    }

    const handleSendFriendRequest = async (id: string) => {
        sendFriendRequest.mutate({ friendId: id });
        setRequestSent(true);
        await refetchFriends();
        setTimeout(() => {
            setRequestSent(false);
        }, 1000)
    }

    const handleChat = async () => {
        console.log('chat');
        if (exisitngChatRoom) {
            await router.push(`/chat?id=${exisitngChatRoom}`);
        } else {
            try {
                const createdRoomId = await createChatRoom.mutateAsync({
                    userId: sessionData?.user?.id ?? '',
                    friendId: id! as string ?? ''
                });

                await router.push(`/chat?id=${createdRoomId}`);
            } catch (error) {
                console.error("Error creating chat room:", error);
            }
        }
    };

    return (
        <>
            {user && (
                <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-center">
                        <Avatar>
                            <AvatarImage src={user.image ?? 'https://github.com/shadcn.png'} />
                            <AvatarFallback>{user.name}</AvatarFallback>
                        </Avatar>
                        <div className="mt-4 mb-10 flex flex-col justify-center items-center">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-gray-600 dark:text-gray-200">{user.email}</p>
                            <Link
                                href={{
                                    pathname: '/profile/friends/[id]',
                                    query: { id: id },
                                }}
                                className="mt-5 text-indigo-600 hover:underline dark:text-white">
                                {userFriends?.length} Friends
                            </Link>
                            <div className="flex flex-row items-center justify-center gap-x-5">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-8" onClick={handleChat} disabled={user.id === sessionData?.user?.id}>Chat</Button>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-8" onClick={() => handleSendFriendRequest(user.id)} disabled={(requestSent || user.id === sessionData?.user?.id)}>
                                    {user.id === sessionData?.user?.id ? "Add Friend" :
                                        (friends?.some(friend => friend.user.id === sessionData?.user?.id || friend.friend.id === sessionData?.user?.id)) ? "Remove Friend" : "Add Friend"}
                                </Button>
                                <ShareProfileButton userId={id as string} />
                            </div>
                        </div>
                        <div className="mt-7 mb-10">
                            <h2 className="text-2xl font-bold text-center mb-8">View Projects</h2>
                            <ViewProjectList userId={id as string} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;