import { markdownResponse } from "@/app/markdown/pages";

export const dynamic = "force-static";

export function GET() {
  return markdownResponse("/work/pcos-protocol");
}
