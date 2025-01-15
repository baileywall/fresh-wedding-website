import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../components/MainWrapper.tsx";
import { PageHeader } from "../../components/PageHeader.tsx";
import { PageImage } from "../../components/PageImage.tsx";
import { connection } from "../../db.ts";
import type { PERSON } from "../../types.ts";
import { NUMBER_TO_ELEMENT } from "../../util.ts";

interface Data {
  results: (PERSON & { rsvp_group_id: number })[] | null;
  query: string;
}

const getRsvpGroups = async (
  ids: number[]
): Promise<{ rows: (PERSON & { rsvp_group_id: number })[] }> => {
  if (ids.length === 0) {
    return { rows: [] };
  }
  const { rows } = await connection.queryObject<
    PERSON & { rsvp_group_id: number }
  >(`
  SELECT DISTINCT first_name, last_name, id, rsvp_group_id
  FROM person 
  INNER JOIN (
    SELECT r2.rsvp_group_id, r2.person_id
    FROM rsvp_group_assignment r1
    INNER JOIN rsvp_group_assignment r2
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
        return _ctx.render({ results: null, query: "" });
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
    <MainWrapper>
      <PageHeader>RSVP</PageHeader>
      <PageImage src="/beverages.png" />
      <p class="text-3xl">Coming soon!</p>
      <p class="hidden text-xl">
        Please enter your first and last name. You will be able to RSVP for your
        whole group.
      </p>
      <form class="hidden text-xl">
        <input
          type="text"
          name="n"
          class="mr-4 p-1 rounded-md border-2 border-tree-green"
          value={data.query}
        />
        <button type="submit">Search</button>
      </form>

      {data.results ? (
        <>
          <p class="text-xl mb-6">Select your group or try searching again:</p>
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
                {index === 0 && <hr class="border-tree-green w-full" />}
                <div class="flex w-full py-6 items-center justify-between">
                  <div class="flex flex-col">
                    {data[1].map((data) => {
                      return (
                        <p class="text-xl">{`${data.first_name} ${data.last_name}`}</p>
                      );
                    })}
                  </div>
                  <a
                    href={`/rsvp/${NUMBER_TO_ELEMENT.get(data[0])}`}
                    class="text-blue-600 hover:underline text-xl"
                  >
                    Select
                  </a>
                </div>
                <hr class="border-tree-green w-full" />
              </>
            );
          })}
        </>
      ) : null}
    </MainWrapper>
  );
}
