import { createTRPCRouter } from "@/server/api/trpc";
import { projectRouter } from "@/server/api/routers/project";
import { friendRouter } from "@/server/api//routers/friend";
import { metadataRouter } from "@/server/api//routers/metadata";
import { chatRouter } from "@/server/api//routers/chat";
import { openaiRouter } from "@/server/api//routers/openai";
import { userRouter } from "@/server/api//routers/user";
import { collaboratorRouter } from "@/server/api/routers/collaborator";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  friend: friendRouter,
  user: userRouter,
  chat: chatRouter,
  metadata: metadataRouter,
  openai: openaiRouter,
  collaborator: collaboratorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
