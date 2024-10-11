export default function Details() {
  return (
    <main class="mx-auto mt-32 md:px-5 flex flex-col gap-8 items-center">
      <h1 class="font-qwitcher text-8xl">Weekend Timeline</h1>
      <p class="font-antic text-center px-8 md:px-64">
        We are so excited to celebrate the start of our new chapter with all of
        our family and friends! Our goal is to maximize the amount of time we
        get to spend having fun outside with the people we love, so we’ve
        decided to make our wedding last for the whole weekend.
      </p>
      <p class="font-antic text-center px-8 md:px-64">
        The venue, Brown Mountain Beach Resort, is ours from Thursday afternoon
        until Sunday morning, and it’s got everything we could want for a
        weekend-long party. We would love for you to join for as much of the
        festivities as you’re able!
      </p>
      <image
        src="/timeline.png"
        class="object-cover object-top h-full w-full md:px-48"
      />
    </main>
  );
}
