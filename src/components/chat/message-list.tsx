import { type MessageType } from "@/types/message";
import { useEffect, useState, useRef, use } from "react";
import { pusherClient } from "@/utils/pusher";
import { useSession } from "next-auth/react";
import { MessageSquareIcon } from "lucide-react";
import Message from "@/components/chat/message";
import { api } from "@/utils/api";

const MessageList = ({ chatRoomId, messages }: { chatRoomId: string, messages: MessageType[] }) => {

    const [originalMessages, setOriginalMessages] = useState<MessageType[]>(messages);
    const [incomingMessages, setIncomingMessages] = useState<MessageType[]>([]);
    const [deletedMessage, setDeletedMessage] = useState<string>('');
    const [updatedMessage, setUpdatedMessage] = useState<MessageType>();

    useEffect(() => {
        setOriginalMessages(messages);
    }, [messages]);

    useEffect(() => {
        const channel = pusherClient.subscribe(chatRoomId);

        const handleIncomingMessage = ({ message }: { message: MessageType }) => {
            setIncomingMessages((prev) => [...prev, message]);
        };

        const handleDeletedMessage = ({ id }: { id: string }) => {
            console.log('deleted message', id);
            setDeletedMessage(id);
        }

        const handleUpdatedMessage = ({ message }: { message: MessageType }) => {
            setUpdatedMessage(message);
            setOriginalMessages((messages) =>
                messages.map((originalMessage) =>
                    originalMessage.id === message.id ? message : originalMessage
                )
            );
            setIncomingMessages((incomingMessages) =>
                incomingMessages.map((incomingMessage) =>
                    incomingMessage.id === message.id ? message : incomingMessage
                )
            );
        };

        channel.bind('incoming-message', handleIncomingMessage);
        channel.bind('deleted-message', handleDeletedMessage);
        channel.bind('updated-message', handleUpdatedMessage);

        return () => {
            channel.unbind('incoming-message', handleIncomingMessage);
            channel.unbind('deleted-message', handleDeletedMessage);
            channel.unbind('updated-message', handleUpdatedMessage);
            pusherClient.unsubscribe(chatRoomId);
        };
    }, []);

    useEffect(() => {
        setIncomingMessages([]);
    }, [messages]);

    return (
        <div className="w-full p-4 flex flex-col gap-y-3">
            {originalMessages
                .filter((message) => message.id !== deletedMessage)
                .map((message) => {
                    const updatedMessageToShow = updatedMessage?.id === message.id ? updatedMessage : message;

                    return (
                        <Message key={updatedMessageToShow.id} message={updatedMessageToShow} />
                    );
                })}

            {incomingMessages
                .filter((message) => message.id !== deletedMessage)
                .map((message) => {
                    const updatedMessageToShow = updatedMessage?.id === message.id ? updatedMessage : message;
                    return (
                        <Message key={updatedMessageToShow.id} message={updatedMessageToShow} />
                    );
                })}

            {!messages.length && !incomingMessages.length && (
                <div className="flex flex-col items-center justify-center h-96">
                    <MessageSquareIcon className="w-20 h-20 text-gray-400" />
                    <p className="text-gray-400 mt-5">No messages yet</p>
                </div>
            )}

        </div>
    )
}

export default MessageList;