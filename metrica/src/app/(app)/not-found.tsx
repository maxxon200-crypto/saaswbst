import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="label">Not found</p>
      <p className="mt-3 text-body text-stone">That page doesn’t exist.</p>
      <Link href="/projects" className="link-quiet mt-5 text-[15px] text-ink">
        Back to projects
      </Link>
    </div>
  );
}
