import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { whenCriticalActivityIdle } from "../utilities/critical-activity";

export default function UpdateDialog() {
  const mounted = useRef(true);
  const cancelReload = useRef<(() => void) | null>(null);

  useRegisterSW({
    onNeedReload() {
      if (!mounted.current) return;
      cancelReload.current?.();
      cancelReload.current = whenCriticalActivityIdle(() =>
        window.location.reload(),
      );
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

  return null;
}
