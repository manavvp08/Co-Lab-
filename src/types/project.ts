import { type CommentType } from "@/types/comment";

export type ProjectType = {
    id: string;
    // userId: string;
    project_name: string;
    description: string;
    completion_date: Date;
    tech_stack: string[];
    is_ongoing: boolean;
    is_public: boolean;
    is_open_collab: boolean;
    github_link?: string | null;
    hosted_link?: string | null;
    image?: string | null;
    brief?: string | null;
    note?: string | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProjectTypeWithBookmarks = ProjectType & {
    likes: number;
};

export type ProjectTypeWithBookmarksAndComments = ProjectTypeWithBookmarks & {
    comments: CommentType[];
};