import { FC, useState } from "react";
import AdminPageStates from "./types/admin-page-states.type";
import AdminFormState from "./types/admin-form-states.type";
import AdminCompanyUsersList from "./layouts/AdminCompanyUsersList";

const AdminCompanyUsers: FC = () => {
	const [pageState, setPageState] = useState<AdminPageStates>("LIST");
	const [formState, setFormState] = useState<AdminFormState | null>(null);
	const [formData, setFormData] = useState(null);

	const changePageState = (state: AdminPageStates) => {
		setPageState(state);
	};

	const changeFormState = (state: AdminFormState | null) => {
		setFormState(state);
	};

	const handleAddUser = () => {
		changePageState("FORM");
		changeFormState("ADD");
	};

	const handleCancelAddUser = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleEditUser = (data) => {
		setFormData(data);
		changePageState("FORM");
		changeFormState("EDIT");
	};

	const handleCancelEditUser = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	const handleSubmitUser = () => {
		changePageState("LIST");
		changeFormState(null);
	};

	return (
		pageState === "LIST" && (
			<AdminCompanyUsersList
				onAddUser={handleAddUser}
				onEditUser={handleEditUser}
			/>
		)
	);
};

export default AdminCompanyUsers;
