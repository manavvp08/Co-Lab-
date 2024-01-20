import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useRef } from "react"
import * as z from "zod"
import { useState } from "react"
import { Check } from 'lucide-react';
import KDB from "@/components/kdb"

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import { type ProjectType } from "@/types/project";

import { Button, buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
//     CommandSeparator,
// } from "@/components/ui/command"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Loading from "@/components/loading"
import Link from "next/link"
import { FileUpload } from "@/components/file-upload/file-upload"
import { api } from "@/utils/api"
import FormLinkPreview from "./form-link-preview"
import GeneratedDescriptions from "@/components/project/form-description-generation"

const FormSchema = z.object({
    project_name: z.string().min(1, {
        message: "Input field cannot be null.",
    }),
    description: z.string().min(1, {
        message: "Input field cannot be null.",
    }),
    completion_date: z.date().min(new Date("1900-01-01"), {
        message: "Please enter a valid completion date.",
    }),
    tech_stack: z.array(z.string()).min(1, {
        message: "Please enter at least one technology.",
    }),
    is_ongoing: z.boolean(),
    is_public: z.boolean(),
    is_open_collab: z.boolean(),
    github_link: z.string().max(255).optional(),
    hosted_link: z.string().max(255).optional(),
    image: z.string().max(255).optional(),
    brief: z.string().max(255).optional(),
    note: z.string().optional(),
})

const ProjectForm = ({ projectData }: { projectData?: ProjectType }) => {

    const createProject = api.project.createProject.useMutation();
    const updateProject = api.project.updateProject.useMutation();

    const [loading, isLoading] = useState(false);
    const [githubLink, setGitHubLink] = useState("");
    const [hostedLink, setHostedLink] = useState("");

    const [description, setDescription] = useState<string>("");
    const [selectedDescription, setSelectedDescription] = useState<string>("");

    const [techStack, setTechStack] = useState<string[]>([]);
    const [image, setImage] = useState<string>();
    const [brief, setBrief] = useState<string>();

    const [notes, setNotes] = useState("");

    const { data: generatedDescription, refetch } = api.openai.generateDescription.useQuery({ description: selectedDescription });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetch();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData().catch((error) => {
            console.error("Error in useEffect:", error);
        });
    }, [selectedDescription]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            project_name: "",
            description: "",
            completion_date: new Date(),
            tech_stack: [],
            is_ongoing: false,
            is_public: false,
            is_open_collab: false,
            github_link: "",
            hosted_link: "",
            image: "",
            brief: "",
        },
    });

    useEffect(() => {
        if (projectData) {

            form.reset({
                project_name: projectData.project_name,
                description: projectData.description,
                completion_date: projectData.completion_date,
                tech_stack: projectData.tech_stack,
                is_ongoing: projectData.is_ongoing,
                is_public: projectData.is_public,
                is_open_collab: projectData.is_open_collab,
                github_link: projectData.github_link ?? undefined,
                hosted_link: projectData.hosted_link ?? undefined,
                image: projectData.image ?? undefined,
                brief: projectData.brief ?? undefined,
                note: projectData.note ?? undefined,
            })
        }
    }, [projectData, form])

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        console.log('submit')
        if (projectData) {
            try {
                const res = await updateProject.mutateAsync({
                    id: projectData.id,
                    project_name: data.project_name,
                    description: data.description,
                    completion_date: data.completion_date,
                    tech_stack: data.tech_stack,
                    is_ongoing: data.is_ongoing,
                    is_public: data.is_public,
                    is_open_collab: data.is_open_collab,
                    github_link: data.github_link,
                    hosted_link: data.hosted_link,
                    image: data.image,
                    brief: data.brief,
                    note: data.note,
                });
                isLoading(false);
                toast({
                    title: "You updated the following values:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                        </pre>
                    ),
                });
                return res;
            } catch (error) {
                isLoading(false);
                toast({
                    title: "Update failed!",
                    description: (
                        <p>Check the form fields for more info!</p>
                    ),
                });
                console.error("Error updating form:", error);
            }
        } else {
            try {
                const res = await createProject.mutateAsync({
                    project_name: data.project_name,
                    description: data.description,
                    completion_date: data.completion_date,
                    tech_stack: data.tech_stack,
                    is_ongoing: data.is_ongoing,
                    is_public: data.is_public,
                    is_open_collab: data.is_open_collab,
                    github_link: data.github_link,
                    hosted_link: data.hosted_link,
                    image: data.image,
                    brief: data.brief,
                    note: data.note,
                });

                isLoading(false);
                toast({
                    title: "You submitted the following values:",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                        </pre>
                    ),
                });

                form.reset({
                    project_name: "",
                    description: "",
                    completion_date: new Date(),
                    tech_stack: [],
                    is_ongoing: false,
                    is_public: false,
                    is_open_collab: false,
                    github_link: "",
                    hosted_link: "",
                    image: "",
                    brief: "",
                    note: "",
                });
                return res;
            } catch (error) {
                isLoading(false);
                toast({
                    title: "Submission failed!",
                    description: (
                        <p>Check the form fields for more info!</p>
                    ),
                });
                console.error("Error creating form:", error);
            }
        }
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="pb-10 dark:bg-gray-800">
            <div className="flex justify-center items-center py-7 mx-2 lg:mx-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-2/3 space-y-6">
                        <FormField
                            control={form.control}
                            name="project_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl >
                                        <Input placeholder="Mini Form" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <>
                                            <Textarea
                                                placeholder="Type your description here."
                                                {...field}
                                                onBlur={async (e) => {
                                                    setDescription(e.target.value);
                                                }}
                                            />
                                            {description && (
                                                <GeneratedDescriptions description={description} />
                                            )}
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="completion_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Completion Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Mini Form"
                                            {...field}
                                            type="date"
                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                                            onBlur={(e) => {
                                                const dateValue = e.target.value ? new Date(e.target.value) : null;
                                                field.onChange(dateValue);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="github_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GitHub Link</FormLabel>
                                    <FormControl>
                                        <>
                                            <Input placeholder="https://www.example.com" {...field} type="url"
                                                onBlur={async (e) => {
                                                    setGitHubLink(e.target.value);
                                                }}
                                            />
                                            {githubLink && (
                                                <FormLinkPreview link={githubLink} />
                                            )}
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hosted_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hosted Link</FormLabel>
                                    <FormControl >
                                        <>
                                            <Input placeholder="https://www.example.com" {...field} type="url"
                                                onBlur={async (e) => {
                                                    setHostedLink(e.target.value);
                                                }}
                                            />
                                            {hostedLink && (
                                                <FormLinkPreview link={hostedLink} />
                                            )}
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tech_stack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tech Stack</FormLabel>
                                    <FormControl>
                                        <>
                                            <Textarea
                                                placeholder="Tech Stack"
                                                {...field}
                                                onBlur={(e) => {
                                                    const techStackArray = e.target.value.split(',').map(item => item.trim());
                                                    field.onChange(techStackArray);
                                                    setTechStack(techStackArray);
                                                }}
                                            />
                                            {techStack && (
                                                <div className='flex flex-row justify-start gap-x-3'>
                                                    <>
                                                        {techStack.map((item, index) => (
                                                            <KDB key={index} text={item} />
                                                        ))}
                                                    </>
                                                </div>
                                            )}
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Image</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="projectImage"
                                            onChange={(value) => {
                                                field.onChange(value);
                                                setImage(value)
                                            }}
                                            value={image ?? field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brief"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Brief <span className="text-xs">(Optional)</span></FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            endpoint="projectBrief"
                                            onChange={(value) => {
                                                field.onChange(value);
                                                setBrief(value)
                                            }}
                                            value={brief ?? field.value}
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_ongoing"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                    <div className="space-y-0.5">
                                        <FormLabel className="">
                                            Ongoing
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className=""
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_public"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Public
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className=""
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_open_collab"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                    <div className="space-y-0.5">
                                        <FormLabel>
                                            Open to Collaborations
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            className=""
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        {/* <Textarea placeholder="Notes..." {...field} /> */}
                                        <ReactQuill
                                            {...field}
                                            theme="snow"
                                            value={notes ?? field.value}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                setNotes(value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-center gap-x-3 mt-5">
                            <Link href="/" className={buttonVariants({ variant: "outline" })}>Discard</Link>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>

        </div>
    )
}

export default ProjectForm;