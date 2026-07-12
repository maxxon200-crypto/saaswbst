import { Sidebar } from "@/components/Sidebar";
import { getStudioContext } from "@/lib/studio";

// The shell reads the session per request.
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getStudioContext();

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar studioName={ctx.studioName} plan={ctx.plan} />
      <div className="pl-sidebar">
        <main className="motion-panel mx-auto min-h-screen w-full max-w-[1200px] px-6 py-9 md:px-12 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
