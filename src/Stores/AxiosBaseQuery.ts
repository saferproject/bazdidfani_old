import SweetAlertToast from "../components/shared/Functions/SweetAlertToast";
import { API_URL } from "./api-urls";
import { RootState } from "./store";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: API_URL + "/api/", // آدرس API را تنظیم کنید
});

const handleError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      SweetAlertToast.fire({
        title: "خطا در احراز هویت",
        text: "لطفاً دوباره وارد حساب کاربری خود شوید.",
        icon: "error",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 3000);
    } else if (error.response?.status === 500)
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
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers }, { getState }) => {
    try {
      // دریافت مقدار توکن از Store
      const state = getState() as RootState;
      const token = state.user.token; // مسیر ذخیره توکن در Store

      // اضافه کردن توکن به هدر در صورت وجود
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: hasAuth ? { ...authHeaders, ...headers } : headers, // ترکیب هدرها
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      handleError(err);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default AxiosBaseQuery;
