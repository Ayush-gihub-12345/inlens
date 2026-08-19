import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
        We haven&apos;t mapped this one yet
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        That page doesn&apos;t exist on gov.inLens. Try searching for the
        service you need, or browse everything we cover.
      </p>
      <div className="mt-8 w-full max-w-md">
        <SearchBox autoFocus />
      </div>
      <Link
        href="/services"
        className="mt-6 text-sm font-medium text-emerald-600 hover:text-emerald-700"
      >
        Browse all services →
      </Link>
    </main>
  );
}
