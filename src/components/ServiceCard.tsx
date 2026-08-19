import Link from "next/link";
import type { Service } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/services";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="block rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        {CATEGORY_LABELS[service.category]}
      </span>
      <h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        {service.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {service.summary}
      </p>
      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        Last verified {service.lastVerified}
      </p>
    </Link>
  );
}
