import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function FAQ() {
  return (
    <MainWrapper>
      <PageHeader>FAQ</PageHeader>
      <PageImage src="/food.png" />
      <h2>Where do we stay and when should we book?</h2>
      <p>
        <span class="font-bold">
          Hang tight, we'll tell you when to book lodging!
        </span>{" "}
        Our venue, Brown Mountain Beach Resort, has space for many guests to
        stay onsite in cabins (with private rooms) or in yurts. We will send out
        a survey along with our invitation in Spring 2025 to gauge interest, and
        for those who want to stay onsite, we will try to assign groups to
        cabins/yurts so we can maximize the number of people onsite.
      </p>
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
      <p>
        Hotels and Airbnbs are also available nearby for anyone who prefers that
        option. And even if you prefer not to / aren't able to stay at the
        venue, you'll still be able to participate in all of the activities of
        the weekend.
      </p>
      <h2>How do we get there?</h2>
      <p>
        <a href="https://brownmountainbeach.com/" class="underline">
          Brown Mountain Beach Resort
        </a>{" "}
        is located in Lenoir, NC right beside Pisgah National Forest. It's a 1.5
        hour drive from both the Charlotte Douglas International Airport and the
        Asheville Regional Airport.
      </p>
      <h2>What will we do all weekend, and when should I arrive?</h2>
      <p>
        Our camp weekend will have something for everyone! Enjoy some {"R&R"} in
        your cabin hot tub, hop in a canoe or kayak at the riverside just a few
        steps away, or walk on one of the nearby trails to enjoy the scenery.
        We'll also have lots of games organized for some friendly competition if
        anyone wants to challenge Colton in spikeball (you don't).
      </p>
      <p>
        Nights will include group dinner, games, music, and bonfire time. Your
        camp counselors (us) will provide a full itinerary, but you're always
        welcome to choose your own adventure!
      </p>
      <p>
        The daily agenda is TBD, but we recommend arriving{" "}
        <span class="font-bold">Thursday evening</span>
        (3pm check-in) or Friday morning to make the most of the weekend's
        festivities! On Friday evening we'll have a time for welcome toasts (and
        roasts?) after dinner, and on Saturday afternoon we'll have our wedding
        ceremony followed by a reception. Sunday includes a farewell breakfast
        before checkout at 11am.
      </p>
      <h2>What should I bring?</h2>
      <p>
        Your camp counselors will provide a packing list around the time
        invitations and lodging interest surveys go out in Spring 2025. For now,
        you can count on bringing some good walking shoes, a swimsuit, and
        something nice to wear on Saturday that falls under “campfire cocktail
        attire.” We're still workshopping that dress code.
      </p>
    </MainWrapper>
  );
}
