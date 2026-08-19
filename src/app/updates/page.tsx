import Link from "next/link";
import { getAllServices } from "@/lib/services";

const BASE_URL = "https://gov.inlens.in";

export const metadata = {
  title: "Updates",
  description:
    "Tracked changes to fees, eligibility, and process across Indian government services — so you don't have to check every department's website yourself.",
  alternates: { canonical: `${BASE_URL}/updates` },
};

export default function UpdatesPage() {
  const entries = getAllServices()
    .flatMap((service) =>
      (service.changeLog ?? []).map((change) => ({ service, change }))
    )
    .sort((a, b) => b.change.date.localeCompare(a.change.date));

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
        What&apos;s changed
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Tracked changes to fees, eligibility, and process across government
        services — so you don&apos;t have to check every department&apos;s
        website yourself.
      </p>

      <div className="mt-6 space-y-4">
        {entries.map(({ service, change }, i) => (
          <Link
            key={i}
            href={`/services/${service.slug}`}
            className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {change.date}
            </span>
            <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
              <span className="font-medium">{service.name}:</span>{" "}
              {change.summary}
            </p>
          </Link>
        ))}
      </div>

      {entries.length === 0 && (
        <p className="mt-8 text-zinc-500">No tracked changes yet.</p>
      )}
    </main>
  );
}
