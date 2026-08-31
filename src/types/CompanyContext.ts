export type CompanyAccess = {
  access_scope: "direct" | "descendants";
  relation: "direct" | "descendant";
  role: "owner" | "manager" | "employee";
  source_company_id: number;
};

export type ActiveCompany = {
  id: number;
  name: string | null;
  status?: number;
};

export type AccessibleCompany = ActiveCompany & {
  access: CompanyAccess;
  can_switch: boolean;
  parent_id: number | null;
  status: number;
};

export type AccessibleCompaniesResponse = {
  data: AccessibleCompany[];
  message: string;
  success: boolean;
};

export type CompanyContextResponse = {
  data: {
    access: CompanyAccess;
    company: ActiveCompany;
  };
  message: string;
  success: boolean;
};
