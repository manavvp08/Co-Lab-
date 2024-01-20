import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { ProjectType, ProjectTypeWithBookmarks } from "@/types/project";
import { UserType } from "@/types/user";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const HeaderSearch = () => {

    const [search, setSearch] = useState("");

    const { data: projects } = api.project.selectAllProjects.useQuery();
    const { data: users } = api.user.getAllUsers.useQuery();

    const [projectResults, setProjectResults] = useState<ProjectTypeWithBookmarks[]>(projects ?? []);
    const [userResults, setUserResults] = useState<UserType[]>(users ?? []);

    useEffect(() => {
        setProjectResults(projects ?? []);
    }, [projects]);

    useEffect(() => {
        setUserResults(users ?? []);
    }, [users]);

    useEffect(() => {
        if (search) {
            setProjectResults(projects?.filter((project: ProjectType) => project?.project_name?.toLowerCase().includes(search.toLowerCase())) ?? []);
            setUserResults(users?.filter((user) => user?.name?.toLowerCase().includes(search.toLowerCase())) ?? []);
        }
    }, [search]);

    return (

        <Command className="border-1 border-gray-200 dark:bg-gray-900 dark:text-white"
        >
            <CommandInput
                placeholder="Search"
                value={search}
                onValueChange={(e) => setSearch(e)}
            />
            {search && (
                <CommandList className="absolute z-10 top-16 left-30 bg-white dark:bg-gray-800 p-3 rounded-lg w-[200px] lg:w-[300px]">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Projects">
                        {projectResults?.map((project) => (
                            <Link href={`/project/view/${project.id}`} key={project.id}>
                                <CommandItem className="flex justify-between mb-2 dark:hover:bg-gray-500">
                                    <p>{project.project_name}</p>
                                    <span className="font-light">
                                        {users?.find((user) => user.id === project.createdById)?.name}
                                    </span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Users">
                        {userResults?.map((user) => (
                            <Link href={`/profile/${user.id}`} key={user.id}>
                                <CommandItem key={user.id} className="flex flex-row gap-x-3 mb-2 dark:hover:bg-gray-500">
                                    <Avatar className="w-5 h-5">
                                        <AvatarImage src={user.image ?? 'https://github.com/shadcn.png'} />
                                        <AvatarFallback>{user?.name}</AvatarFallback>
                                    </Avatar>
                                    <span>
                                        {user.name}
                                    </span>
                                </CommandItem>
                            </Link>
                        ))}
                    </CommandGroup>
                </CommandList>
            )
            }
        </Command>
    )
}

export default HeaderSearch;