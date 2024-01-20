import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Info, PhoneCall, Video } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import ComingSoon from "@/components/coming-soon/coming-soon";

const ChatBox = ({ id }: { id: string }) => {
    const { data: sessionData, status } = useSession();

    const { data: chatRoom, refetch: refetchChatRoom } = api.chat.getChatRoomById.useQuery({ id: id });

    const friendId = chatRoom?.user.id === sessionData?.user.id ? chatRoom?.friend.id : chatRoom?.user.id;
    const { data: friend, refetch: refetchFriend } = api.user.getUserById.useQuery({ id: friendId! });
    const { data: messages, refetch: refetchMessages } = api.chat.getMessages.useQuery({ id: id });

    return (
        <>
            {friend && (
                <div className="shadow-md rounded-lg mt-1 h-full">
                    <div className="top-bar flex items-center justify-between p-4 border-b-2 dark:bg-gray-700">
                        <div className="flex items-center">
                            <div className="mr-4">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={friend?.image ?? 'https://github.com/shadcn.png'} />
                                    <AvatarFallback>{friend?.name}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <p className="text-md font-semibold">{friend?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Button variant={"ghost"} className="mr-4 p-2">
                                <ComingSoon component={<PhoneCall className="w-6 h-6" />} />
                            </Button>

                            <Button variant={"ghost"} className="mr-4 p-2">
                                <ComingSoon component={<Video className="w-6 h-6" />} />
                            </Button>

                            <Button variant={"ghost"} className="mr-4 p-2">
                                <Info className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <ScrollArea className="h-[600px] lg:h-[450px] md:h-[450px] xl:h-[450px] flex flex-col pb-5">
                            <MessageList key={id} chatRoomId={id} messages={messages!} />
                        </ScrollArea>
                        <MessageInput chatRoomId={id} />
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatBox;