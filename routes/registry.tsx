import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";

export default function Registry() {
  return (
    <MainWrapper>
      <PageHeader>Registry</PageHeader>
      <image src="/trees.png" class="object-cover object-top w-full lg:w-2/4" />
      <div class="text-center text-3xl w-full">Coming soon!</div>
    </MainWrapper>
  );
}
