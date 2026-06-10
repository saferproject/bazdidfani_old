import { FC, useState } from "react";
import AdminPageStates from "./types/admin-page-states.type";
import AdminFormState from "./types/admin-form-states.type";
import AdminInspectionForm from "./layouts/AdminInspectionForm";
import AdminInspectionsList from "./layouts/AdminInspectionsList";

const AdminInspections: FC = () => {
	const [pageState, setPageState] = useState<AdminPageStates>("LIST");
	const [formState, setFormState] = useState<AdminFormState | null>(null);
	const [formData, setFormData] = useState(null);

	const changePageState = (state: AdminPageStates) => {
		setPageState(state);
	};

	const changeFormState = (state: AdminFormState | null) => {
		setFormState(state);
	};

	const handleAddInspection = () => {
		changePageState("FORM");
		changeFormState("ADD");
	};

	const handleCancelAddInspection = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleEditInspection = (data) => {
		setFormData(data);
		changePageState("FORM");
		changeFormState("EDIT");
	};

	const handleCancelEditInspection = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleSubmitInspection = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	return pageState === "LIST" ? (
		<AdminInspectionsList onEditInspection={handleEditInspection} />
	) : (
		<AdminInspectionForm
			formState={formState}
			formData={formData}
			onSubmitInspection={handleSubmitInspection}
			onCancelAddInspection={handleCancelAddInspection}
			onCancelEditInspection={handleCancelEditInspection}
		/>
	);
};

export default AdminInspections;
