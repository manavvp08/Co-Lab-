import { MessageType } from "@/types/message"
import { useSession } from "next-auth/react"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { api } from "@/utils/api"
import { useState } from "react"
import { Input } from "@/components/ui/input"

const Message = ({ message }: { message: MessageType }) => {

    const { data: sessionData, status } = useSession();

    const deleteMessageMutation = api.chat.deleteMessage.useMutation();
    const editMessageMutation = api.chat.editMessage.useMutation();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedMessage, setEditedMessage] = useState<string>(message.message);
    const [editedMessageId, setEditedMessageId] = useState<string>(message.id);

    const handleEdit = ({ id, message }: { id: string, message: string }) => {
        editMessageMutation.mutate({ messageId: id, message });
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEdit({ id: editedMessageId, message: editedMessage });
            setIsEditing(false);
        }
    };

    const handleDelete = ({ id }: { id: string }) => {
        deleteMessageMutation.mutate({ id });
    }

    const handleCopy = async ({ message }: { message: string }) => {
        await navigator.clipboard.writeText(message);
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger
                    key={message.id}
                    className={`p-2 rounded-lg flex ${sessionData?.user.id === message.userId
                        ? 'bg-indigo-600 text-white justify-end self-end max-w-xs'
                        : 'bg-gray-300 text-gray-800 justify-start self-start max-w-xs'
                        }`}
                >
                    {!isEditing ? (
                        <>
                            {message.message}

                        </>
                    ) : (
                        <Input className="bg-transparent border-0 p-0 text-md"
                            value={editedMessage}
                            onChange={(e) => {
                                setEditedMessage(e.target.value);
                                setEditedMessageId(message.id);
                            }}
                            onKeyDown={handleKeyPress}
                            autoFocus={isEditing} />
                    )}
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    {((message.userId === sessionData?.user.id) || !isEditing) && (
                        <ContextMenuItem inset onClick={() => setIsEditing(true)}>
                            Edit
                        </ContextMenuItem>
                    )}
                    {((message.userId === sessionData?.user.id) || !isEditing) && (
                        <ContextMenuItem inset onClick={() => handleDelete({ id: message.id })}>
                            Delete
                        </ContextMenuItem>
                    )}
                    {!isEditing && (
                        <ContextMenuItem inset onClick={() => handleCopy({ message: message.message })}>
                            Copy
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>
        </>
    )
}

export default Message;