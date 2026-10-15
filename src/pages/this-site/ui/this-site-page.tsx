import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { THIS_SITE_STUDY } from "@/entities/project/model/projects";

import { BackLink, Main, PageTitle } from "@/shared/ui/page-frame";

import WriteUp from "./this-site.mdx";

export function ThisSitePage({ lab }: { lab: boolean }) {
  return (
    <>
      <SiteHeader sheet="This site" />
      <Main>
        <section data-name="This site" aria-labelledby="this-site-title">
          <BackLink href={`/#${THIS_SITE_STUDY.id}`}>All projects</BackLink>
          <PageTitle id="this-site-title">How this site is built</PageTitle>
          <WriteUp lab={lab} />
        </section>
      </Main>
    </>
  );
}
