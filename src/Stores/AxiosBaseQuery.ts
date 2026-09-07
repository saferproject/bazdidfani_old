import SweetAlertToast from "../components/shared/Functions/SweetAlertToast";
import { API_URL } from "./api-urls";
import { clear } from "./slices/user";
import { beginCriticalActivity } from "../utilities/critical-activity";
import { createUnauthorizedSessionHandler } from "./utilities/unauthorized-session";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: API_URL + "/api/", // آدرس API را تنظیم کنید
});

const handleUnauthorizedSession = createUnauthorizedSessionHandler();

type SessionState = { user: { token: string | null } };

const handleError = (error: unknown, suppressForbiddenRedirect = false) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 500)
      SweetAlertToast.fire({
        title: "خطا در سامانه",
        text: "در سرور مشکلی ایجاد شده است ، لطفا به پشتیبانی اطلاع دهید.",
        icon: "error",
      });
    else if (error.code === "ERR_NETWORK" || !error.response)
      SweetAlertToast.fire({
        title: "خطا در اتصال به سرور",
        text: "لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش نمایید.",
        icon: "error",
      });
    else if (error.response?.status === 422) {
      if ((error.response?.data as any)?.errors?.length > 0)
        SweetAlertToast.fire({
          icon: "warning",
          html: (error.response?.data as any)?.errors?.join("<br>"),
        });
      else
        SweetAlertToast.fire({
          icon: "warning",
          text: (error.response?.data as any)?.message || error.message,
        });
    } else if (error.response.status === 403) {
      SweetAlertToast.fire({
        title: "دسترسی غیرمجاز",
        text:
          ((error.response?.data as any)?.message || error.message) ??
          "شما اجازه دسترسی به این بخش را ندارید.",
        icon: "error",
      });
      if (!suppressForbiddenRedirect)
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 3000);
    } else
      SweetAlertToast.fire({
        text: `خطایی رخ داده است: ${(error.response?.data as any)?.message || error.message}`,
        icon: "error",
      });
  } else
    SweetAlertToast.fire({
      title: "خطا",
      text: "خطای ناشناخته‌ای رخ داده است. لطفا دوباره تلاش کنید",
      icon: "error",
    });
};

// `axiosBaseQuery` با قابلیت دریافت هدر از Store
const AxiosBaseQuery =
  (
    { baseUrl, hasAuth }: { baseUrl: string; hasAuth?: boolean } = {
      baseUrl: "",
      hasAuth: false,
    },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      suppressForbiddenRedirect?: boolean;
    },
    unknown,
    unknown
  > =>
  async (
    {
      url,
      method = "GET",
      data,
      params,
      headers,
      suppressForbiddenRedirect = false,
    },
    { dispatch, getState, signal },
  ) => {
    const requestToken = (getState() as SessionState).user.token;
    const releaseActivity = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())
      ? beginCriticalActivity()
      : undefined;

    try {
      // دریافت مقدار توکن از Store
      const state = getState() as SessionState;
      const token = state.user.token; // مسیر ذخیره توکن در Store

      // اضافه کردن توکن به هدر در صورت وجود
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        signal,
        headers: hasAuth ? { ...authHeaders, ...headers } : headers, // ترکیب هدرها
      });

      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError;
      const cancelled = signal.aborted || axios.isCancel(error) ||
        (axios.isAxiosError(error) && error.code === "ERR_CANCELED");

      if (!cancelled) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          handleUnauthorizedSession({
            store: getState,
            requestToken,
            getToken: () => (getState() as SessionState).user.token,
            clearSession: () => { dispatch(clear()); },
            notify: () => { SweetAlertToast.fire({
        title: "خطا در احراز هویت",
        text: "لطفاً دوباره وارد حساب کاربری خود شوید.",
        icon: "error",
      }); },
            redirect: () => {
              window.location.href = url === "verify_token"
                ? `/auth?next=${window.location.pathname}`
                : "/auth";
            },
          });
        } else handleError(error, suppressForbiddenRedirect);
      }

      return {
        error: {
          status: err?.response?.status,
          data: err?.response?.data || (error instanceof Error ? error.message : String(error)),
        },
      };
    } finally {
      releaseActivity?.();
    }
  };

export default AxiosBaseQuery;
