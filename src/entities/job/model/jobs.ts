import type { Study } from "@/shared/config/pages";

export interface Job {
  employer: string;
  role: string;
  when: string;
  study?: Study;
}

export const PCOS_PROTOCOL_STUDY: Study = {
  href: "/work/pcos-protocol",
  id: "pcos-protocol",
  go: "Case study",
};

export const CURRENT_JOB: Job = {
  employer: "Solve Data",
  role: "UI Engineer",
  when: "2021 to now",
};

export const JOBS: readonly Job[] = [
  CURRENT_JOB,
  { employer: "stuff.co.nz", role: "Frontend Engineer", when: "2021" },
  {
    employer: "The PCOS Nutritionist",
    role: "Full Stack Developer",
    when: "2020 to 2021",
    study: PCOS_PROTOCOL_STUDY,
  },
];

export function jobLine({ role, employer, when }: Job): string {
  return `${role} at ${employer}, ${when}`;
}
