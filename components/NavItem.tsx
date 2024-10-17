import { JSX } from "preact";

export function NavItem(
  props: JSX.HTMLAttributes & { pathname: string; navPath: string }
) {
  return (
    <a
      class={`font-antic text-3xl ${
        props.pathname === props.navPath ? "font-semibold underline" : ""
      }`}
      href={props.navPath}
    >
      {props.children}
    </a>
  );
}
