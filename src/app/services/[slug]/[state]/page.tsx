import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import {
  CATEGORY_LABELS,
  getServicesWithStateVariants,
  getServiceBySlug,
  getStateVariant,
} from "@/lib/services";

const BASE_URL = "https://gov.inlens.in";

export function generateStaticParams() {
  return getServicesWithStateVariants().flatMap((service) =>
    (service.stateVariants ?? []).map((variant) => ({
      slug: service.slug,
      state: variant.stateCode,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; state: string }>;
}) {
  const { slug, state } = await params;
  const service = getServiceBySlug(slug);
  const variant = service && getStateVariant(service, state);
  if (!service || !variant) return {};

  const title = `${service.name} in ${variant.stateName}`;
  const description = `How to apply for ${service.name} in ${variant.stateName} via ${variant.portalName}: fee, processing time, and validity.`;
  const url = `${BASE_URL}/services/${service.slug}/${variant.stateCode}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: `${title} — gov.inLens`, description },
    twitter: { card: "summary_large_image", title: `${title} — gov.inLens`, description },
  };
}

export default async function ServiceStatePage({
  params,
}: {
  params: Promise<{ slug: string; state: string }>;
}) {
  const { slug, state } = await params;
  const service = getServiceBySlug(slug);
  const variant = service && getStateVariant(service, state);
  if (!service || !variant) notFound();

  const url = `${BASE_URL}/services/${service.slug}/${variant.stateCode}`;

  const governmentServiceLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: `${service.name} — ${variant.stateName}`,
    description: service.summary,
    url,
    provider: {
      "@type": "GovernmentOrganization",
      name: variant.portalName,
      areaServed: variant.stateName,
    },
    serviceType: CATEGORY_LABELS[service.category],
    offers: { "@type": "Offer", description: variant.fee },
  };

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <JsonLd data={governmentServiceLd} />

      <nav className="text-sm text-zinc-500">
        <Link href="/services" className="hover:text-emerald-600">
          Services
        </Link>{" "}
        /{" "}
        <Link href={`/services/${service.slug}`} className="hover:text-emerald-600">
          {service.name}
        </Link>{" "}
        / {variant.stateName}
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
        {service.name} in {variant.stateName}
      </h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Issued through {variant.portalName}. {service.summary}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={variant.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Apply on {variant.portalName} ↗
        </a>
        <Link
          href={`/services/${service.slug}`}
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-emerald-500 dark:border-zinc-700 dark:text-zinc-300"
        >
          General requirements ↗
        </Link>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Stat label="Fee" value={variant.fee} />
        <Stat label="Processing time" value={variant.processingTime} />
        <Stat label="Validity" value={variant.validity} />
        <Stat label="Portal" value={variant.portalName} />
      </dl>

      {variant.notes && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <span className="font-semibold">Note for {variant.stateName}: </span>
          {variant.notes}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Documents required
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-zinc-700 dark:text-zinc-300">
          {service.documents.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {(service.stateVariants?.length ?? 0) > 1 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Other states
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.stateVariants!
              .filter((v) => v.stateCode !== variant.stateCode)
              .map((v) => (
                <Link
                  key={v.stateCode}
                  href={`/services/${service.slug}/${v.stateCode}`}
                  className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-300"
                >
                  {v.stateName}
                </Link>
              ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-xs text-zinc-400">
        Source: {variant.portalName}. Last verified {service.lastVerified}.
        State fees and processing times change — always confirm on the
        official portal before applying.
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}
