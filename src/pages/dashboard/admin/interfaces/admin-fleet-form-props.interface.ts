import AdminFormState from "../types/admin-form-states.type";
import Truck from "./fleet.interface";

export default interface AdminFleetFormProps {
	formState: AdminFormState;
	onSubmitFleet: () => void;
	onCancelAddFleet: () => void;
	onCancelEditFleet: () => void;
	formData?: Truck;
}