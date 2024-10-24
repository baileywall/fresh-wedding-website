import type { Handlers, PageProps } from "$fresh/server.ts";
import { connection } from "../../db.ts";
import type { PERSON } from "../../types.ts";
import { NUMBER_TO_ELEMENT } from "../../util.ts";

interface Data {
  results: (PERSON & { rsvp_group_id: number })[];
  query: string;
}

const getRsvpGroups = async (
  ids: number[]
): Promise<{ rows: (PERSON & { rsvp_group_id: number })[] }> => {
  const { rows } = await connection.queryObject<
    PERSON & { rsvp_group_id: number }
  >(`
  SELECT DISTINCT first_name, last_name, id, rsvp_group_id
  FROM person 
  INNER JOIN (
    SELECT r2.rsvp_group_id, r2.person_id
    FROM rsvp r1
    INNER JOIN rsvp r2
    ON r1.rsvp_group_id = r2.rsvp_group_id
    WHERE r1.person_id IN (${ids.join(",")})
  ) r3 on r3.person_id = person.id;
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    try {
      const url = new URL(req.url);
      const name = decodeURIComponent(url.searchParams.get("n") || "");
      if (!name || name.length === 0) {
        return _ctx.render({ results: [], query: "" });
      }

      const names = name.split(" ");

      if (names.length === 2) {
        const { rows: exactMatchRows } = await connection.queryObject<PERSON>(`
        SELECT * from person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        AND UPPER(last_name) LIKE UPPER('%${names[1]}%')
        `);

        // person exact match
        if (exactMatchRows.length === 1) {
          const { rows: rsvpRows } = await getRsvpGroups([
            exactMatchRows[0].id,
          ]);
          const element = NUMBER_TO_ELEMENT.get(rsvpRows[0].rsvp_group_id);
          if (element) {
            const headers = new Headers();
            headers.set("location", `/rsvp/${element}`);
            return new Response(null, {
              status: 303,
              headers,
            });
          }
        }
      }

      const { rows } =
        names.length === 1
          ? await connection.queryObject<PERSON>(`
        SELECT * from person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[0]}%')`)
          : await connection.queryObject<PERSON>(`
        SELECT * FROM person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(first_name) LIKE UPPER('%${names[1]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[1]}%')`);

      const { rows: rsvpRows } = await getRsvpGroups(rows.map((row) => row.id));

      const rsvpGroupIds = rsvpRows.reduce((prev, curr) => {
        if (prev.includes(curr.rsvp_group_id)) {
          return prev;
        }
        return [...prev, curr.rsvp_group_id];
      }, [] as number[]);

      if (rsvpGroupIds.length === 1) {
        const element = NUMBER_TO_ELEMENT.get(rsvpRows[0].rsvp_group_id);
        if (element) {
          const headers = new Headers();
          headers.set("location", `/rsvp/${element}`);
          return new Response(null, {
            status: 303,
            headers,
          });
        }
      }

      return _ctx.render({
        results: rsvpRows,
        query: name,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong.");
    } finally {
      connection.release();
    }
  },
};

export default function Rsvp({ data }: PageProps<Data>) {
  return (
    <div class="py-8 mx-auto flex flex-col items-center gap-8">
      <h1 class="md:hidden font-script text-8xl">RSVP</h1>
      <image
        src="/beverages.png"
        class="object-cover object-top w-full lg:w-2/4"
      />
      {/* TODO remove hidden class */}
      <div class="hidden text-xl text-center px-8 lg:px-64">
        Please enter your first and last name. You will be able to RSVP for your
        whole group.
      </div>
      <div class="text-center text-3xl w-full">Coming soon!</div>
      {/* TODO remove hidden class */}
      <form class="hidden text-xl">
        <input type="text" name="n" class="mr-4" value={data.query} />
        <button type="submit">Search</button>
      </form>

      {data.results.length > 0 ? (
        <div class="px-8 w-full lg:w-2/4 text-xl">
          <div class="text-center pb-6">
            Select your group or try searching again:
          </div>
          <hr class="border-tree-green" />
          {Array.from(
            data.results
              .reduce((prev, curr) => {
                const existing = prev.get(curr.rsvp_group_id);
                if (existing) {
                  prev.set(curr.rsvp_group_id, [...existing, curr]);
                } else {
                  prev.set(curr.rsvp_group_id, [curr]);
                }
                return prev;
              }, new Map<number, (PERSON & { rsvp_group_id: number })[]>())
              .entries()
          ).map((data, index) => {
            return (
              <>
                {index > 0 && <hr class="border-tree-green" />}
                <div class="flex w-full py-6 items-center">
                  <div class="flex flex-col flex-grow">
                    {data[1].map((data) => {
                      return (
                        <div>{`${data.first_name} ${data.last_name}`}</div>
                      );
                    })}
                  </div>
                  <a
                    href={`/rsvp/${NUMBER_TO_ELEMENT.get(data[0])}`}
                    class="text-blue-600 hover:underline"
                  >
                    Select
                  </a>
                </div>
              </>
            );
          })}
          <hr class="border-tree-green" />
        </div>
      ) : null}
    </div>
  );
}
