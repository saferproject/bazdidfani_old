import { useParams } from "react-router-dom";
import Inspection from "../../../../components/InspectionList/Inspection";
import { useAppDispatch } from "../../../../Stores/hooks";
import { setInspectionType } from "../../../../Stores/slices/inspection-type.slice";

export default function SelfStatementCheckList() {
	const { id } = useParams();

	const dispatch = useAppDispatch();

	dispatch(setInspectionType("SELF_STATEMENT"));

	return (
		<div className="w-full">
			<Inspection loaderTypeCode={+id!} />
		</div>
	);
}
