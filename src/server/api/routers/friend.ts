import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const friendRouter = createTRPCRouter({

    getFriends: protectedProcedure.query(async ({ ctx }) => {
        try {
            const friends = await db.friendship.findMany({
                where: {
                    OR: [
                        { userId: ctx.session.user.id, status: "ACCEPTED" },
                        { friendId: ctx.session.user.id, status: "ACCEPTED" }
                    ]
                },
                include: {
                    friend: true,
                    user: true,
                }
            });

            return friends;
        } catch (err) {
            handleError(err as Error, "Failed to find Friend object");
            throw err;
        }
    }),

    getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
        try {
            const friendRequests = await db.friendship.findMany({
                where: {
                    friendId: ctx.session.user.id,
                    status: "PENDING"
                },
                include: {
                    friend: true,
                    user: true,
                }
            });

            return friendRequests;
        } catch (err) {
            handleError(err as Error, "Failed to find Friend object");
            throw err;
        }
    }),

    getPendingRequests: protectedProcedure.query(async ({ ctx }) => {
        try {
            const pendingRequests = await db.friendship.findMany({
                where: {
                    userId: ctx.session.user.id,
                    status: "PENDING"
                },
                include: {
                    friend: true,
                    user: true,
                }
            });

            return pendingRequests;
        } catch (err) {
            handleError(err as Error, "Failed to find Friend object");
            throw err;
        }
    }),

    // deletePendingRequest: protectedProcedure
    //     .input(
    //         z.object({
    //             id: z.string(),
    //         }),
    //     )
    //     .mutation(async ({ ctx, input }) => {
    //         try {
    //             const result = await db.friendship.delete({
    //                 where: { id: input.id },
    //             });
    //             return result;
    //         } catch (err) {
    //             handleError(err as Error, "Failed to delete Friend object");
    //         }
    //     }),

    createFriendRequest: protectedProcedure
        .input(
            z.object({
                friendId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.friendship.create({
                    data: {
                        userId: ctx.session.user.id,
                        friendId: input.friendId,
                        status: "PENDING"
                    },
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to create new Friend object");
            }
        }),

    acceptFriendRequest: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.friendship.update({
                    where: { id: input.id },
                    data: { status: "ACCEPTED" }
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to accept Friend object");
            }
        }),

    rejectFriendRequest: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.friendship.delete({
                    where: { id: input.id },
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to reject Friend object");
            }
        }),

    deleteFriend: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.friendship.delete({
                    where: { id: input.id },
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to delete Friend object");
            }
        }),

    showSuggestions: protectedProcedure.query(async ({ ctx }) => {
        try {
            const suggestions = await db.user.findMany({
                where: {
                    NOT: [
                        { id: ctx.session.user.id },

                    ],
                    // OR: [
                    //     { id: ctx.session.user.id, status: "ACCEPTED" },
                    //     { friendId: ctx.session.user.id, status: "ACCEPTED" }
                    // ]
                }
            });

            return suggestions;
        } catch (err) {
            handleError(err as Error, "Failed to find Friend object");
            throw err;
        }
    }),

    getFriendsByUserId: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ input }) => {
            try {
                const friends = await db.friendship.findMany({
                    where: {
                        OR: [
                            { userId: input.id, status: "ACCEPTED" },
                            { friendId: input.id, status: "ACCEPTED" }
                        ]
                    },
                    include: {
                        friend: true,
                        user: true,
                    }
                });

                return friends;
            } catch (err) {
                handleError(err as Error, "Failed to find Friend object");
                throw err;
            }
        }),

});
