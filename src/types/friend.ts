import { type UserType } from "@/types/user";

export type FriendType = {
    id: string;
    status: "PENDING" | "ACCEPTED" | "DECLINED";
    friend: UserType;
    friendId: string;
    user: UserType;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};