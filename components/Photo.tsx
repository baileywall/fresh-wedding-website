import { JSX } from "preact";

export function Photo(props: JSX.HTMLAttributes<SVGImageElement>) {
  return <image {...props} class="object-cover" />;
}
