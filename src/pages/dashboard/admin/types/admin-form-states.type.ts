import FormStates from "../../../../shared/types/form-states.type";

type AdminFormState = Extract<FormStates, "ADD" | "EDIT">;

export default AdminFormState;
