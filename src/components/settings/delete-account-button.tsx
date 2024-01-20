import { api } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast"
import { Session } from "next-auth";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DeleteAccountButton = ({
    sessionData
}: {
    sessionData: Session | null
}) => {

    const { toast } = useToast()
    const [email, setEmail] = useState("");

    const deleteAccount = api.user.deleteUser.useMutation();

    const handleDeleteAccount = async () => {
        try {
            const result = await deleteAccount.mutateAsync({
                id: sessionData?.user.id ?? "",
                email: email
            });

            if (!result) {
                toast({
                    title: "Email is incorrect.",
                })
            } else {
                toast({
                    title: "Account deleted.",
                })
                window.location.reload();
            }
        } catch (error) {
            toast({
                title: "Delete failed",
            })
            console.error("Error deleting User:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="hover:cursor-pointer w-full h-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex items-center gap-3 p-4 ">
                    <Trash className="w-6 h-6 text-gray-500" />
                    <span className="text-gray-800 font-medium dark:text-gray-200">Delete Account</span>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] lg:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-left">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-left">
                        Enter your email to continue. The action is irreversible.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-left">
                            Email
                        </Label>
                        <Input id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button className="bg-indigo-600 dark:text-white" onClick={handleDeleteAccount}>Confirm Deletion</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default DeleteAccountButton;