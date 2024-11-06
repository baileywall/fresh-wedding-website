import { JSX } from "preact";

export function PageImage(props: JSX.HTMLAttributes<SVGImageElement>) {
  return <image {...props} class="object-cover object-top w-full md:w-3/4" />;
}
