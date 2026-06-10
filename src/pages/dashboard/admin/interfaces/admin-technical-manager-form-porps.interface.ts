import TechnicalManagerRoleData from "../../../RoleAssignment/interfaces/technical-manager-role-data.interface";
import AdminFormState from "../types/admin-form-states.type";

export default interface AdminTechnicalManagerFormProps {
	formState: AdminFormState;
	onSubmitTechnicalManager: () => void;
	onCancelAddTechnicalManager: () => void;
	onCancelEditTechnicalManager: () => void;
	formData?: TechnicalManagerRoleData;
}
