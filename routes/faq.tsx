import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function FAQ() {
  return (
    <MainWrapper>
      <PageHeader>FAQ</PageHeader>
      <PageImage src="/food.png" />
      <h2>What is the BMBR lodging like?</h2>
      <p>
        BMBR has video walkthroughs of each{" "}
        <a
          href="https://brownmountainbeach.com/riverfront-mountain-cabins/"
          class="underline"
        >
          cabin
        </a>{" "}
        and{" "}
        <a
          href="https://brownmountainbeach.com/about-brown-mountain-beach/accommodations/yurts/"
          class="underline"
        >
          yurt
        </a>{" "}
        on their website for anyone who's curious. Every onsite lodging option
        comes with real beds (don't worry), a fire ring, and a hot tub. It's
        where we'll be staying, and we highly recommend it!
      </p>
      <h2>What will we do all weekend, and when should I arrive?</h2>
      <p>
        {`Our camp weekend will have something for everyone! Enjoy some R&R in
        your cabin hot tub, hop in a canoe or kayak at the riverside just a few
        steps away, walk on one of the nearby trails to enjoy the scenery, or go
        meet BMBR’s alpacas and donkeys. We'll also have lawn games out for some
        friendly competition if anyone wants to challenge Colton in spikeball
        (you don't).`}
      </p>
      <p>
        Nights will include group dinner, games, music, and bonfire time. We’ll
        provide a full itinerary, but you're always welcome to choose your own
        adventure!
      </p>
      <p>
        We recommend arriving Thursday evening (Check-in begins at 3pm at BMBR)
        or Friday morning to make the most of the weekend. On Friday evening
        we'll have a time for welcome toasts (and roasts?) after dinner, and on
        Saturday afternoon we'll have our wedding ceremony followed by a
        reception. Sunday includes a farewell breakfast before checkout at 11am.
      </p>
      <h2>What should I bring?</h2>
      <p>
        Clothes: Events besides the ceremony and reception (semi-formal) will be
        totally casual dress, so bring whatever is comfortable that you don’t
        mind having next to a bonfire! Other items include athletic clothing if
        you want to take part in some of our field day games or morning hike and
        a bathing suit (for the cabin hot tubs or river if you’re feeling
        adventurous). Be sure sure to check the weather before packing, as late
        October can vary a lot in this area.
      </p>
      <p>
        Toiletries / bedding: Cabins do not include toiletries, so please bring
        along your own supply. Cabin beds will come ready for you with fresh
        sheets.
      </p>
      <p>
        {`Food & drinks: For those staying onsite, we will provide some basic DIY
        brunch and snack supplies in the cabins for Friday and Saturday — no
        need to supplement unless you have specific preferences. There’s also a
        cafe open at BMBR all weekend for breakfast and lunch.`}
      </p>
      <h2>Will there be cell service or internet?</h2>
      <p>
        The vast majority of cabins do not have wifi access. You can find wifi
        access at a few common areas, but it is limited. Cell service is also
        very spotty in the area, so please plan accordingly.
      </p>
      <h2>How do I get there?</h2>
      <p>
        BMBR is located at 6785 Brown Mountain Beach Rd, Lenoir, NC 28645, right
        beside Pisgah National Forest. It's a 1.5 hour drive from both the
        Charlotte Douglas International Airport and the Asheville Regional
        Airport.
      </p>
      <p>
        Google Maps currently shows that Brown Mountain Beach Road is closed and
        suggests a much longer route than necessary, but the road is and will be
        open! The drive time is 1.5 hours from the Charlotte airport and you can
        use Waze to see the most direct route.
      </p>
      <p>
        There is no Uber/Lyft availability in the area. We recommend carpools if
        possible and getting a rental car if arriving at the airport - there is
        free parking at BMBR. There are also a few local taxi services, such as
        AbbyCab, that can do airport rides but should be booked in advance.
      </p>
    </MainWrapper>
  );
}
