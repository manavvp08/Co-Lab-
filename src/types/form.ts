export type FormType = {
    id: string;
    title: string;
    project_name: string,
    description: string,
    completion_date: Date,
    // completion_time?: string,
    completion_time: string | null,
    type: string,
    frameworks: string[],
    custom_framework?: string,
    updates: string,
    custom_update?: string,
    rating: number,
    ongoing: boolean,
    image: string,
    brief: string | null,
    // createdBy: string,
    createdAt: Date,
    updatedAt: Date
}