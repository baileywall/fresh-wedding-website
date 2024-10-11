export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="grid grid-cols-1">
        <div class="col-start-1 row-start-1 h-screen">
          <img
            class="object-cover object-top h-full w-full opacity-50"
            src="/mountain_scene_1.png"
            alt="fall mountains"
          />
        </div>
        <div class="flex flex-col gap-8 items-center col-start-1 row-start-1 z-10 justify-center">
          <h1 class="font-qwitcher font-semibold text-9xl">Bailey + Colton </h1>
          <h2 class="font-antic text-5xl">October 25, 2025</h2>
        </div>
      </div>
    </div>
  );
}
