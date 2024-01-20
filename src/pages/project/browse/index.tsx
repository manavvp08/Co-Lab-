import AllProjectList from "@/components/project/project-list-all";

const Projects = () => {
    return (
        <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center">
                <div className="mt-7 mb-10">
                    <h2 className="text-2xl font-bold text-center mb-8">Browse Projects</h2>
                    <AllProjectList />
                </div>
            </div>
        </div >
    );
}

export default Projects;