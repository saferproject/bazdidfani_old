import AdminFormState from "../types/admin-form-states.type";
import AdminCompanyForm from "./admin-company-form.interface";

export default interface AdminCompanyFormProps {
	formState: AdminFormState;
	onSubmitCompany: () => void;
	onCancelAddCompany: () => void;
	onCancelEditCompany: () => void;
	formData?: AdminCompanyForm & { cities: unknown; states: unknown };
}
