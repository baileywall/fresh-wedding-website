import { JSX } from "preact";

export function PageHeader(props: JSX.HTMLAttributes) {
  return <h1 class="md:hidden font-script text-8xl">{props.children}</h1>;
}
