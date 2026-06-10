import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function InputDisabler() {
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const elements = document.querySelectorAll("input");
      elements?.forEach((element) => {
        element.readOnly = true;
        element.addEventListener("focus", (event) => {
          (event.currentTarget as HTMLInputElement).readOnly = false;
        });
        element.addEventListener("blur", (event) => {
          (event.currentTarget as HTMLInputElement).readOnly = true;
        });
      });
    }
  }, [isClient, location.pathname]);

  return null;
}
