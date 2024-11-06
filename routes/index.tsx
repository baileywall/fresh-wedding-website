export default function Home() {
  return (
    <div class="py-8 mx-auto grid grid-cols-1">
      <div class="col-start-1 row-start-1 h-screen">
        <img
          class="object-cover object-top h-full w-full opacity-50"
          src="/mountain_scene_1.png"
          alt="fall mountains"
        />
      </div>
      <main class="flex flex-col items-center col-start-1 row-start-1 z-10 justify-center text-center px-10">
        <p class="font-script font-semibold text-8xl md:text-9xl">
          Bailey Wall
        </p>
        <p class="font-script font-semibold text-6xl md:text-7xl">and</p>
        <p class="font-script font-semibold text-8xl md:text-9xl">
          Colton Plaza
        </p>
        <p class="text-5xl pt-4">Lenoir, NC</p>
        <p class="text-5xl">October 23 - 26, 2025</p>
      </main>
    </div>
  );
}
