import { useState } from "preact/hooks";
import { NavItem } from "../components/NavItem.tsx";

export default function Hamburger(props: { pathname: string }) {
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
          <NavItem pathname={props.pathname} navPath="/">
            Home
          </NavItem>
          <NavItem pathname={props.pathname} navPath="/details">
            Details
          </NavItem>
          <NavItem pathname={props.pathname} navPath="/faq">
            FAQ
          </NavItem>
          <NavItem pathname={props.pathname} navPath="/rsvp">
            RSVP
          </NavItem>
          <NavItem pathname={props.pathname} navPath="/registry">
            Registry
          </NavItem>
          <NavItem pathname={props.pathname} navPath="/photos">
            Photos
          </NavItem>
        </nav>
      </nav>
    </>
  );
}
