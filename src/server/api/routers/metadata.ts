import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod"
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';

const handleError = (error: Error, message: string) => {
    console.error(error);
    throw new Error(`${message}: ${error.message}`);
};

export const metadataRouter = createTRPCRouter({
    fetchMetadata: publicProcedure
        .input(
            z.object({
                url: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const { url } = input;
                const response = await fetch(url);
                const html = await response.text();

                const metadata = await metascraper([
                    metascraperTitle(),
                    metascraperDescription(),
                    metascraperImage()
                ])({ html, url });

                return metadata;
            } catch (err) {
                handleError(err as Error, "Failed to fetch metadata");
                throw err;
            }
        }),
});