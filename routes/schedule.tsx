import { MainWrapper } from "../components/MainWrapper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { PageImage } from "../components/PageImage.tsx";

export default function Details() {
  return (
    <MainWrapper>
      <PageHeader>Schedule</PageHeader>
      <PageImage src="/wedding.png" />
      <p>
        We are so excited to celebrate the start of our new chapter with our
        family and friends! Our goal is to maximize the amount of time we get to
        spend having fun outside with the people we love, so we have fun events
        scheduled throughout the weekend.
      </p>
      <p>
        The venue is entirely ours for the weekend, so BMBR will be open to
        gather throughout the day and between events for those staying onsite or
        offsite. We’ll have optional activities in the morning and early
        afternoon, so feel free to drop in at your leisure! We’ll provide
        additional details of morning and early afternoon activities closer to
        the weekend
      </p>
      <p>
        Note: All events are taking place at Brown Mountain Beach Resort, which
        is located at 6785 Brown Mountain Beach Rd, Lenoir, NC 28645. There is
        very limited cell service at and near the venue, so please set your GPS
        before approaching!
      </p>
      <p>
        Google Maps currently shows that Brown Mountain Beach Road is closed and
        suggests a much longer route than necessary, but the road is and will be
        open! The drive time is 1.5 hours from the Charlotte airport and you can
        use Waze to see the most direct route.
      </p>
      <p class="text-4xl">Main events</p>

      <h2>Thursday, October 23</h2>

      <div class="flex flex-col">
        <h3>Cabin Check-In: 3pm </h3>

        <p>
          Lodging opens at Brown Mountain Beach Resort for those staying onsite
          — feel free to arrive any time after 3 and enjoy some kickback time
          before the festivities.
        </p>
      </div>

      <div class="flex flex-col">
        <h3>{"Welcome BBQ & Bonfire: 6 - 7:30pm"}</h3>

        <p class="italic">Dress: Casual </p>

        <p>
          For those arriving early, we’ll have a casual BBQ dinner hosted by
          head grillmaster Jim Wall and his sous chef, Colton.{" "}
        </p>
      </div>

      <h2>Friday, October 24</h2>

      <div class="flex flex-col">
        <h3>Field Day: 12pm</h3>

        <p>Lawn games, drinks, and a little organized competition</p>
      </div>

      <div class="flex flex-col">
        <h3>{"Welcome Drinks & Live Music: 5pm"}</h3>
        <p>Come enjoy drinks by the river and live music</p>
      </div>

      <div class="flex flex-col">
        <h3>{"Welcome Dinner, Bonfire, & Toasts: 6pm"}</h3>
        <p class="italic">Dress: Casual</p>
        <p>
          A good old fashioned North Carolina pig pickin’ (with some veggie
          options of course) followed by bonfire.
        </p>
      </div>

      <h2>Saturday, October 25</h2>

      <div class="flex flex-col">
        <h3>Morning Hike: 10am (Leave From BMBR)</h3>

        <p>
          Take in the western NC fall with a nearby hike in the Blue Ridge
          Mountains
        </p>
      </div>

      <div class="flex flex-col">
        <h3>{"Wedding Ceremony & Cocktail Hour: 5pm"}</h3>

        <p class="italic">Dress: Semi-formal (suits or a step below is OK!)</p>
      </div>

      <h3>Reception: 6:30</h3>

      <h3>{"Bonfire & Afterparty: 11pm"}</h3>

      <h2>Sunday, October 26</h2>

      <h3>Pancake Breakfast: 8:30</h3>

      <h3>Cabin Check-Out: 11am</h3>
    </MainWrapper>
  );
}
