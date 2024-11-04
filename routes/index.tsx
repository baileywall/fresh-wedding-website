export default function Home() {
  return (
    <main class="py-8 mx-auto">
      <div class="grid grid-cols-1">
        <div class="col-start-1 row-start-1 h-screen">
          <img
            class="object-cover object-top h-full w-full opacity-50"
            src="/mountain_scene_1.png"
            alt="fall mountains"
          />
        </div>
        <div class="flex flex-col items-center col-start-1 row-start-1 z-10 justify-center text-center px-10">
          <h1 class="font-script font-semibold text-8xl md:text-9xl">
            Bailey Wall
          </h1>
          <h1 class="font-script font-semibold text-6xl md:text-7xl">and</h1>
          <h1 class="font-script font-semibold text-8xl md:text-9xl">
            Colton Plaza
          </h1>
          <h2 class="text-5xl pt-4">Lenoir, NC</h2>
          <h2 class="text-5xl">October 23 - 26, 2025</h2>
        </div>
      </div>
    </main>
  );
}
