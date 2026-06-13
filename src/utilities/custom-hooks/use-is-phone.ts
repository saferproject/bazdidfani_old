import { useState, useEffect } from "react";

const useIsPhone = (maxPhoneWidth = 768): boolean => {
	const [isPhone, setIsPhone] = useState(false);

	useEffect(() => {
		const checkIfPhone = () => {
			setIsPhone(window.innerWidth <= maxPhoneWidth);
		};

		checkIfPhone();

		window.addEventListener("resize", checkIfPhone);

		return () => window.removeEventListener("resize", checkIfPhone);
	}, [maxPhoneWidth]);

	return isPhone;
};

export default useIsPhone;
