import Project from "@/components/project/project";
import NewProjectCard from "@/components/project/project-new";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast"
import Loading from "@/components/loading";
import { type ProjectTypeWithBookmarks } from "@/types/project";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ProfileProjectList = ({ type, userId }: { type: string, userId?: string }) => {

    const [loading, isLoading] = useState(false);

    const { data: projects } = api.project.selectProjects.useQuery({ id: userId! });
    const deleteProject = api.project.deleteProject.useMutation();

    const [search, setSearch] = useState("");

    const [projectList, setProjectList] = useState(projects);
    useEffect(() => {
        setProjectList(projects);
    }, [projects]);

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
                {type === "edit" && (
                    <NewProjectCard />
                )}
                {projectList && projectList.map((project: ProjectTypeWithBookmarks) => (
                    <Project key={project.id} project={project} handleDelete={handleDelete} bookmarks={project.likes} view={"profile"} />
                ))}
            </div>
        </>
    )
}

export default ProfileProjectList;