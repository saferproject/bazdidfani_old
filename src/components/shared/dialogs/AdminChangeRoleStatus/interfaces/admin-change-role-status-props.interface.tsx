import User from "../../../../../pages/dashboard/admin/interfaces/user.interface";

export default interface AdminChangeRoleStatusProps {
	isOpen: boolean;
	user: User;
	onClose: () => void;
}