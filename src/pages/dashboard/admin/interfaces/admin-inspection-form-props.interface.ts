import AdminFormState from "../types/admin-form-states.type";

export default interface AdminInspectionFormProps {
	formState: AdminFormState;
	formData: () => void;
	onSubmitInspection: () => void;
	onCancelAddInspection: () => void;
	onCancelEditInspection: unknown;
}
