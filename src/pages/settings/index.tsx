import { useSession } from "next-auth/react";
import SignOutButton from "@/components/settings/log-out-button";
import DeleteAccountButton from "@/components/settings/delete-account-button";
import Notifications from "@/components/settings/notifications-switch";
import EmailNotifications from "@/components/settings/email-switch";
import Loading from "@/components/loading";
import { useRouter } from "next/router";

const Settings = () => {
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
        <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
            <div className="w-full">
                <div className="text-center mt-20">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">Settings</h1>
                </div>
                <div className="flex flex-col gap-y-4 max-w-lg mx-auto mt-10">
                    <div className="p-4">
                        <h2 className="text-2xl font-semibold mb-7 ml-3">Account Settings</h2>
                        <div className="flex flex-col gap-y-3">
                            <DeleteAccountButton sessionData={sessionData} />
                        </div>
                    </div>
                    <div className="p-4">
                        <h2 className="text-2xl font-semibold mb-7 ml-3">Preferences</h2>
                        <div className="flex flex-col gap-y-3">
                            <Notifications />
                            <EmailNotifications />
                        </div>
                    </div>
                    <div className="p-4 flex justify-center">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;