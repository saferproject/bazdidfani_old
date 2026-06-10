import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeStep } from "../../../../Stores/slices/user";
import { useLocation } from "react-router-dom";

export default function RemoveAuthStep() {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (!location.pathname.startsWith("/auth")) dispatch(removeStep());
	}, [location.pathname, dispatch]);

	return null;
}
