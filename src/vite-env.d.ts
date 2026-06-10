/// <reference types="vite/client" />
import type {} from "@mui/x-data-grid/themeAugmentation";

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_TEST_API_URL: string;
	readonly VITE_PUBLIC_STORAGE_URL: string;
	readonly VITE_TEST_PUBLIC_STORAGE_URL: string;
	readonly VITE_DETECT_LOCATION: "YES" | "NO";
	readonly VITE_IS_TEST_API: "YES" | "NO";
	readonly REACT_APP_REVERB_APP_KEY: string;
	readonly REACT_APP_REVERB_APP_CLUSTER: string;
	readonly REACT_APP_REVERB_HOST: string;
	readonly REACT_APP_REVERB_PORT: string;
	readonly REACT_APP_REVERB_SCHEME: string;
}
