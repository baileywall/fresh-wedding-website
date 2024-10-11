import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface HamburgerProps {}

export default function Hamburger(props: HamburgerProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <nav
        role="button"
        class="md:hidden text-3xl cursor-pointer mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </nav>
      <nav
        class="md:hidden bg-amber-50 absolute top-20 w-full h-80 overflow-y-auto pl-4 z-50"
        hidden={!isOpen}
      >
        <nav class="flex flex-col items-center justify-around h-80">
          <a class="font-antic text-3xl" href="/details">
            Details
          </a>
          <a class="font-antic text-3xl" href="/faq">
            FAQ
          </a>
          <a class="font-antic text-3xl" href="/photos">
            Photos
          </a>
        </nav>
      </nav>
    </>
  );
}
