export default interface LoginAsDialogProps {
	isOpen: boolean;
	/** شناسه کاربری که قرار است به‌جای او وارد شویم */
	userId: number | null;
	/** نام نمایشی برای متن تایید */
	fullName?: string;
	onClose: () => void;
}
