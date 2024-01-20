// import ProjectCard from "@/components/project/view-project-card";
// import ProjectCard from "@/components/project/project-card";
import Project from "@/components/project/project";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast"
import Loading from "@/components/loading";
import { type ProjectTypeWithBookmarks } from "@/types/project";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const AllProjectList = () => {

    const [loading, isLoading] = useState(false);

    const { data: projects, refetch: refetchProjects } = api.project.selectAllProjects.useQuery();
    const { data: bookmarks, refetch: refetchBookmarks } = api.project.selectProjectBookmarks.useQuery();
    const bookmarkProject = api.project.bookmarkProject.useMutation();
    const unbookmarkProject = api.project.unbookmarkProject.useMutation();
    const deleteProject = api.project.deleteProject.useMutation();

    const [search, setSearch] = useState("");

    const [projectList, setProjectList] = useState(projects);
    const [bookmarkList, setBookmarkList] = useState(bookmarks);

    const handleDelete = async (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        isLoading(true);
        try {
            await deleteProject.mutateAsync({ id });
            isLoading(false);
            toast({
                title: "You have successfully deleted the project!"
            })
            setProjectList((project_list) => project_list?.filter((project) => project.id !== id));
        } catch (error) {
            isLoading(false);
            console.error("Error deleting project:", error);
        }
    }

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
                    <Project key={project.id} project={project} handleDelete={handleDelete} handleBookmark={handleBookmark} bookmarks={project.likes} bookmarked={(bookmarkList && bookmarkList.some((bookmark) => bookmark.projectId === project.id)) ?? false} view={"others"} />
                ))}
            </div>
        </>
    )
}

export default AllProjectList;