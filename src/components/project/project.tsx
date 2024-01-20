import { type ProjectType } from "@/types/project"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import KDB from "@/components/kdb";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const Project = ({ project, handleDelete, handleBookmark, bookmarks, bookmarked, view }: { project: ProjectType, handleDelete?: (project_id: string, event: React.MouseEvent<HTMLButtonElement>) => void, handleBookmark?: (project_id: string, event: React.MouseEvent<HTMLButtonElement>) => void, bookmarks: number, bookmarked?: boolean, view: string }) => {

    const { data: sessionData } = useSession();

    return (
        <div>
            <Link
                key={project.id}
                href={{
                    pathname: '/project/view/[id]',
                    query: { id: project.id },
                }}
            >
                <Card key={project.id} className="w-full h-full shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.025] flex flex-col justify-between">
                    <div className="flex justify-center items-center mt-5 w-full">
                        <Image src={project.image ? project.image : "https://github.com/shadcn.png"} alt="project image" width={100} height={100} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-center whitespace-normal break-words">{project.project_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <div className="flex flex-row gap-x-3">
                                {project.tech_stack.map((tech, index) => (
                                    <KDB key={index} text={tech} />
                                ))}
                            </div>
                            <p className="sm mt-8 text-center">
                                Last edited: {format(project.updatedAt, 'MMMM dd, yyyy HH:mm:ss')}
                            </p>
                        </CardDescription>
                    </CardContent>

                    <CardFooter className="justify-between items-center flex flex-row gap-x-4">
                        <div className="flex items-center gap-x-2">
                            <HeartIcon className="text-red-400 w-5 h-5" />
                            <span className="text-gray-500">{bookmarks} Likes</span>
                        </div>
                        {(sessionData?.user?.id !== project.createdById || view == "view") ? (
                            <>
                                {handleBookmark &&
                                    <Button
                                        onClick={(event) => handleBookmark(project.id, event)}
                                        className="bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                                    >
                                        {bookmarked ? "Bookmarked" : "Bookmark"}
                                    </Button>
                                }
                            </>
                        ) : (
                            <div className="flex flex-row gap-x-3">
                                <Link
                                    href={{
                                        pathname: '/project/edit/[id]',
                                        query: { id: project.id },
                                    }}
                                    className={buttonVariants()}>
                                    Edit
                                </Link>
                                <>
                                    {handleDelete &&
                                        <Button onClick={(event) => handleDelete(project.id, event)}>
                                            Delete
                                        </Button>
                                    }
                                </>
                            </div>
                        )}

                    </CardFooter>
                </Card>
            </Link>
        </div >
    )
}

export default Project;