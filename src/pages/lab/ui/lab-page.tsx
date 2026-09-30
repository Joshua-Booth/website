import { SiteHeader } from "@/widgets/site-header/ui/site-header";

import { GRID } from "@/entities/lab-tile/model/tiles";
import { TileDemo } from "@/entities/lab-tile/ui/tile-demo";

import { Main, PageTitle } from "@/shared/ui/page-frame";
import { Para } from "@/shared/ui/prose";

import { LabGrid } from "./lab-grid";

export function LabPage() {
  return (
    <>
      <SiteHeader current="lab" sheet="Lab" />
      <Main>
        <section data-name="Lab grid" aria-labelledby="lab-title">
          <PageTitle id="lab-title">Lab</PageTitle>
          <Para>
            Small interfaces and components I build to get the details right.
          </Para>
          <LabGrid
            tiles={GRID.map((id) => ({
              id,
              demo: <TileDemo id={id} layout="grid" />,
            }))}
          />
        </section>
      </Main>
    </>
  );
}
