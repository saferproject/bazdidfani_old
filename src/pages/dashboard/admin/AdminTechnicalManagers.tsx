import { FC, useState } from "react";
import AdminPageStates from "./types/admin-page-states.type";
import AdminFormState from "./types/admin-form-states.type";
import AdminTechnicalManagersList from "./layouts/AdminTechnicalManagersList";
import AdminTechnicalManagerForm from "./layouts/AdminTechnicalManagerForm";

const AdminTechnicalManagers: FC = () => {
	const [pageState, setPageState] = useState<AdminPageStates>("LIST");
	const [formState, setFormState] = useState<AdminFormState | null>(null);
	const [formData, setFormData] = useState(null);

	const changePageState = (state: AdminPageStates) => {
		setPageState(state);
	};

	const changeFormState = (state: AdminFormState | null) => {
		setFormState(state);
	};

	const handleAddTechnicalManager = () => {
		changePageState("FORM");
		changeFormState("ADD");
	};

	const handleCancelAddTechnicalManager = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleEditTechnicalManager = (data) => {
		setFormData(data);
		changePageState("FORM");
		changeFormState("EDIT");
	};

	const handleCancelEditTechnicalManager = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleSubmitTechnicalManager = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	return pageState === "LIST" ? (
		<AdminTechnicalManagersList
			onAddTechnicalManager={handleAddTechnicalManager}
			onEditTechnicalManager={handleEditTechnicalManager}
		/>
	) : (
		<AdminTechnicalManagerForm
			formState={formState}
			formData={formData}
			onSubmitTechnicalManager={handleSubmitTechnicalManager}
			onCancelAddTechnicalManager={handleCancelAddTechnicalManager}
			onCancelEditTechnicalManager={handleCancelEditTechnicalManager}
		/>
	);
};

export default AdminTechnicalManagers;
