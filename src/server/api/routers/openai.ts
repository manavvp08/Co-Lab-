import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import OpenAI from "openai";

const openai = new OpenAI();

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const openaiRouter = createTRPCRouter({

    generateDescription: protectedProcedure
        .input(
            z.object({
                description: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "user", content: "Generate a better description for this project: " + input.description },
                    ],
                    model: "gpt-3.5-turbo",

                })
                console.log(completion);
                return completion.choices[0]?.message.content;
            } catch (err) {
                handleError(err as Error, "Failed to generate descriptions");
                throw err;
            }
        }),

})