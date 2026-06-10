import useIsInIran from "../../utilities/custom-hooks/use-is-in-iran";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function GetLocationDialog({ setCurrentLocation }) {
  const {
    isInIran,
    currentLocation,
    isLoading: gettingLocation,
    error: locationError,
  } = useIsInIran();

  useEffect(() => {
    if (!gettingLocation && !isInIran)
      SweetAlertToast.fire({
        icon: "error",
        text:
          locationError ??
          "دریافت موقعیت مکانی شما انجام نشد. صفحه را رفرش کنید.",
      });
    else {
      setCurrentLocation(currentLocation);
    }
  }, [isInIran, currentLocation, gettingLocation, locationError]);

  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center">
      <CircularProgress />
    </div>
  );
}
