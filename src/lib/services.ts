import type { Service, ServiceCategory } from "./types";

import aadhaarCard from "@/data/services/aadhaar-card.json";
import birthCertificate from "@/data/services/birth-certificate.json";
import drivingLicence from "@/data/services/driving-licence.json";
import incomeCertificate from "@/data/services/income-certificate.json";
import panCard from "@/data/services/pan-card.json";
import passport from "@/data/services/passport.json";
import pmKisan from "@/data/services/pm-kisan.json";
import upscCse from "@/data/services/upsc-cse.json";
import vehicleRegistration from "@/data/services/vehicle-registration.json";
import voterId from "@/data/services/voter-id.json";

const services: Service[] = [
  aadhaarCard,
  birthCertificate,
  drivingLicence,
  incomeCertificate,
  panCard,
  passport,
  pmKisan,
  upscCse,
  vehicleRegistration,
  voterId,
] as Service[];

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  identity: "Identity",
  certificates: "Certificates",
  licences: "Licences",
  schemes: "Schemes",
  "exams-jobs": "Exams & Jobs",
  agri: "Agriculture",
  voter: "Voter Services",
  vehicle: "Vehicle",
};

export function getAllServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category);
}

export function getRelatedServices(service: Service): Service[] {
  return service.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}

export function searchServices(query: string): Service[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return services
    .map((service) => {
      const haystacks = [
        service.name,
        service.summary,
        service.department,
        ...service.tags,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (service.name.toLowerCase().includes(q)) score += 10;
      if (service.tags.some((t) => t.toLowerCase().includes(q))) score += 5;
      if (haystacks.includes(q)) score += 1;

      return { service, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.service);
}

export function getStateVariant(service: Service, stateCode: string) {
  return service.stateVariants?.find(
    (v) => v.stateCode === stateCode.toLowerCase()
  );
}

export function getServicesWithStateVariants(): Service[] {
  return services.filter((s) => s.stateVariants && s.stateVariants.length > 0);
}

export function getRecentlyUpdatedServices(limit = 5): Service[] {
  return [...services]
    .filter((s) => s.changeLog && s.changeLog.length > 0)
    .sort((a, b) => {
      const aDate = a.changeLog![0]?.date ?? "";
      const bDate = b.changeLog![0]?.date ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit);
}
