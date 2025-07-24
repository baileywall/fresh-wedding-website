import { JSX } from "preact";

export function MainWrapper(props: JSX.HTMLAttributes) {
  return (
    <div class="mx-auto my-16 md:mt-4 px-8 lg:px-56 xl:px-72 flex flex-col gap-8 items-center text-center">
      {props.children}
    </div>
  );
}
