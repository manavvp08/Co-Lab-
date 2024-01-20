import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const userRouter = createTRPCRouter({

    getAllUsers: publicProcedure
        .query(async () => {
            try {
                const users = await db.user.findMany();
                return users;
            } catch (err) {
                handleError(err as Error, "Failed to find User objects");
                throw err;
            }
        }),

    getUser: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const user = await db.user.findUnique({
                    where: {
                        id: ctx.session.user.id
                    }
                });

                return user;
            } catch (err) {
                handleError(err as Error, "Failed to find User object");
                throw err;
            }
        }),

    getUserById: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input }) => {
            try {
                const user = await db.user.findUnique({
                    where: {
                        id: input.id
                    }
                });
                // console.log('user: ', user);
                return user;
            } catch (err) {
                handleError(err as Error, "Failed to find User object");
                throw err;
            }
        }),

    deleteUser: protectedProcedure
        .input(z.object({
            id: z.string(),
            email: z.string()
        }))
        .mutation(async ({ input }) => {
            try {

                const email = await db.user.findUnique({
                    where: {
                        id: input.id
                    },
                    select: {
                        email: true
                    }
                });

                if (email?.email !== input.email) {
                    return false;
                } else {
                    const user = await db.user.delete({
                        where: {
                            id: input.id
                        }
                    });

                    return true;
                }

            } catch (err) {
                handleError(err as Error, "Failed to delete User object");
                throw err;
            }
        }),
});
