import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { BackLink, Main, PageTitle } from "@/shared/ui/page-frame";

import WriteUp from "./this-site.mdx";

export function ThisSitePage({ lab }: { lab: boolean }) {
  return (
    <>
      <SiteHeader sheet="This site" />
      <Main>
        <section data-name="This site" aria-labelledby="this-site-title">
          <BackLink href="/#this-site">All projects</BackLink>
          <PageTitle id="this-site-title">How this site is built</PageTitle>
          <WriteUp lab={lab} />
        </section>
      </Main>
    </>
  );
}
