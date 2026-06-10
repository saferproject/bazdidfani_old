import { FC, useState } from "react";
import AdminPageStates from "./types/admin-page-states.type";
import AdminFormState from "./types/admin-form-states.type";
import AdminDriverList from "./layouts/AdminDriverList";
import AdminDriverForm from "./layouts/AdminDriverForm";

const AdminDrivers: FC = () => {
	const [pageState, setPageState] = useState<AdminPageStates>("LIST");
	const [formState, setFormState] = useState<AdminFormState | null>(null);
	const [formData, setFormData] = useState(null);

	const changePageState = (state: AdminPageStates) => {
		setPageState(state);
	};

	const changeFormState = (state: AdminFormState | null) => {
		setFormState(state);
	};

	const handleAddDriver = () => {
		changePageState("FORM");
		changeFormState("ADD");
	};

	const handleCancelAddDriver = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleEditDriver = (data) => {
		setFormData(data);
		changePageState("FORM");
		changeFormState("EDIT");
	};

	const handleCancelEditDriver = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleSubmitDriver = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	return pageState === "LIST" ? (
		<AdminDriverList
			onAddDriver={handleAddDriver}
			onEditDriver={handleEditDriver}
		/>
	) : (
		<AdminDriverForm
			formState={formState}
			formData={formData}
			onSubmitDriver={handleSubmitDriver}
			onCancelAddDriver={handleCancelAddDriver}
			onCancelEditDriver={handleCancelEditDriver}
		/>
	);
};

export default AdminDrivers;
