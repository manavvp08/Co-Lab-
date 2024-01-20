import { useRouter } from "next/router";
import { api } from "@/utils/api";

import ProjectForm from "@/components/project/form";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { useEffect } from "react";

const UpdateProject = () => {

    const router = useRouter();

    const { data: sessionData, status } = useSession();


    const { id } = router?.query;
    const { data: project } = api.project.selectProjectByID.useQuery({ id: id as string });

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }


    return (
        <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
            <div className="w-full">
                <div className="text-center mt-20">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">{project?.project_name}</h1>
                    <p className="text-lg text-gray-600 mb-8 dark:text-gray-200">Update the form below to update project details.</p>
                </div>
                {project && <ProjectForm projectData={project} />}
            </div>
        </div>
    );
};

export default UpdateProject;