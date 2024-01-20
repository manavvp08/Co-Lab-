import UserFriends from "@/components/friend/user-friends";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect } from "react";

const Friends = () => {

    const { data: sessionData, status } = useSession();

    const router = useRouter();

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }

    const { id } = router?.query;

    return (
        <div className="mx-20">
            <UserFriends id={id as string} />
        </div>
    )
}

export default Friends;