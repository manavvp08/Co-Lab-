import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import ChatBox from "@/components/chat/chat-box";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "@/components/loading";
import { MessageSquareIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button"
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";

const Chat = () => {
    const { data: chatRooms, refetch: refetchChatRooms } = api.chat.getChatRooms.useQuery();

    useEffect(() => {
        void refetchChatRooms();

        const intervalId = setInterval(() => {
            void refetchChatRooms();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [refetchChatRooms]);

    const { data: sessionData, status } = useSession();

    const router = useRouter();

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }

    const selected = router?.query?.id;


    if (!selected && chatRooms && chatRooms?.length > 0) {
        const firstChatRoomId = chatRooms[0]?.id;
        router.push(`/chat?id=${firstChatRoomId}`).catch(error => {
            console.error("Error navigating to chat:", error);
        });
    }


    return (
        <div className="flex flex-row dark:bg-gray-800">
            <aside id="default-sidebar" className="fixed left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-xl" aria-label="Sidebar">
                <div className="h-full px-5 py-4 overflow-y-auto">
                    <p className="text-xl font-extrabold text-gray-800 mb-6 mt-5 dark:text-white">All Chats</p>
                    <ul className="space-y-2 font-medium">
                        {chatRooms && chatRooms.length > 0 ? (
                            <>
                                {chatRooms?.map((chatRoom) => (
                                    <li key={chatRoom.id}>
                                        <Link className={`flex items-center p-2 rounded-lg dark:hover:text-black  hover:bg-gray-200 ${selected === chatRoom.id ? 'bg-gray-200 dark:text-black' : ''}`}
                                            href={`/chat?id=${chatRoom.id}`}
                                        >
                                            <div className="flex justify-start items-center w-full">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.image : chatRoom.user.image) ?? 'https://github.com/shadcn.png'} />
                                                    <AvatarFallback>{(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.name : chatRoom.user.name)}</AvatarFallback>
                                                </Avatar>
                                                <p className="ml-5">{(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.name : chatRoom.user.name)}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96">
                                <MessageSquareIcon className="w-20 h-20 text-gray-400" />
                                <p className="text-gray-400 mt-5">No chats yet</p>
                            </div>
                        )}
                    </ul>
                </div>
            </aside>
            <div className="block lg:hidden xl:hidden md:hidden top-20 left-5 fixed z-10 lg:translate-x-0 md:translate-x-0 xl:translate-x-0">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle>
                                <p className="text-xl font-extrabold text-gray-800 mb-6 mt-5 dark:text-white">All Chats</p>
                            </SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-screen flex flex-col pb-128">
                            <ul className="space-y-2 font-medium">
                                {chatRooms && chatRooms.length > 0 ? (
                                    <>
                                        {chatRooms?.map((chatRoom) => (
                                            <li key={chatRoom.id} className="dark:hover:text-black">
                                                <Link className={`flex items-center p-2 rounded-lg dark:hover:text-black  hover:bg-gray-200 ${selected === chatRoom.id ? 'bg-gray-200 dark:text-black' : ''}`}
                                                    href={`/chat?id=${chatRoom.id}`}
                                                >
                                                    <div className="flex justify-start items-center w-full">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.image : chatRoom.user.image) ?? 'https://github.com/shadcn.png'} />
                                                            <AvatarFallback>{(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.name : chatRoom.user.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <p className="ml-5">{(chatRoom.user.id === sessionData?.user.id ? chatRoom.friend.name : chatRoom.user.name)}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-96">
                                        <MessageSquareIcon className="w-20 h-20 text-gray-400" />
                                        <p className="text-gray-400 mt-5">No chats yet</p>
                                    </div>
                                )}
                            </ul>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="p-4 ml-0 lg:ml-64 md:ml-64 xl:ml-64 w-screen sm:mr-8 max-h-screen">
                {!chatRooms || chatRooms.length <= 0 && (
                    <div className="flex flex-col items-center justify-center h-96 mt-10">
                        <MessageSquareIcon className="w-20 h-20 text-gray-400" />
                        <p className="text-gray-400 mt-5 mb-5">Find friends to start chatting!</p>
                        <Link className={`${buttonVariants()} bg-indigo-600 hover:bg-indigo-700`} href={`/friends`}>Suggestions</Link>
                    </div>
                )}
                {!selected && (
                    <div className="flex flex-col items-center justify-center h-96 mt-10">
                        <MessageSquareIcon className="w-20 h-20 text-gray-400" />
                        <p className="text-gray-400 mt-5">Select a chat to start messaging</p>
                    </div>
                )}
                {selected && (
                    <ChatBox id={selected as string} />
                )}
            </div>
        </div >
    )
}

export default Chat;