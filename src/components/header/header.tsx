import Image from "next/image";
import Link from "next/link";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import { Bell, LogIn, LogOut, MessageSquare, Settings, User, Users } from "lucide-react";
import ProfileImage from "./user/profile-image";
import { signOut, useSession } from "next-auth/react";
import { APP_NAME } from "@/data/constants";
import HeaderSearch from "./search";

const Header = () => {
    const { data: sessionData } = useSession();

    return (
        <header className="bg-white dark:bg-gray-900 drop-shadow-lg sticky top-0 z-5 py-2">
            <nav className="mx-auto flex items-center justify-between p-2 lg:px-10" aria-label="Global">

                <div className="flex items-center flex-row gap-x-3">

                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">QUEK</span>
                        <Image src="/logo.jpg" alt="logo" width={50} height={50} />
                    </Link>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/" className="text-sm font-bold leading-6 text-gray-900 dark:text-white">{APP_NAME}</Link>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white">
                                <p>Home</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <HeaderSearch />
                </div>

                {sessionData ? (
                    <div className="flex justify-center items-center gap-x-5">

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/friends" className="text-sm font-bold leading-6 text-gray-900 dark:text-gray-200"><Users /></Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white">
                                    <p className="text-black">Friends</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/notifications" className="text-sm font-bold leading-6 text-gray-900 dark:text-gray-200"><Bell /></Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white">
                                    <p className="text-black">Notifications</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href='/chat' className="text-sm font-bold leading-6 text-gray-900  dark:text-gray-200"><MessageSquare /></Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white">
                                    <p className="text-black">Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Link href="/profile" className="text-sm font-bold leading-6 text-gray-900"><ProfileImage /></Link>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-32 bg-white dark:bg-gray-800">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="dark:hover:bg-gray-400">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>
                                                    <Link href="/profile">Profile</Link>
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="dark:hover:bg-gray-400">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>
                                                    <Link href="/settings">Settings</Link>
                                                </span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="dark:hover:bg-gray-400">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>
                                                    <Button variant={"ghost"} onClick={() => void signOut()} className="dark:hover:bg-transparent">Logout</Button>
                                                </span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TooltipTrigger>
                                <TooltipContent className="bg-white">
                                    <p>Profile</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ) : (
                    <div className="flex justify-center items-center gap-x-5">
                        <Link href="/auth/sign-in" className="flex items-center justify-center flex-row text-md font-bold leading-6 text-gray-900">
                            <span className="mr-2 hidden lg:block dark:text-white">Sign In</span>
                            <LogIn className="w-5 h-5 dark:text-white" />
                        </Link>
                    </div>

                )}

            </nav>
        </header >
    );
}

export default Header;