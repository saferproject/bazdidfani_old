import { useSearchParams } from "react-router-dom";
import NewDriver from "../../../components/Driver/NewDriver";

export default function AddDriver() {
	const [searchParams] = useSearchParams();

	return (
		<NewDriver
			formMode={searchParams.get("mode")}
			nationalCode={searchParams.get("nationalCode")}
		/>
	);
}
