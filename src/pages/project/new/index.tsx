import ProjectForm from "@/components/project/form";
import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

const NewProject = () => {

    const { data: sessionData, status } = useSession();

    if (status === 'loading') {
        return <Loading />
    }

    if (!sessionData) {
        window.location.replace('/auth/sign-in');
        return null;
    }

    return (
        // <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="container mx-auto mt-8 p-4 bg-white dark:bg-gray-800">
            <div className="w-full">
                <div className="text-center mt-20">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-6 dark:text-white">Create a New Project</h1>
                    <p className="text-lg text-gray-600 mb-8 dark:text-gray-200">Complete the form below to initiate a new project.</p>
                </div>
                <ProjectForm />
            </div>
        </div>
    );
};

export default NewProject;