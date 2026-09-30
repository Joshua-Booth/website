import Link from "next/link";

import * as stylex from "@stylexjs/stylex";

import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { EMAIL } from "@/shared/config/site";
import { interactive } from "@/shared/ui/interactive";
import { BackLink, Main, PageTitle } from "@/shared/ui/page-frame";
import { Para, TextLink } from "@/shared/ui/prose";

export function NotFoundPage() {
  return (
    <>
      <SiteHeader sheet="Not found" />
      <Main>
        <section data-name="Not found" aria-labelledby="not-found-title">
          <BackLink href="/">Home</BackLink>
          <PageTitle id="not-found-title">
            Not
            <br />
            found
          </PageTitle>
          <Para>
            Sorry, I can&apos;t find that page. The link may be out of date, or
            there might be a typo in the address.
          </Para>
          <Para>
            You can start again from the{" "}
            <Link
              href="/"
              {...stylex.props(interactive.raise, interactive.link)}
            >
              home page
            </Link>
            . If a link on this site brought you here, email me at{" "}
            <TextLink href={`mailto:${EMAIL}`}>{EMAIL}</TextLink> and I&apos;ll
            fix it.
          </Para>
        </section>
      </Main>
    </>
  );
}
