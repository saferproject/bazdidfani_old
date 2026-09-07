import { Alert, Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import SweetAlertToast from "../components/shared/Functions/SweetAlertToast";
import { hasCriticalActivity, subscribeCriticalActivity, whenCriticalActivityIdle } from "../utilities/critical-activity";

export default function UpdateDialog() {
    const isBusy = useSyncExternalStore(subscribeCriticalActivity, hasCriticalActivity, () => false);
    const [isUpdating, setIsUpdating] = useState(false);
    const mounted = useRef(true);
    const cancelReload = useRef<(() => void) | null>(null);
    const {
        needRefresh: [needRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onNeedReload() {
            if (!mounted.current) return;
            cancelReload.current?.();
            cancelReload.current = whenCriticalActivityIdle(() => window.location.reload());
        },
        onRegisterError(error) {
            console.error("Service worker registration failed", error);
        },
    });

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            cancelReload.current?.();
        };
    }, []);

    const handleUpdate = async () => {
        if (hasCriticalActivity() || isUpdating) return;
        setIsUpdating(true);
        try {
            // Wait for activation before reloading, retaining the current route.
            await updateServiceWorker();
        } catch {
            if (!mounted.current) return;
            setIsUpdating(false);
            SweetAlertToast.fire({ icon: "error", text: "به روز رسانی انجام نشد. لطفا دوباره امتحان کنید." });
        }
    };

    return needRefresh ? (
    <Alert className="p-2 flex flex-row items-center bg-sky-200! border! border-sky-500! gap-2" severity="info">
        <Box className="flex flex-row justify-between gap-4 item-center self-stertch! grow">
            <Typography className="align-middle! flex flex-row items-center justify-center" aria-live="polite">
                {isBusy
                    ? "پس از پایان ذخیره اطلاعات و ارسال فایل‌ها، به روز رسانی امکان‌پذیر است."
                    : "به روز رسانی جدید برای برنامه موجود است. برای به روز رسانی، بر روی دکمه روبرو کلیک کنید."}
            </Typography>
            <Button className="gap-2 flex flex-row items-center justify-center" color="primary" variant="contained" disabled={isBusy || isUpdating} onClick={handleUpdate}>
                {isUpdating ? "در حال به روز رسانی" : "به روز رسانی"}
            </Button>
        </Box>
    </Alert>
    ) : null;
}
