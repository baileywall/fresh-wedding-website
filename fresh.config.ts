import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { connection } from "./db.ts";

const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  //@ts-ignore: cron type not recognized
  Deno.cron("write to the db at 11_35pm", "11 23 * * *", () => {
    connection
      .queryObject(`INSERT INTO increment DEFAULT VALUES;`)
      .catch((e) => {
        console.log(e);
      });
  });
}

export default defineConfig({
  plugins: [tailwind()],
});
