import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function Details() {
  return (
    <MainWrapper>
      <PageHeader>Details</PageHeader>
      <PageImage src="/wedding.png" />
      <p>
        We are so excited to celebrate the start of our new chapter with our
        family and friends! Our goal is to maximize the amount of time we get to
        spend having fun outside with the people we love, so we've decided to
        make our wedding last for the whole weekend.
      </p>
      <p>
        The venue, Brown Mountain Beach Resort, is ours from Thursday afternoon
        until Sunday morning, and it's got everything we could want for a
        weekend-long party. We would love for you to join for as much of the
        festivities as you're able!
      </p>
      <image src="/timeline.png" class="object-cover object-top lg:w-2/4" />
    </MainWrapper>
  );
}
