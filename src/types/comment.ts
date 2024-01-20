import { type UserType } from "./user";

export type CommentType = {
    id: string;
    content: string;
    projectId: string;
    userId: string;
    user: UserType;
    createdAt: Date;
    updatedAt: Date;
}