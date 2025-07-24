import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function Registry() {
  return (
    <MainWrapper>
      <PageHeader>Registry</PageHeader>
      <PageImage src="/trees.png" />
      <p class="text-xl">
        Your presence is the best present we could ask for and a gift is totally
        unnecessary. If you would like to go above and beyond, we would love for
        you to donate to World Central Kitchen in our honor (please include our
        email so we can thank you). We've also registered at Crate and Barrel
        for anyone looking for ideas for a physical gift.
      </p>
      <div class="flex space-x-10">
        <a
          class="text-blue-600 hover:underline text-xl"
          href="https://donate.wck.org/give/499865/#!/donation/checkout"
        >
          World Central Kitchen
        </a>
        <a
          class="text-blue-600 hover:underline text-xl"
          href="https://www.crateandbarrel.com/gift-registry/bailey-wall-and-colton-plaza/r7240692"
        >
          Crate and Barrel
        </a>
      </div>
    </MainWrapper>
  );
}
