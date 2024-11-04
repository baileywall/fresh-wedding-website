import { PageProps } from "$fresh/server.ts";
import { NavItem } from "../components/NavItem.tsx";
import Hamburger from "../islands/Hamburger.tsx";

export default function Layout({ Component, url }: PageProps) {
  // do something with state here
  return (
    <div class="layout bg-amber-50 font-merriweather text-tree-green min-h-screen">
      <nav class="hidden md:flex w-full top-0 flex-col h-100 items-center bg-amber-50">
        <a class="font-script text-8xl py-10" href="/">
          Bailey + Colton
        </a>
        <nav class="flex gap-8">
          <NavItem pathname={url.pathname} navPath="/">
            Home
          </NavItem>
          <NavItem pathname={url.pathname} navPath="/details">
            Details
          </NavItem>
          <NavItem pathname={url.pathname} navPath="/faq">
            FAQ
          </NavItem>
          <NavItem pathname={url.pathname} navPath="/rsvp">
            RSVP
          </NavItem>
          <NavItem pathname={url.pathname} navPath="/registry">
            Registry
          </NavItem>
          <NavItem pathname={url.pathname} navPath="/photos">
            Photos
          </NavItem>
        </nav>
      </nav>
      <nav class="flex md:hidden w-full top-0 justify-between h-20 items-center bg-amber-50">
        <div class="flex items-center gap-4 ml-4">
          <image src="ring.png" class="w-20" />
          <a class="text-2xl" href="/">
            B + C
          </a>
        </div>
        <Hamburger pathname={url.pathname} />
      </nav>
      <Component />
    </div>
  );
}
