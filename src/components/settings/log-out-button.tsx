import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
    return (
        <Button onClick={() => void signOut()} className="bg-indigo-600 hover:bg-indigo-700 px-10 dark:text-white">Log Out</Button>
    )
}

export default SignOutButton;