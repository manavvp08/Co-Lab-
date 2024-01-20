import ProjectDetails from "@/components/project/project-details";
import { useRouter } from "next/router";

const ViewProject = () => {

    const router = useRouter();
    const { id } = router?.query;

    return (
        <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center">
                {id && <ProjectDetails id={id as string} />}
            </div>
        </div>
    );
}

export default ViewProject;