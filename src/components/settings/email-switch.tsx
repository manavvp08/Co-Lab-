import { Card } from "@/components/ui/card";
import { ArrowBigRight, Mail } from "lucide-react";
import ComingSoon from "../coming-soon/coming-soon";

const EmailNotifications = () => {
    return (
        <Card className="w-full h-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex flex-row justify-between items-center gap-3 p-4">
            <div className="flex flex-row gap-x-4">
                <Mail className="w-6 h-6 text-gray-500" />
                <span className="text-gray-800 font-medium dark:text-gray-200">Email notifications</span>
            </div>
            <div>
                <ComingSoon component={<ArrowBigRight className="w-6 h-6 text-indigo-700 hover:cursor-pointer" />} />
            </div>
        </Card>
    )
}

export default EmailNotifications;