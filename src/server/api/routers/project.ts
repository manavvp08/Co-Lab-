import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { ProjectType } from "@/types/project";
const handleError = (error: Error, message: string) => {
  console.error(error);
  throw new Error(`${message}: ${error.message}`);
};

export const projectRouter = createTRPCRouter({

  selectAllProjects: publicProcedure
    .query(async () => {
      try {
        const projects = await db.project.findMany({
          where: {
            is_public: true
          }
        });

        const projectsWithLikes = await Promise.all(projects.map(async (project: ProjectType) => {
          const likes = await db.projectBookmark.count({
            where: {
              projectId: project.id,
            }
          });

          return {
            ...project,
            likes
          };
        }));

        return projectsWithLikes;
      } catch (err) {
        handleError(err as Error, "Failed to find Project objects");
        throw err;
      }
    }),

  selectProjects: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const projects = await db.project.findMany({
          where: {
            createdById: input.id
          }
        });

        const projectsWithLikes = await Promise.all(projects.map(async (project: ProjectType) => {
          const likes = await db.projectBookmark.count({
            where: {
              projectId: project.id
            }
          });

          return {
            ...project,
            likes
          };
        }));

        return projectsWithLikes;
      } catch (err) {
        handleError(err as Error, "Failed to find Project objects");
        throw err;
      }
    }),

  selectProjectByID: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const project = await db.project.findUniqueOrThrow({
          where: {
            id: input.id,
            // createdById: ctx.session.user.id
          },
          include: {
            createdBy: true
          }
        });
        const likes = await db.projectBookmark.count({
          where: {
            projectId: project.id
          }
        });
        const comments = await db.projectComment.findMany({
          where: {
            projectId: project.id
          },
          include: {
            user: true
          }
        });
        return {
          ...project,
          likes,
          comments
        };
      } catch (err) {
        handleError(err as Error, "Failed to find Project object");
      }
    }),

  createProject: protectedProcedure
    .input(
      z.object({
        project_name: z.string(),
        description: z.string(),
        completion_date: z.date(),
        tech_stack: z.array(z.string()),
        is_ongoing: z.boolean(),
        is_public: z.boolean(),
        is_open_collab: z.boolean(),
        github_link: z.string().optional(),
        hosted_link: z.string().optional(),
        image: z.string().optional(),
        brief: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db.project.create({
          data: {
            project_name: input.project_name,
            description: input.description,
            completion_date: input.completion_date,
            tech_stack: input.tech_stack,
            is_ongoing: input.is_ongoing,
            is_public: input.is_public,
            is_open_collab: input.is_open_collab,
            github_link: input.github_link,
            hosted_link: input.hosted_link,
            image: input.image,
            brief: input.brief,
            note: input.note,
            createdById: ctx.session.user.id
          },
        });
        return result;
      } catch (err) {
        handleError(err as Error, "Failed to create new Project object");
      }
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        project_name: z.string(),
        description: z.string(),
        completion_date: z.date(),
        tech_stack: z.array(z.string()),
        is_ongoing: z.boolean(),
        is_public: z.boolean(),
        is_open_collab: z.boolean(),
        github_link: z.string().optional(),
        hosted_link: z.string().optional(),
        image: z.string().optional(),
        brief: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {

        const result = await db.project.update({
          where: { id: input.id },
          data: {
            id: input.id,
            project_name: input.project_name,
            description: input.description,
            completion_date: input.completion_date,
            tech_stack: input.tech_stack,
            is_ongoing: input.is_ongoing,
            is_public: input.is_public,
            is_open_collab: input.is_open_collab,
            github_link: input.github_link,
            hosted_link: input.hosted_link,
            image: input.image,
            brief: input.brief,
            note: input.note,
            createdById: ctx.session.user.id,
          },
        });
        return result;
      } catch (err) {
        handleError(err as Error, "Failed to update Project object");
      }
    }),


  deleteProject: protectedProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db.projectBookmark.deleteMany({
          where: { projectId: input.id },
        });

        await db.projectComment.deleteMany({
          where: { projectId: input.id },
        });

        const result = await db.project.deleteMany({
          where: { id: input.id },
        });

        return result;
      } catch (err) {
        handleError(err as Error, "Failed to delete Project object");
      }
    }),

  bookmarkProject: protectedProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db.projectBookmark.create({
          data: {
            projectId: input.id,
            userId: ctx.session.user.id
          },
        });
        return result;
      } catch (err) {
        handleError(err as Error, "Failed to bookmark Project object");
      }
    }),

  unbookmarkProject: protectedProcedure
    .input(
      z.object({
        id: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db.projectBookmark.deleteMany({
          where: {
            projectId: input.id,
            userId: ctx.session.user.id
          },
        });
        return result;
      } catch (err) {
        handleError(err as Error, "Failed to unbookmark Project object");
      }
    }),

  selectProjectBookmarks: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const bookmarks = await db.projectBookmark.findMany({
          where: {
            userId: ctx.session.user.id
          }
        });
        return bookmarks;
      } catch (err) {
        handleError(err as Error, "Failed to find Project objects");
      }
    }),

  createProjectComment: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        comment: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db.projectComment.create({
          data: {
            projectId: input.projectId,
            userId: ctx.session.user.id,
            comment: input.comment
          },
        });
        return result;
      } catch (err) {
        handleError(err as Error, "Failed to create new Project object");
      }
    }),
});
