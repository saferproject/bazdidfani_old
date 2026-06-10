import AdminFormState from "../types/admin-form-states.type";
import Driver from "./driver.interface";

export default interface AdminDriverFormProps {
	formState: AdminFormState;
	onSubmitDriver: () => void;
	onCancelAddDriver: () => void;
	onCancelEditDriver: () => void;
	formData?: Driver;
}
