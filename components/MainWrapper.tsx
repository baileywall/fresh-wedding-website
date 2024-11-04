import { JSX } from "preact";

export function MainWrapper(props: JSX.HTMLAttributes) {
  return (
    <main class="mx-auto mt-16 md:mt-4 md:px-5 flex flex-col gap-8 items-center">
      {props.children}
    </main>
  );
}
