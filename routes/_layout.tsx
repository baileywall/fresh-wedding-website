import { PageProps } from "$fresh/server.ts";
import Hamburger from "../islands/Hamburger.tsx";

export default function Layout({ Component, state }: PageProps) {
  // do something with state here
  return (
    <div class="layout bg-amber-50">
      <nav class="w-full top-0 z-20 flex h-20 justify-between items-center bg-amber-50">
        <div class="flex items-center gap-4 ml-4">
          <image src="ring.png" class="w-20" />
          <a class="font-antic text-2xl" href="/">
            B + C
          </a>
        </div>
        <nav class="hidden md:flex gap-4 mr-4">
          <a class="font-antic text-2xl" href="/details">
            Details
          </a>
          <a class="font-antic text-2xl" href="/faq">
            FAQ
          </a>
          <a class="font-antic text-2xl" href="/photos">
            Photos
          </a>
        </nav>
        <Hamburger />
      </nav>
      <Component />
    </div>
  );
}
