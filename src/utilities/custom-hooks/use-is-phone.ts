import { useState, useEffect } from "react";

const useIsPhone = (maxPhoneWidth = 768): boolean => {
	const [isPhone, setIsPhone] = useState(false);

	useEffect(() => {
		const checkIfPhone = () => {
			// User agent detection
			const userAgent = navigator.userAgent;
			const isMobileUserAgent = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(userAgent);

			// Screen size detection
			const hasSmallScreen = window.innerWidth <= maxPhoneWidth;

			// Combined detection logic
			setIsPhone(isMobileUserAgent && hasSmallScreen);
		};

		// Initial check
		checkIfPhone();

		// Add resize listener for responsive changes
		window.addEventListener("resize", checkIfPhone);

		// Cleanup
		return () => window.removeEventListener("resize", checkIfPhone);
	}, [maxPhoneWidth]);

	return isPhone;
};

export default useIsPhone;
