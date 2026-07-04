import { Alert, Box, Button, Typography } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function UpdateDialog() {
    const {
        needRefresh: [needRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onNeedRefresh() {
            console.info("App has been updated. Please refresh the app");
        },
    });

    return needRefresh ? (
    <Alert className="p-2 flex flex-row items-center bg-sky-200! border! border-sky-500! gap-2" severity="info">
        <Box className="flex flex-row justify-between gap-4 item-center self-stertch! grow">
            <Typography className="align-middle! flex flex-row items-center justify-center">
                به روز رسانی جدید برای برنامه موجود است. برای به روز رسانی، بر روی دکمه روبرو کلیک کنید.
            </Typography>
            <Button className="gap-2 flex flex-row items-center justify-center" color="primary" variant="contained" onClick={async () => {
                await updateServiceWorker();
                window.location.href = "/";
            }}>
                به روز رسانی
            </Button>
        </Box>
    </Alert>
    ) : null;
}