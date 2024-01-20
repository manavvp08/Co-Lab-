import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const collaboratorRouter = createTRPCRouter({

    addCollaborator: protectedProcedure
        .input(z.object({
            collaboratorId: z.string(),
            projectId: z.string()
        }))
        .query(async ({ input }) => {
            try {
                const collaborator = await db.projectCollaborator.create({
                    data: {
                        collaboratorId: input.collaboratorId,
                        projectId: input.projectId,
                        status: "PENDING"
                    }
                });

                return collaborator;
            } catch (err) {
                handleError(err as Error, "Failed to create Collaborator object");
                throw err;
            }
        }),

    getCollaborators: protectedProcedure
        .input(z.object({
            projectId: z.string()
        }))
        .query(async ({ input }) => {
            try {
                const collaborators = await db.projectCollaborator.findMany({
                    where: {
                        projectId: input.projectId
                    },
                    include: {
                        collaborator: true
                    }
                });

                return collaborators;
            } catch (err) {
                handleError(err as Error, "Failed to find Collaborator objects");
                throw err;
            }
        }),


    acceptCollaborator: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            try {
                const collaborator = await db.projectCollaborator.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        status: "ACCEPTED"
                    }
                });

                return collaborator;
            } catch (err) {
                handleError(err as Error, "Failed to update Collaborator object");
                throw err;
            }
        }),

    declineCollaborator: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            try {
                const collaborator = await db.projectCollaborator.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        status: "DECLINED"
                    }
                });

                return collaborator;
            } catch (err) {
                handleError(err as Error, "Failed to update Collaborator object");
                throw err;
            }
        }),

    deleteCollaborator: protectedProcedure
        .input(z.object({
            id: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            try {
                const collaborator = await db.projectCollaborator.delete({
                    where: {
                        id: input.id
                    }
                });

                return collaborator;
            } catch (err) {
                handleError(err as Error, "Failed to delete Collaborator object");
                throw err;
            }
        }),
})