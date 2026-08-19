import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import ServiceCard from "@/components/ServiceCard";
import { CATEGORY_LABELS, getAllServices, getRecentlyUpdatedServices } from "@/lib/services";
import type { ServiceCategory } from "@/lib/types";

export default function Home() {
  const services = getAllServices();
  const recentlyUpdated = getRecentlyUpdatedServices(3);
  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

  return (
    <main className="flex-1">
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
            India&apos;s government, finally explained simply.
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Search any government service, scheme, or exam. inLens explains
            what it is, what you need, and sends you to the official source.
          </p>
          <div className="mt-8">
            <SearchBox />
          </div>
        </div>
      </section>

      {recentlyUpdated.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              What&apos;s changed recently
            </h2>
            <Link
              href="/updates"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all updates →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentlyUpdated.map((service) => {
              const change = service.changeLog![0];
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="block rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 hover:border-amber-400 dark:border-amber-900 dark:bg-amber-950/40"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Changed {change.date}
                  </span>
                  <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                    <span className="font-medium">{service.name}:</span>{" "}
                    {change.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Browse by category
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/services?category=${cat}`}
              className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Popular services
          </h2>
          <Link
            href="/services"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
    </main>
  );
}
