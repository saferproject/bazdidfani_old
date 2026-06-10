export const API_URL = import.meta.env.VITE_IS_TEST_API === "YES" ? import.meta.env.VITE_TEST_API_URL : import.meta.env.VITE_API_URL;
export const STORAGE_URL =
	import.meta.env.VITE_IS_TEST_API === "YES" ? import.meta.env.VITE_TEST_PUBLIC_STORAGE_URL : import.meta.env.VITE_PUBLIC_STORAGE_URL;
