import React, { useState } from "react";
import { Loader, Menu, Sparkles, UserPlus, Users } from "lucide-react";
import FriendRequests from "@/components/friend/friend-requests";
import FriendSuggestions from "@/components/friend/friend-suggestions";
import AllFriends from "@/components/friend/all-friends";
import PendingRequests from "@/components/friend/pending-requests";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const Friends = () => {

    const [selected, setSelected] = useState('friend-requests');
    const { data: sessionData, status } = useSession();

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }

    return (
        <div className="flex flex-row dark:bg-gray-800">
            <aside id="default-sidebar" className="fixed left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-xl" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <p className="text-xl font-extrabold text-gray-800 dark:text-white mb-6 mt-5">People</p>

                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-400" onClick={() => setSelected('friend-requests')}>
                                <UserPlus className="w-4 h-4" />
                                <span className="ms-3">Friend Requests</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-400" onClick={() => setSelected('all-friends')}>
                                <Users className="w-4 h-4" />
                                <span className="ms-3">All Friends</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-400" onClick={() => setSelected('pending-requests')}>
                                <Loader className="w-4 h-4" />
                                <span className="ms-3">Pending Requests</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-400" onClick={() => setSelected('friend-suggestions')}>
                                <Sparkles className="w-4 h-4" />
                                <span className="ms-3">Suggestions</span>
                            </a>
                        </li>
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
                                <p className="text-xl font-extrabold text-gray-800 mb-6 mt-5 dark:text-white">People</p>
                            </SheetTitle>
                        </SheetHeader>
                        <ul className="space-y-2 font-medium">
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100" onClick={() => setSelected('friend-requests')}>
                                    <UserPlus className="w-4 h-4" />
                                    <span className="ms-3">Friend Requests</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100" onClick={() => setSelected('all-friends')}>
                                    <Users className="w-4 h-4" />
                                    <span className="ms-3">All Friends</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100" onClick={() => setSelected('pending-requests')}>
                                    <Loader className="w-4 h-4" />
                                    <span className="ms-3">Pending Requests</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-2 rounded-lg  hover:bg-gray-100" onClick={() => setSelected('friend-suggestions')}>
                                    <Sparkles className="w-4 h-4" />
                                    <span className="ms-3">Suggestions</span>
                                </a>
                            </li>
                        </ul>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="p-4 ml-0 lg:ml-64 xl:ml-64 md:ml-64 w-screen sm:mr-8 max-h-screen ">
                {selected === 'friend-requests' && <FriendRequests key={selected} />}
                {selected === 'friend-suggestions' && <FriendSuggestions key={selected} />}
                {selected === 'all-friends' && < AllFriends key={selected} />}
                {selected === 'pending-requests' && <PendingRequests key={selected} />}
            </div>
        </div >
    );
}

export default Friends;