import addonVitest from "@storybook/addon-vitest";
import { definePreview } from "@storybook/nextjs-vite";

import "@/app/styles/global.css";

export default definePreview({ addons: [addonVitest()] });
