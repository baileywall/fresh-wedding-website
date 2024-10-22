import type { Handlers, PageProps } from "$fresh/server.ts";
import { connection } from "../db.ts";
import type { PERSON, RSVP } from "../types.ts";

interface Data {
  results: (PERSON & RSVP)[];
  groupId?: number;
  query: string;
}

const getRsvpsInGroupForPerson = async (
  ids: number[]
): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  SELECT DISTINCT first_name, last_name, id, rsvp_group_id, attend_thursday, attend_friday, attend_saturday
  FROM person 
  INNER JOIN (
    SELECT r2.rsvp_group_id, r2.person_id, r2.attend_thursday, r2.attend_friday, r2.attend_saturday
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
          const { rows: rsvpRows } = await getRsvpsInGroupForPerson([
            exactMatchRows[0].id,
          ]);
          return _ctx.render({
            groupId: rsvpRows[0].rsvp_group_id,
            results: rsvpRows,
            query: name,
          });
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

      const { rows: rsvpRows } = await getRsvpsInGroupForPerson(
        rows.map((row) => row.id)
      );

      const rsvpGroupIds = rsvpRows.reduce((prev, curr) => {
        if (prev.includes(curr.rsvp_group_id)) {
          return prev;
        }
        return [...prev, curr.rsvp_group_id];
      }, [] as number[]);

      return _ctx.render({
        groupId:
          rsvpGroupIds.length === 1 ? rsvpRows[0].rsvp_group_id : undefined,
        results: rsvpRows,
        query: name,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong.");
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  },
};

export default function Rsvp({ data }: PageProps<Data>) {
  return (
    <div class="py-8 mx-auto flex flex-col items-center font-antic text-2xl gap-8">
      {/*<div class="text-center text-3xl w-full">Coming soon!</div>*/}
      <form class="font-antic">
        <input type="text" name="n" value={data.query} />
        <button type="submit">Search</button>
      </form>

      {data.results && !data.groupId ? (
        <>
          <div>Select your group:</div>
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
              }, new Map<number, (PERSON & RSVP)[]>())
              .entries()
          ).map((data) => {
            return (
              <div>
                {data[1].map((data) => {
                  return <div>{`${data.first_name} ${data.last_name}`}</div>;
                })}
              </div>
            );
          })}
        </>
      ) : data.results ? (
        <>
          Thursday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_thursday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
          Friday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_friday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
          Saturday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_saturday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
