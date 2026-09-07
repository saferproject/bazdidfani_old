export const COMPLETE_PROFILE_PATH = "/dashboard/profile?register=true";

type ApiEnvelope = {
  data?: {
    profile_completed?: unknown;
  };
};

export const isProfileIncompleteResponse = (response: unknown): boolean => {
  if (!response || typeof response !== "object") return false;

  return (response as ApiEnvelope).data?.profile_completed === false;
};

export const isInactiveAccountResponse = (
  status: number | undefined,
  response: unknown,
): boolean => {
  if (status !== 400 && status !== 403) return false;
  if (!response || typeof response !== "object") return false;

  const data = (response as { data?: unknown }).data;
  return Array.isArray(data) && data.length === 0;
};
