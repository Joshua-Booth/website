import { TabNav } from "@radix-ui/themes";

export function Navigation({ pathname }: { pathname: string }) {
  return (
    <TabNav.Root>
      <TabNav.Link href="/" active={pathname === "/"}>
        Home
      </TabNav.Link>
      <TabNav.Link href="/portfolio/" active={pathname === "/portfolio/"}>
        Portfolio
      </TabNav.Link>
      <TabNav.Link href="/contact/" active={pathname === "/contact/"}>
        Contact
      </TabNav.Link>
    </TabNav.Root>
  );
}
