import {
  AccessibleCompany,
  ActiveCompany,
  CompanyAccess,
} from "../types/CompanyContext";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toCompany = (value: unknown): ActiveCompany | null => {
  if (!isRecord(value) || typeof value.id !== "number") return null;

  return {
    id: value.id,
    name: typeof value.name === "string" ? value.name : null,
    ...(typeof value.status === "number" ? { status: value.status } : {}),
  };
};

const isCompanyAccess = (value: unknown): value is CompanyAccess =>
  isRecord(value) &&
  typeof value.source_company_id === "number" &&
  (value.relation === "direct" || value.relation === "descendant") &&
  (value.role === "owner" ||
    value.role === "manager" ||
    value.role === "employee") &&
  (value.access_scope === "direct" || value.access_scope === "descendants");

const isAccessibleCompany = (value: unknown): value is AccessibleCompany =>
  isRecord(value) &&
  typeof value.id === "number" &&
  (typeof value.name === "string" || value.name === null) &&
  (typeof value.parent_id === "number" || value.parent_id === null) &&
  typeof value.status === "number" &&
  typeof value.can_switch === "boolean" &&
  isCompanyAccess(value.access);

/** Supports both the legacy `company` object and the new active-company fields. */
const getActiveCompany = (response: unknown): ActiveCompany | null => {
  if (!isRecord(response)) return null;

  const candidates = [response, response.data].filter(isRecord);

  for (const candidate of candidates) {
    const company = toCompany(candidate.company);
    if (company) return company;

    if (typeof candidate.active_company_id === "number") {
      return {
        id: candidate.active_company_id,
        name:
          typeof candidate.active_company_name === "string"
            ? candidate.active_company_name
            : null,
      };
    }
  }

  return null;
};

/** Reads the company choices returned by login or `verify_token`. */
export const getAccessibleCompanies = (
  response: unknown,
): AccessibleCompany[] => {
  if (!isRecord(response)) return [];

  const candidates = [response, response.data].filter(isRecord);

  for (const candidate of candidates) {
    if (Array.isArray(candidate.accessible_companies)) {
      return candidate.accessible_companies.filter(isAccessibleCompany);
    }
  }

  return [];
};

export default getActiveCompany;
