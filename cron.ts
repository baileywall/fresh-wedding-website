import { connection } from "./db.ts";

// @ts-ignore: cron type not recognized
Deno.cron("write to the db at 11:11pm", "11 23 * * *", () => {
  connection.queryObject(`INSERT INTO increment DEFAULT VALUES;`).catch((e) => {
    console.log(e);
  });
});
