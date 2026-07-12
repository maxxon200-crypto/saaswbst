import type { Metadata } from "next";
import { ShareView } from "@/components/share/ShareView";
import { getSharedProject } from "@/lib/data/share";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Specification",
  robots: { index: false, follow: false },
};

export default async function SharePage({ params }: { params: { token: string } }) {
  const data = await getSharedProject(params.token);

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="text-center">
          <p className="label">Link unavailable</p>
          <p className="mt-3 text-body text-stone">
            This approval link is no longer active. Ask the studio for a new one.
          </p>
        </div>
      </main>
    );
  }

  return <ShareView data={data} token={params.token} />;
}
