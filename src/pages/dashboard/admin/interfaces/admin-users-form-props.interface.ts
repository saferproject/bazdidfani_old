import AdminFormState from "../types/admin-form-states.type";

export default interface AdminUsersFormProps {
	formState: AdminFormState;
	onSubmitUser: () => void;
	onCancelAddUser: () => void;
	onCancelEditUser: () => void;
	formData?: unknown;
}