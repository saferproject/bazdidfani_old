import SweetAlertToast from "../../shared/Functions/SweetAlertToast";

export function reportInspectionError(error: unknown): void {
  const response = error as { data?: { message?: string }; message?: string };
  void SweetAlertToast.fire({
    icon: "error",
    text: response?.data?.message ?? response?.message ?? "ذخیره یا ارسال اطلاعات بازدید انجام نشد؛ لطفا دوباره تلاش کنید.",
  });
}
