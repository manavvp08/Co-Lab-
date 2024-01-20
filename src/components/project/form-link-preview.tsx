import { api } from "@/utils/api"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Spinner from '@/components/spinner';
import Link from "next/link";

const FormLinkPreview = ({ link }: {
    link: string
}) => {

    const { data: metadata, refetch: refetchMetadata } = api.metadata.fetchMetadata.useQuery({ url: link });

    if (!metadata) return (
        <div className="flex justify-center items-center">
            <Spinner />
        </div>
    );

    return (
        <Card className="w-full h-full ">
            <Link href={link} className="flex flex-row">
                <div className="w-full lg:w-1/3">
                    <img src={metadata?.image} className="rounded-lg h-full w-full object-cover" alt={metadata?.title} loading="lazy" />
                </div>
                <div className="flex lg:w-2/3 p-4">
                    <div className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{metadata?.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-justify text-gray-700 dark:text-gray-200">{metadata?.description}</p>
                        </CardContent>
                    </div>
                </div>
            </Link>
        </Card>
    )
}

export default FormLinkPreview;