import SearchBox from "@/components/SearchBox";
import ServiceCard from "@/components/ServiceCard";
import { searchServices } from "@/lib/services";

const BASE_URL = "https://gov.inlens.in";

export const metadata = {
  title: "Search",
  description:
    "Search across every government service, scheme, and exam covered by gov.inLens.",
  alternates: { canonical: `${BASE_URL}/search` },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchServices(q);

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <SearchBox defaultValue={q} autoFocus />

      {q && (
        <p className="mt-6 text-sm text-zinc-500">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;
          {q}&rdquo;
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4">
        {results.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      {q && results.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500">
          <p>No matching service yet. inLens is still growing its coverage.</p>
        </div>
      )}
    </main>
  );
}
