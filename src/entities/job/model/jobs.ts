import type { Study } from "@/shared/config/pages";

export interface Role {
  title: string;
  when: string;
}

export interface Job {
  employer: string;
  /** Latest role first. Every role has an end year, as none is current. */
  roles: readonly [Role, ...Role[]];
  study?: Study;
}

export const PCOS_PROTOCOL_STUDY: Study = {
  href: "/work/pcos-protocol",
  id: "pcos-protocol",
  go: "Case study",
};

export const JOBS: readonly [Job, ...Job[]] = [
  {
    employer: "Solve Data",
    roles: [
      { title: "Frontend Lead", when: "2024 to 2026" },
      { title: "UI Engineer", when: "2021 to 2023" },
    ],
  },
  {
    employer: "stuff.co.nz",
    roles: [{ title: "Frontend Engineer", when: "2021" }],
  },
  {
    employer: "The PCOS Nutritionist",
    roles: [{ title: "Full Stack Developer", when: "2020 to 2021" }],
    study: PCOS_PROTOCOL_STUDY,
  },
];

/** The title of the latest role, which is past, not a current job. */
export const LATEST_ROLE = JOBS[0].roles[0].title;

export function jobLine({ employer, roles }: Job): string {
  return roles
    .map(({ title, when }) => `${title} at ${employer}, ${when}`)
    .join("; ");
}
