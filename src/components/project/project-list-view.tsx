import Project from "@/components/project/project";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast"
import Loading from "@/components/loading";
import { type ProjectTypeWithBookmarks } from "@/types/project";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

const ViewProjectList = ({ userId }: { userId?: string }) => {

    const { data: sessionData, status } = useSession();

    const [loading, isLoading] = useState(false);

    const { data: projects, refetch: refetchProjects } = api.project.selectProjects.useQuery({ id: userId! });
    const { data: bookmarks, refetch: refetchBookmarks } = api.project.selectProjectBookmarks.useQuery();
    const bookmarkProject = api.project.bookmarkProject.useMutation();
    const unbookmarkProject = api.project.unbookmarkProject.useMutation();

    const [search, setSearch] = useState("");

    const [projectList, setProjectList] = useState(projects);
    const [bookmarkList, setBookmarkList] = useState(bookmarks);

    useEffect(() => {
        setProjectList(projects);
    }, [projects]);

    useEffect(() => {
        setBookmarkList(bookmarks);
        setProjectList(projects);
    }, [bookmarks]);

    useEffect(() => {
        if (search) {
            setProjectList(projects);
            setProjectList(projects?.filter((project: ProjectTypeWithBookmarks) =>
                project.project_name.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setProjectList(projects);
        }
    }, [search, projects]);

    const handleBookmark = async (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        isLoading(true);

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

            await Promise.all([refetchProjects(), refetchBookmarks()]);
        } catch (error) {
            console.error("Error bookmarking/unbookmarking project:", error);
        } finally {
            isLoading(false);
        }
    };


    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {projects && projects.length > 0 ? (
                <>
                    <div className="w-full max-w-xl mx-auto mb-16">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Search className="w-5 h-5 text-indigo-700" />
                            </span>
                            <Input
                                className="w-full pl-10 pr-4 py-2 border border-indigo-700 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
                                placeholder="Search for projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-x-10 gap-y-10 justify-center">
                        {projectList && projectList.map((project: ProjectTypeWithBookmarks) => (
                            <Project key={project.id} project={project} handleBookmark={handleBookmark} bookmarks={project.likes} bookmarked={(bookmarkList && bookmarkList.some((bookmark) => bookmark.projectId === project.id)) ?? false} view={sessionData?.user.id == userId ? "view" : "others"} />
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="w-full max-w-xl mx-auto mb-16">
                        <p className="text-lg">No projects to show...</p>
                    </div>
                </>
            )}

        </>
    )
}

export default ViewProjectList;