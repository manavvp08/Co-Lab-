import ProjectList from "@/components/project/project-list-profile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";
import ShareProfileButton from "@/components/profile/share-profile-button";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Profile = () => {
    const { data: friends } = api.friend.getFriends.useQuery();

    const { data: sessionData, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }


    return (
        <>
            {sessionData && (
                <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-center">
                        <Avatar>
                            <AvatarImage src={sessionData?.user?.image ?? 'https://github.com/shadcn.png'} />
                            <AvatarFallback>{sessionData?.user?.name}</AvatarFallback>
                        </Avatar>
                        <div className="mt-4 mb-10 flex flex-col justify-center items-center">
                            <h2 className="text-2xl font-bold">{sessionData.user.name}</h2>
                            <p className="text-gray-600 dark:text-gray-200">{sessionData.user.email}</p>
                            <Link
                                href={{
                                    pathname: '/profile/friends/[id]',
                                    query: { id: sessionData?.user?.id },
                                }}
                                className="mt-5 text-indigo-600 hover:underline dark:text-white">
                                {friends?.length} Friends
                            </Link>
                            <div className="flex flex-row items-center justify-center gap-x-5">
                                <Link href={`/profile/${sessionData?.user?.id}`} className={`${buttonVariants()} bg-indigo-600 hover:bg-indigo-700 text-white dark:text-black mt-8`}>View Profile</Link>
                                <ShareProfileButton userId={sessionData.user.id} />
                            </div>
                        </div>
                        <div className="mt-7 mb-10">
                            <h2 className="text-2xl font-bold text-center mb-8">My Projects</h2>
                            <ProjectList userId={sessionData?.user?.id} type={"edit"} />
                        </div>
                    </div >
                </div >
            )}
        </>
    );
}

export default Profile;