import { useState } from "react";
import AdminCompanyList from "./layouts/AdminCompanyList";
import AdminPageStates from "./types/admin-page-states.type";
import AdminFormState from "./types/admin-form-states.type";
import AdminCompanyForm from "./layouts/AdminCompanyForm";

const AdminCompanies = () => {
	const [pageState, setPageState] = useState<AdminPageStates>("LIST");
	const [formState, setFormState] = useState<AdminFormState | null>(null);
	const [formData, setFormData] = useState(null);

	const changePageState = (state: AdminPageStates) => {
		setPageState(state);
	};

	const changeFormState = (state: AdminFormState | null) => {
		setFormState(state);
	};

	const handleAddCompany = () => {
		changePageState("FORM");
		changeFormState("ADD");
		setFormData(null);
	};

	const handleCancelAddCompany = () => {
		changePageState("LIST");
		changeFormState(null);
		setFormData(null);
	};

	const handleEditCompany = (data) => {
		setFormData(data);
		changePageState("FORM");
		changeFormState("EDIT");
	};

	const handleCancelEditCompany = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleSubmitCompany = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	return pageState === "LIST" ? (
		<AdminCompanyList
			onAddCompany={handleAddCompany}
			onEditCompany={handleEditCompany}
		/>
	) : (
		<AdminCompanyForm
			formState={formState}
			formData={formData}
			onSubmitCompany={handleSubmitCompany}
			onCancelAddCompany={handleCancelAddCompany}
			onCancelEditCompany={handleCancelEditCompany}
		/>
	);
};

export default AdminCompanies;