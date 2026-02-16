import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const portfolioCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      link: z.string(),
      showInHome: z.boolean().optional(),
    }),
});

export const collections = {
  portfolio: portfolioCollection,
};
