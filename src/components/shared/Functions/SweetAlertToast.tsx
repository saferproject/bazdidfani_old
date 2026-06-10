import { toast } from "sonner";

type ToastIcon = "success" | "error" | "warning" | "info" | "question";

interface SonnerAlertToastOptions {
  icon?: ToastIcon;
  title?: string;
  text?: string;
  html?: string;
}

const fire = ({
  icon = "info",
  title,
  text,
  html,
}: SonnerAlertToastOptions) => {
  const message = title || text || html || "";
  const description = title && text ? text : undefined;

  switch (icon) {
    case "success":
      return toast.success(message, { description });
    case "error":
      return toast.error(message, { description });
    case "warning":
      return toast.warning(message, { description });
    default:
      return toast.info(message, { description });
  }
};

const SweetAlertToast = {
  fire,
  promise: toast.promise,
};

export default SweetAlertToast;
