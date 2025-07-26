import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function LodgingAndTravel() {
  return (
    <MainWrapper>
      <PageHeader>Lodging and Travel</PageHeader>
      <PageImage src="/food.png" />

      <p>
        Brown Mountain Beach Resort is located at 6785 Brown Mountain Beach Rd,
        Lenoir, NC 28645, right beside Pisgah National Forest. It's a 1.5 hour
        drive from both the Charlotte Douglas International Airport and the
        Asheville Regional Airport.
      </p>

      <p>
        Google Maps currently shows that Brown Mountain Beach Road is closed and
        suggests a much longer route than necessary, but the road is and will be
        open! The drive time is 1.5 hours from the Charlotte airport and you can
        use Waze to see the most direct route.
      </p>

      <p class="font-bold">
        Note: There is very limited cell service at and near the venue, so
        please set your GPS before approaching! Also, BMBR has very limited WiFi
        only in specific locations, including in only some cabins, so please
        plan accordingly.
      </p>

      <h2>Transportation</h2>

      <p>
        There is no Uber/Lyft availability in the area — we recommend carpools
        if possible (contact us if you need help coordinating or are willing to
        drive others!) and getting a rental car if arriving at the airport.
        There is free parking at BMBR. There are also a few local taxi services,
        such as AbbyCab, that can do airport rides but should be booked in
        advance.
      </p>
      <h2>Lodging</h2>

      <p>
        BMBR has limited space onsite for lodging which we are coordinating.{" "}
        <span class="font-bold">
          If you haven’t received communication from us about onsite lodging in
          your invite, then we cannot currently guarantee you a space onsite
        </span>{" "}
        and recommend you book one of the other lodging options below. We will
        do our best to get as many guests onsite as possible and will reach out
        to confirm interest in switching to onsite lodging in the event space
        opens up. For those who do not stay onsite, you'll still be able to
        participate in all of the activities of the weekend.
      </p>

      <p>
        Other lodging options include our hotel block at the nearby Hampton Inn
        in Lenoir (we will provide a link as soon as possible, but for now you
        can call and ask for our room block), as well as some great AirBnB /
        VRBO options in the surrounding area (e.g., Lake James, Lenoir)
      </p>
    </MainWrapper>
  );
}
