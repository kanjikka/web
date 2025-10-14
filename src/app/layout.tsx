import Head from "next/head";
import "./styles/globals.css";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Kanjikka - Lookup Kanji Stroke Order</title>
      </Head>

      <body>{children}</body>
    </html>
  );
}
