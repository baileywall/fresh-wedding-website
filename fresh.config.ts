import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { connection } from "./db.ts";

const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  //@ts-ignore: cron type not recognized
  Deno.cron("write to the db at 12_12am", "12 5 * * *", async () => {
    try {
      await connection.queryObject(`INSERT INTO increment DEFAULT VALUES;`);
    } catch (e) {
      console.log(e);
    }
  });
}

export default defineConfig({
  plugins: [tailwind()],
});
