import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServiceCard from "@/components/ServiceCard";
import {
  CATEGORY_LABELS,
  getAllServices,
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/services";

const BASE_URL = "https://gov.inlens.in";

export function generateStaticParams() {
  return getAllServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const url = `${BASE_URL}/services/${service.slug}`;
  return {
    title: service.name,
    description: service.summary,
    keywords: service.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${service.name} — gov.inLens`,
      description: service.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} — gov.inLens`,
      description: service.summary,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service);
  const latestChange = service.changeLog?.[0];
  const url = `${BASE_URL}/services/${service.slug}`;

  const governmentServiceLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: service.name,
    description: service.summary,
    url,
    provider: {
      "@type": "GovernmentOrganization",
      name: service.department,
    },
    serviceType: CATEGORY_LABELS[service.category],
    audience: {
      "@type": "Audience",
      audienceType: service.eligibility.join("; "),
    },
    offers:
      service.fee && service.fee !== "Free"
        ? { "@type": "Offer", description: service.fee }
        : undefined,
  };

  const faqLd =
    service.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Services", item: `${BASE_URL}/services` },
      {
        "@type": "ListItem",
        position: 2,
        name: CATEGORY_LABELS[service.category],
        item: `${BASE_URL}/services?category=${service.category}`,
      },
      { "@type": "ListItem", position: 3, name: service.name, item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <JsonLd data={governmentServiceLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />

      <nav className="text-sm text-zinc-500">
        <Link href="/services" className="hover:text-emerald-600">
          Services
        </Link>{" "}
        /{" "}
        <Link
          href={`/services?category=${service.category}`}
          className="hover:text-emerald-600"
        >
          {CATEGORY_LABELS[service.category]}
        </Link>
      </nav>

      <h1 className="mt-2 text-3xl font-bold text-zinc-950">
        {service.name}
      </h1>
      <p className="mt-2 text-lg text-zinc-600">
        {service.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
        <span>{service.department}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5"
          >
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Last verified {service.lastVerified}
        </span>
      </div>

      {latestChange && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Recently changed ({latestChange.date}):</span>{" "}
          {latestChange.summary}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {service.applyUrl && (
          <a
            href={service.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Apply on official site ↗
          </a>
        )}
        {service.trackUrl && (
          <a
            href={service.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-emerald-500"
          >
            Track application ↗
          </a>
        )}
        <a
          href={service.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-emerald-500"
        >
          Official source ↗
        </a>
      </div>

      {service.stateVariants && service.stateVariants.length > 0 && (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-900">
            This service is issued by state governments — the portal, fee,
            and processing time vary. Select your state:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.stateVariants.map((v) => (
              <Link
                key={v.stateCode}
                href={`/services/${service.slug}/${v.stateCode}`}
                className="rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:border-emerald-500"
              >
                {v.stateName}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Section title="Who is eligible">
        <ul className="list-disc space-y-1.5 pl-5 text-zinc-700">
          {service.eligibility.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Documents required">
        <ul className="list-disc space-y-1.5 pl-5 text-zinc-700">
          {service.documents.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Fee">
        <p className="text-zinc-700">{service.fee}</p>
      </Section>

      <Section title="How to apply — step by step">
        <ol className="list-decimal space-y-1.5 pl-5 text-zinc-700">
          {service.process.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Section>

      {service.faq.length > 0 && (
        <Section title="Frequently asked questions">
          <div className="space-y-4">
            {service.faq.map((item, i) => (
              <div key={i}>
                <p className="font-medium text-zinc-900">
                  {item.question}
                </p>
                <p className="mt-1 text-zinc-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <p className="mt-10 text-xs text-zinc-400">
        Source: {service.source}. Last verified {service.lastVerified}. inLens
        summarizes public information for convenience — always confirm fees
        and requirements on the official source before applying.
      </p>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-950">
            Related services
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <ServiceCard key={r.slug} service={r} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-zinc-950">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
