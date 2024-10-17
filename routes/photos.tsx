import { Photo } from "../components/Photo.tsx";

export default function Photos() {
  return (
    <main class="mx-auto mt-16 px-5 pb-5 flex flex-col gap-8 items-center">
      <h1 class="md:hidden font-qwitcher text-8xl">Photos</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Photo alt="19_04 first_hike" src="/photos/bc_1.jpeg" />
        <Photo alt="19_04 first_yosemite_waterfall" src="/photos/bc_2.jpeg" />
        <Photo alt="19_05 bay_to_breakers" src="/photos/bc_6.jpeg" />
        <Photo alt="19_07 grand_canyon_river" src="/photos/bc_8.jpeg" />
        <Photo alt="19_04 yosemite_half_dome" src="/photos/bc_5.jpeg" />
        <Photo alt="19_04 grand_canyon_waterfall" src="/photos/bc_7.jpeg" />
        <Photo alt="19_07 grand_canyon_lifejackets" src="/photos/bc_9.jpeg" />
        <Photo alt="19_08 viansa" src="/photos/bc_10.jpeg" />
        <Photo alt="19_09 trinity_2" src="/photos/bc_12.jpeg" />
        <Photo alt="19_09 trinity_3" src="/photos/bc_13.jpeg" />
        <Photo alt="19_09 half_dome_1" src="/photos/bc_14.jpeg" />
        <Photo alt="19_09 half_dome_2" src="/photos/bc_15.jpeg" />
        <Photo alt="19_11 half_marathon" src="/photos/bc_16.jpeg" />
        <Photo alt="19_11 preds" src="/photos/bc_17.jpeg" />
        <Photo alt="20_02 steamboat_robes" src="/photos/bc_18.jpeg" />
        <Photo alt="20_02 steamboat_onesies" src="/photos/bc_19.jpeg" />
        <Photo alt="20_07 yosemite_selfie" src="/photos/bc_20.jpeg" />
        <Photo alt="21_02 wine_kitchen_selfie" src="/photos/bc_21.jpeg" />
        <Photo alt="21_07 haleakala" src="/photos/bc_22.jpeg" />
        <Photo alt="22_02 formal_1" src="/photos/bc_28.jpeg" />
        <Photo alt="21_07 hana_waterfall" src="/photos/bc_23.jpeg" />
        <Photo alt="21_09 jessie_nick_wedding" src="/photos/bc_24.jpeg" />
        <Photo alt="21_11 cold_michigan_football" src="/photos/bc_26.jpeg" />
        <Photo alt="22_02 risky_selfie" src="/photos/bc_50.jpeg" />
        <Photo alt="22_07 tahoe_joe" src="/photos/bc_30.jpeg" />
        <Photo alt="22_07 colton_ankle" src="/photos/bc_31.jpeg" />
        <Photo alt="22_07 yosemite_waterfall" src="/photos/bc_32.jpeg" />
        <Photo alt="23_03 jim_risky_selfie" src="/photos/bc_40.jpeg" />
        <Photo alt="22_08 mexican_ruins" src="/photos/bc_34.jpeg" />
        <Photo alt="22_10 the_bus" src="/photos/bc_35.jpeg" />
        <Photo alt="22_11 nyc" src="/photos/bc_36.jpeg" />
        <Photo alt="22_11 napa" src="/photos/bc_37.jpeg" />
        <Photo alt="22_07 shoreline" src="/photos/bc_33.jpeg" />
        <Photo alt="22_11 napa_family" src="/photos/bc_38.jpeg" />
        <Photo alt="23_01 ski_selfie" src="/photos/bc_39.jpeg" />
        <Photo alt="23_04 steamboat_mario" src="/photos/bc_41.jpeg" />
        <Photo alt="23_04 big_m_graduation" src="/photos/bc_43.jpeg" />
        <Photo alt="23_05 bottlerock" src="/photos/bc_44.jpeg" />
        <Photo alt="23_08 big_tree" src="/photos/bc_45.jpeg" />
        <Photo alt="24_03 proposal_knee" src="/photos/bc_48.jpeg" />
        <Photo alt="23_04 bailey_dogs_risky" src="/photos/bc_42.jpeg" />
        <Photo alt="24_03 pineapples" src="/photos/bc_46.jpeg" />
        <Photo alt="24_03 hot_waterfall" src="/photos/bc_47.jpeg" />
        <Photo alt="24_03 proposal_overlook" src="/photos/bc_49.jpeg" />
      </div>
    </main>
  );
}
