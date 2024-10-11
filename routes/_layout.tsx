import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: PageProps) {
  // do something with state here
  return (
    <div class="layout bg-amber-50">
      <nav
        class="w-full top-0 z-20 flex h-20 justify-between items-center bg-amber-50"
        data-controller="dropdown"
      >
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
        <nav
          class="md:hidden text-3xl cursor-pointer mr-4"
          data-action="click->dropdown#toggle"
          role="button"
        >
          &#9776;
        </nav>
        <nav
          class="bg-amber-50 md:hidden absolute top-20 flex-col items-center justify-around hidden w-full h-80 overflow-y-auto"
          data-dropdown-target="content"
        >
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
      </nav>
      <Component />
    </div>
  );
}
