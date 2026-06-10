import { useGetAddressQuery } from "../../components/InspectionList/api/inspection.api";
import { useEffect, useState } from "react";

const useIsInIran = () => {
  const [isInIran, setIsInIran] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: address } = useGetAddressQuery(currentLocation, {
    skip: !currentLocation,
  });

  useEffect(() => {
    if (import.meta.env.VITE_DETECT_LOCATION === "YES") {
      if (!navigator.geolocation) {
        setError("مرورگر قابلیت دریافت موقعیت مکانی را ندارد.");
        setIsLoading(false);
        return;
      }

      const geoOptions = {
        enableHighAccuracy: false,
        timeout: 30_000,
        maximumAge: 60_000,
      };

      const handleSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;

        setCurrentLocation({ latitude, longitude });
      };

      const handleError = (err: GeolocationPositionError) => {
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
        }

        setIsLoading(false);
      };

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions,
      );
    } else {
      setIsLoading(false);
      setIsInIran(true);
      setCurrentLocation({
        latitude: 32.65800008148353,
        longitude: 51.666533946990974,
      });
      setError(null);
    }
  }, []);

  if (isLoading && address) {
    if (address.address.country === "Iran") setIsInIran(true);

    setIsLoading(false);
  }

  return { isInIran, address, currentLocation, isLoading, error };
};

export default useIsInIran;
