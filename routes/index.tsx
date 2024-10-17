export default function Home() {
  return (
    <div class="py-8 mx-auto">
      <div class="grid grid-cols-1">
        <div class="col-start-1 row-start-1 h-screen">
          <img
            class="object-cover object-top h-full w-full opacity-50"
            src="/mountain_scene_1.png"
            alt="fall mountains"
          />
        </div>
        <div class="flex flex-col gap-2 items-center col-start-1 row-start-1 z-10 justify-center">
          <h1 class="font-qwitcher font-semibold text-9xl text-center -mb-6">
            Bailey Wall
          </h1>
          <h1 class="font-qwitcher font-semibold text-9xl text-center -my-6">
            +
          </h1>
          <h1 class="font-qwitcher font-semibold text-9xl text-center -mt-6">
            Colton Plaza
          </h1>
          <h2 class="font-antic text-5xl">Lenoir, NC</h2>
          <h2 class="font-antic text-5xl">October 23 - 26, 2025</h2>
        </div>
      </div>
    </div>
  );
}
