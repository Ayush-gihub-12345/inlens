import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { CATEGORY_LABELS, getAllServices } from "@/lib/services";
import type { ServiceCategory } from "@/lib/types";

const BASE_URL = "https://gov.inlens.in";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];
  const activeCategory = categories.includes(category as ServiceCategory)
    ? (category as ServiceCategory)
    : undefined;

  const title = activeCategory
    ? `${CATEGORY_LABELS[activeCategory]} services`
    : "All services";
  const description = activeCategory
    ? `Government services in the ${CATEGORY_LABELS[activeCategory]} category — eligibility, documents, fees, and official links, explained simply.`
    : "Browse every government service, scheme, and exam covered by gov.inLens, organized by category.";
  const url = activeCategory
    ? `${BASE_URL}/services?category=${activeCategory}`
    : `${BASE_URL}/services`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${title} — gov.inLens`, description },
  };
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const services = getAllServices();
  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];
  const activeCategory = categories.includes(category as ServiceCategory)
    ? (category as ServiceCategory)
    : undefined;

  const filtered = activeCategory
    ? services.filter((s) => s.category === activeCategory)
    : services;

  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-950">
        All services
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
            !activeCategory
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-zinc-300 text-zinc-700 hover:border-emerald-500"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/services?category=${cat}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              activeCategory === cat
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-300 text-zinc-700 hover:border-emerald-500"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-8 text-zinc-500">No services in this category yet.</p>
      )}
    </main>
  );
}
