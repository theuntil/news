// app/page.tsx
export const revalidate = 60;
export const dynamic = "force-dynamic";

import HomePageClient from "@/components/home/HomePageClient";

export default async function Page() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const data = await fetch(`${base}/api/home-feed`, {
    next: { revalidate: 60 },
  }).then(res => res.json());

  return <HomePageClient data={data} lang="tr" />;
}
