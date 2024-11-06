import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function Registry() {
  return (
    <MainWrapper>
      <PageHeader>Registry</PageHeader>
      <PageImage src="/trees.png" />
      <p class="text-3xl">Coming soon!</p>
    </MainWrapper>
  );
}
