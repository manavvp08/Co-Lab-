import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { pusherServer } from "@/utils/pusher";

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const chatRouter = createTRPCRouter({

    getExistingChatRoom: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                friendId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const chatRoom = await db.chatRoom.findFirst({
                    where: {
                        OR: [
                            { userId: input.userId, friendId: input.friendId },
                            { friendId: input.friendId, userId: input.userId }
                        ]
                    },
                });

                if (chatRoom) {
                    return chatRoom.id;
                }
                return false;
            } catch (err) {
                handleError(err as Error, "Failed to find chatRoom object");
                throw err;
            }
        }),

    getChatRoomById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const chatRoom = await db.chatRoom.findFirst({
                    where: {
                        id: input.id,
                    },
                    include: {
                        friend: true,
                        user: true,
                    }
                });

                return chatRoom;
            } catch (err) {
                handleError(err as Error, "Failed to find chatRoom object");
                throw err;
            }
        }),

    getChatRooms: protectedProcedure.query(async ({ ctx }) => {
        try {
            const chatRooms = await db.chatRoom.findMany({
                where: {
                    OR: [
                        { userId: ctx.session.user.id, },
                        { friendId: ctx.session.user.id, }
                    ]
                },
                orderBy: {
                    updatedAt: "desc"
                },
                include: {
                    friend: true,
                    user: true,
                }
            });

            return chatRooms;
        } catch (err) {
            handleError(err as Error, "Failed to find chatRoom object");
            throw err;
        }
    }),

    getMessages: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .query(async ({ input }) => {
            try {
                const chatRooms = await db.chat.findMany({
                    where: {
                        chatRoomId: input.id,
                    },
                    include: {
                        user: true,
                    }
                });

                return chatRooms;
            } catch (err) {
                handleError(err as Error, "Failed to find chatRoom object");
                throw err;
            }
        }),

    createChatRoom: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                friendId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.chatRoom.create({
                    data: {
                        userId: ctx.session.user.id,
                        friendId: input.friendId,
                    },
                });
                console.log(result)
                console.log(result.id);
                return result.id;
            } catch (err) {
                handleError(err as Error, "Failed to create new ChatRoom object");
            }
        }),

    createMessage: protectedProcedure
        .input(
            z.object({
                chatRoomId: z.string(),
                message: z.string()
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.chat.create({
                    data: {
                        chatRoomId: input.chatRoomId,
                        message: input.message,
                        userId: ctx.session.user.id,
                    },
                });
                await pusherServer.trigger(input.chatRoomId, 'incoming-message', {
                    message: result,
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to create new Chat object");
            }
        }),

    editMessage: protectedProcedure
        .input(
            z.object({
                messageId: z.string(),
                message: z.string()
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.chat.update({
                    where: { id: input.messageId },
                    data: { message: input.message },
                });
                await pusherServer.trigger(result.chatRoomId, 'updated-message', {
                    message: result,
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to update Chat object");
            }
        }),

    deleteMessage: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db.chat.delete({
                    where: { id: input.id },
                });
                await pusherServer.trigger(result.chatRoomId, 'deleted-message', {
                    id: input.id,
                });
                return result;
            } catch (err) {
                handleError(err as Error, "Failed to delete Chat object");
            }
        }),
});