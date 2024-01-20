import KDB from "@/components/kdb";
import { api } from "@/utils/api";
import { GithubIcon, Hand, HeartIcon, MessageCircle, Pencil, Send, Link as Hosted, File, CircleUser } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { toast } from "@/components/ui/use-toast";
import router from "next/router";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import FormLinkPreview from "./form-link-preview";

const ProjectDetails = ({ id }: { id: string }) => {
    const { data: sessionData } = useSession();

    const {
        data: project,
        refetch: refetchProject
    } = api.project.selectProjectByID.useQuery({ id: id });
    const {
        data: bookmarks,
        refetch: refetchBookmarks
    } = api.project.selectProjectBookmarks.useQuery();
    const { data: exisitngChatRoom } = api.chat.getExistingChatRoom.useQuery({ userId: sessionData?.user?.id ?? '', friendId: id ?? '' });
    const bookmarkProject = api.project.bookmarkProject.useMutation();
    const unbookmarkProject = api.project.unbookmarkProject.useMutation();
    const commentProject = api.project.createProjectComment.useMutation();
    const deleteProject = api.project.deleteProject.useMutation();
    const createChatRoom = api.chat.createChatRoom.useMutation();

    const [comment, setComment] = useState("");

    const handleBookmark = async (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        try {
            if (bookmarks && bookmarks.some((bookmark) => bookmark.projectId === id)) {
                await unbookmarkProject.mutateAsync({ id });
                toast({
                    title: "You have successfully unbookmarked the project!"
                });
            } else {
                await bookmarkProject.mutateAsync({ id });
                toast({
                    title: "You have successfully bookmarked the project!"
                });
            }

            await Promise.all([refetchProject(), refetchBookmarks()]);
        } catch (error) {
            console.error("Error bookmarking/unbookmarking project:", error);
        }
    };

    const handleComment = async () => {
        if (project) {
            try {
                await commentProject.mutateAsync({
                    projectId: project.id,
                    comment: comment
                });
                toast({
                    title: "You have successfully created the comment!"
                })
                setComment("");
                await refetchProject();
            } catch (error) {
                console.error("Error creating comment:", error);
            }
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteProject.mutateAsync({ id });
            toast({
                title: "You have successfully deleted the project!"
            })
            router.back();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    }

    const handleChat = async () => {
        console.log('chat');
        if (exisitngChatRoom) {
            await router.push(`/chat?id=${exisitngChatRoom}`);
        } else {
            try {
                const createdRoomId = await createChatRoom.mutateAsync({
                    userId: sessionData?.user?.id ?? '',
                    friendId: id ?? ''
                });

                await router.push(`/chat?id=${createdRoomId}`);
            } catch (error) {
                console.error("Error creating chat room:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full">
                {project && (
                    <div className="text-center mt-20 mb-16 lg:mx-20">
                        <h1 className="text-5xl font-extrabold text-gray-800 mb-8 dark:text-white">{project?.project_name}</h1>
                        <Card className="flex flex-col lg:flex-row lg:gap-x-20 justify-center mt-20 drop-shadow px-10 dark:bg-gray-900">
                            <div className="md:w-1/4 p-5 h-fit">
                                <h2 className="h2 font-bold text-xl mb-5">{project?.project_name}</h2>

                                {/* Collaboration Type */}
                                {project.is_open_collab && (
                                    <span>
                                        <Badge variant="outline" className="bg-indigo-600 text-white mb-8">
                                            <Hand className="w-3 h-3 mr-2" />Open to Collaboration
                                        </Badge>
                                    </span>
                                )}

                                {/* Project Image */}
                                <div className="flex items-center mb-10">
                                    <Image src={project?.image ? project.image : "https://github.com/shadcn.png"} alt="project image" width={500} height={50} className="rounded-md" />
                                </div>

                                {/* Like and Comment Counts */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-x-2">
                                        <Link
                                            href={{
                                                pathname: '/profile/[id]',
                                                query: { id: project?.createdBy.id },
                                            }}
                                            target="_blank"
                                            className="hover:underline flex flex-row gap-x-3"
                                        >
                                            <CircleUser className="text-indigo-700 dark:text-indigo-600 w-5 h-5" />
                                            <span className="text-gray-500 dark:text-gray-200">{project?.createdBy.name}</span>
                                        </Link>
                                    </div>
                                    <div className="flex gap-x-2">
                                        <HeartIcon className={`text-red-400 w-5 h-5 ${(bookmarks && bookmarks.some((bookmark) => bookmark.projectId === id)) ? "fill-red-400" : ""}`} />
                                        <span className="text-gray-500 dark:text-gray-200">{project.likes} Likes</span>
                                    </div>
                                    <div className="flex gap-x-2">
                                        <MessageCircle className="text-indigo-700 w-5 h-5 dark:text-indigo-600" />
                                        <span className="text-gray-500 dark:text-gray-200">{project.comments?.length} Comments</span>
                                    </div>
                                </div>

                                {/* Related Links */}
                                <div className="mt-10">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Links</h2>
                                    <div className="flex flex-col gap-y-3">
                                        {project.github_link && (
                                            <Link href={project.github_link} target="_blank" className="flex flex-row gap-x-3">
                                                <GithubIcon className="w-5 h-5" />
                                                <span>Github</span>
                                            </Link>
                                        )}
                                        {project.hosted_link && (
                                            <Link href={project.hosted_link} target="_blank" className="flex flex-row gap-x-3">
                                                <Hosted className="w-5 h-5" />
                                                <span>Hosted</span>
                                            </Link>
                                        )}
                                        {project.brief && (
                                            <Link href={project.brief} target="_blank" className="flex flex-row gap-x-3">
                                                <File className="w-5 h-5" />
                                                <span>Project Brief</span>
                                            </Link>
                                        )}
                                    </div>
                                    {!project.github_link && !project.hosted_link && !project.brief && (
                                        <p className="text-gray-600">No links provided</p>
                                    )}
                                </div>

                                <div className="flex gap-3 justify-center items-center mt-10">
                                    {sessionData?.user?.id !== project.createdById ? (
                                        <>
                                            <Button onClick={(event) => handleBookmark(project.id, event)} className="bg-indigo-600 hover:bg-indigo-700 dark:text-white">
                                                {(bookmarks && bookmarks.some((bookmark) => bookmark.projectId === id)) ? "Bookmarked" : "Bookmark"}
                                            </Button>
                                            {/* <Link href={{ pathname: '/chat', query: { id: project.id } }} className={buttonVariants()}>
                                                Chat with Developer
                                            </Link> */}
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white mt-8" onClick={handleChat} disabled={project.createdById === sessionData?.user?.id}>Chat</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={{
                                                    pathname: '/project/edit/[id]',
                                                    query: { id: project.id },
                                                }}
                                                className={`${buttonVariants()} bg-indigo-600 hover:bg-indigo-700`}>
                                                Edit
                                            </Link>
                                            <Button onClick={() => handleDelete(project.id)}>
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Project Description and Notes */}
                            <div className="md:w-3/4 text-left p-5">
                                {/* Tech Stack */}
                                <div className="">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Tech Stack</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {project?.tech_stack && project?.tech_stack.map((tech: string) => (
                                            <KDB key={tech} text={tech} />
                                        ))}
                                    </div>
                                </div>

                                {/* Project Description */}
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Description</h2>
                                    <p className="font-mono">{project.description}</p>
                                </div>

                                {/* Notes By Developer */}
                                {project.note && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Notes By Developer</h2>
                                        <div dangerouslySetInnerHTML={{ __html: project.note }} />
                                    </div>
                                )}
                            </div>

                        </Card>

                        <div className="shadow-md rounded-md flex flex-col mt-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 mt-10 text-center dark:text-white">Comments</h2>
                            <ScrollArea className="h-[200px] flex flex-col gap-6 pb-5">
                                {project.comments && (
                                    <>
                                        {project.comments.length > 0 ? (
                                            project.comments.map((comment) => (
                                                <div key={comment.id} className="flex items-start space-x-4 p-5 text-left mx-5">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={comment?.user?.image ?? 'https://github.com/shadcn.png'} />
                                                        <AvatarFallback>{comment?.user?.name}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex flex-row gap-x-2">
                                                            <p className="text-gray-500 font-semibold dark:text-white">{comment.user.name}</p>
                                                            {comment.user.id === project.createdById && (
                                                                <span>
                                                                    <Badge variant="outline" className="bg-indigo-600 text-white">
                                                                        <Pencil className="w-3 h-3 mr-2" />Author
                                                                    </Badge>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-200">{comment.comment}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <p className="text-gray-600 mt-20 dark:text-gray-200">No comments yet</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </ScrollArea>
                            <div className="mx-5 flex flex-row gap-x-3">
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment"
                                    className="md p-5 mb-5"
                                />
                                <Button className="mt-5 bg-indigo-600 hover:bg-indigo-700" onClick={handleComment}>
                                    <Send className="w-5 h-5 dark:text-white" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProjectDetails;
