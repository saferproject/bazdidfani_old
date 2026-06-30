import { Alert, Button } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function UpdateDialog() {
    const {
        needRefresh: [needRefresh]
    } = useRegisterSW({
        onNeedRefresh() {
            console.info("App has been updated. Please refresh the app");
        },
    });

    return needRefresh ? (
    <Alert className="flex flex-row justify-between p-4" severity="info" color="info">
        آپدیت جدید برنامه موجود است. برای اپدیت برنامه بر روی دکمه روبرو کلیک کنید.
        <Button className="gap-2 flex flex-row items-center justify-center" onClick={() => { window.location.href = "/"; }}>
            آپدیت
        </Button>
    </Alert>
    ) : null;
}