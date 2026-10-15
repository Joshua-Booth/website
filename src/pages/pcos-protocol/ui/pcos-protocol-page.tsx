import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { PCOS_PROTOCOL_STUDY } from "@/entities/job/model/jobs";

import { BackLink, Main, PageTitle } from "@/shared/ui/page-frame";

import Study from "./pcos-protocol.mdx";

export function PcosProtocolPage() {
  return (
    <>
      <SiteHeader sheet="PCOS Protocol" />
      <Main>
        <section
          data-name="PCOS Protocol"
          aria-labelledby="pcos-protocol-title"
        >
          <BackLink href={`/#${PCOS_PROTOCOL_STUDY.id}`}>All work</BackLink>
          <PageTitle id="pcos-protocol-title">
            PCOS
            <br />
            Protocol
          </PageTitle>
          <Study />
        </section>
      </Main>
    </>
  );
}
