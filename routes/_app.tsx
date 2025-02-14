import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bailey and Colton</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/ring.png" />
      </head>
      <body class="bg-amber-50 font-merriweather text-tree-green">
        <Component />
      </body>
    </html>
  );
}
