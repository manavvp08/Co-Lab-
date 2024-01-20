import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { api } from "@/utils/api";

const MessageInput = ({ chatRoomId }: { chatRoomId: string }) => {

    const createMessageMutation = api.chat.createMessage.useMutation();

    const [newMessage, setNewMessage] = useState('');

    const handleChat = () => {
        console.log('handleChat')
        createMessageMutation.mutate({ chatRoomId: chatRoomId, message: newMessage });
        setNewMessage('');
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    };


    return (
        <div className="mx-5 flex flex-row gap-x-3 mb-3">
            <Input className="" value={newMessage} placeholder="Type your message..." onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} />
            <Button className=" bg-indigo-600 hover:bg-indigo-700" onClick={handleChat}>
                <Send className="w-5 h-5 dark:text-white" />
            </Button>
        </div>
    )
}

export default MessageInput;