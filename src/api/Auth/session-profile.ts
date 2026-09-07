import type { IPersonal, IRole } from "../../Stores/slices/user";
import type CompanyUsage from "../../pages/dashboard/admin/enums/company-usage.enum";

export interface SessionUser {
  personal?: IPersonal;
  username?: string;
  images?: { image_type: string; url: string }[];
  roles?: { role?: IRole }[];
  user_company?: { company?: { company_usage?: CompanyUsage } }[];
}

export function getSessionProfile(user: SessionUser | undefined, storageUrl: string) {
  const images = Array.isArray(user?.images) ? user.images : [];
  const profileImage = images.find((image) => image?.image_type === "profile")?.url;
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  return {
    profileImage: profileImage ? `${storageUrl}${profileImage}` : "",
    roles: roles.map((item) => ({
      name: item?.role?.name,
      description: item?.role?.description,
    })),
  };
}
