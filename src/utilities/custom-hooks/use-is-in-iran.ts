import { useGetAddressQuery } from "../../components/InspectionList/api/inspection.api";
import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

const useIsInIran = () => {
  const detectionEnabled = import.meta.env.VITE_DETECT_LOCATION === "YES";
  const [isLocating, setIsLocating] = useState(detectionEnabled);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: address, isFetching, isError, isSuccess } = useGetAddressQuery(currentLocation ?? skipToken);

  useEffect(() => {
    let active = true;
    if (detectionEnabled) {
      if (!navigator.geolocation) {
        setError("مرورگر قابلیت دریافت موقعیت مکانی را ندارد.");
        setIsLocating(false);
        return;
      }

      const geoOptions = {
        enableHighAccuracy: false,
        timeout: 30_000,
        maximumAge: 60_000,
      };

      const handleSuccess = (position: GeolocationPosition) => {
        if (!active) return;
        const { latitude, longitude } = position.coords;

        setCurrentLocation({ latitude, longitude });
        setIsLocating(false);
      };

      const handleError = (err: GeolocationPositionError) => {
        if (!active) return;
        switch (err.code) {
          case 1:
            setError(
              "مرورگر دسترسی به موقعیت مکانی ندارد. از فعال بودن دسترسی موقعیت مکانی برای مرورگر اطمینان حاصل کنید.",
            );
            break;

          case 2:
            setError(
              "مرورگر نتوانست موقعیت را از جی پی اس دریافت کند. از روشن بودن جی پی اس اطمینان حاصل کنید.",
            );
            break;

          case 3:
            setError(
              "دریافت موقعیت مکانی بیش از حد طول کشید. در فضایی باز بروید و دوباره امتحان کنید.",
            );
            break;
          default:
            setError("دریافت موقعیت مکانی با خطا مواجه شد. لطفا دوباره امتحان کنید.");
        }

        setIsLocating(false);
      };

      try {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
      } catch {
        setError("دریافت موقعیت مکانی با خطا مواجه شد. لطفا دوباره امتحان کنید.");
        setIsLocating(false);
      }
    } else {
      setIsLocating(false);
      setCurrentLocation({
        latitude: 32.65800008148353,
        longitude: 51.666533946990974,
      });
      setError(null);
    }
    return () => { active = false; };
  }, [detectionEnabled]);

  const country = address?.address?.country;
  const addressError = detectionEnabled && (isError || (isSuccess && !country))
    ? "دریافت آدرس موقعیت مکانی انجام نشد. اتصال اینترنت را بررسی و دوباره امتحان کنید."
    : null;
  const isInIran: boolean | null = !detectionEnabled ? true : country ? country === "Iran" : null;
  const isLoading = detectionEnabled && (isLocating || Boolean(currentLocation && isFetching));

  return { isInIran, address, currentLocation, isLoading, error: error ?? addressError };
};

export default useIsInIran;
