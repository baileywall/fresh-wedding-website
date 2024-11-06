import { JSX } from "preact";

export function MainWrapper(props: JSX.HTMLAttributes) {
  return (
    <div class="mx-auto my-16 md:mt-4 px-8 lg:px-32 xl:px-64 flex flex-col gap-8 items-center text-center">
      {props.children}
    </div>
  );
}
