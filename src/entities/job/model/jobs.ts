import type { Study } from "@/shared/config/pages";

export interface Job {
  employer: string;
  role: string;
  when: string;
  study?: Study;
}

export const JOBS: readonly Job[] = [
  { employer: "Solve Data", role: "UI Engineer", when: "2021 to now" },
  { employer: "stuff.co.nz", role: "Frontend Engineer", when: "2021" },
  {
    employer: "The PCOS Nutritionist",
    role: "Full Stack Developer",
    when: "2020 to 2021",
    study: {
      path: "/work/pcos-protocol",
      id: "pcos-protocol",
      go: "Case study",
    },
  },
];

export function jobLine({ role, employer, when }: Job): string {
  return `${role} at ${employer}, ${when}`;
}
