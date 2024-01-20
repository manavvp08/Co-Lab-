import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Plus } from "lucide-react";

const NewProjectCard = () => {

    return (
        <div>
            <Link
                href={{
                    pathname: '/project/new',
                }}
            >
                <Card className="w-full h-full flex flex-col justify-between shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-bold mb-2">
                            Create a New Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center flex-grow">
                        <CardDescription className="flex flex-col items-center text-gray-600">
                            <Plus className="w-16 h-16 mb-4 text-indigo-600" />
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="bg-gray-100 p-4 rounded-b-md">
                        <p className="text-sm text-gray-500">
                            Get started now by clicking on the card.
                        </p>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    );
}

export default NewProjectCard;
