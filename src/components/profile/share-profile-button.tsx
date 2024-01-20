import { useState } from "react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"

const ShareProfileButton = ({
    userId
}: {
    userId: string
}) => {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false);

    const onGenerateLink = async () => {
        await navigator.clipboard.writeText(`${origin}/profile/${userId}`)
        setCopied(true)

        toast({
            title: "Copied",
            description: "Link to the profile is copied!",
        })

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    if (status === "loading") {
        return <Loading />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-8" disabled={copied}>Share Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this profile.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            defaultValue={`${origin}/profile/${userId}`}
                            id="link"
                            readOnly
                        />
                    </div>
                    <Button onClick={onGenerateLink} type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareProfileButton;