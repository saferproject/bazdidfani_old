export default interface LoginAsDialogProps {
	isOpen: boolean;
	/** شناسه کاربری که قرار است به‌جای او وارد شویم */
	userId: number | null;
	/** نام نمایشی برای متن تایید */
	fullName?: string;
	onClose: () => void;
	/** نوع فعالیت کارشناس فنی: ۱=باری، ۲=مسافری، ۳=هر دو — در صورت ارائه، قبل از ریدایرکت در Redux ذخیره می‌شود */
	tmWorkType?: 1 | 2 | 3;
	customTrigger?: (data: any) => any;
	isLoginFromUser?: boolean;
}
