import { useParams } from "react-router-dom";
import Inspection from "../../../components/InspectionList/Inspection";

export default function TechnicalManagerCheckList() {
	const { id } = useParams();

	return (
		<div>
			<Inspection loaderTypeCode={+id!} />
		</div>
	);
}
