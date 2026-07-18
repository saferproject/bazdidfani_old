import { FC } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CloseCircle, LoginCurve } from "iconsax-reactjs";
import LoginAsDialogProps from "./interfaces/login-as-dialog-props.interface";
import { useLoginAsMutation, useLoginAsUserMutation } from "../../../../api/Auth/LoginAs";
import { useAppDispatch, useAppSelector } from "../../../../Stores/hooks";
import { loginAs, setCompanyUsage } from "../../../../Stores/slices/user";
import SweetAlertToast from "../../Functions/SweetAlertToast";

const LoginAsDialog: FC<LoginAsDialogProps> = ({ isOpen, userId, fullName, onClose, tmWorkType, customTrigger, isLoginFromUser = false }) => {
	const dispatch = useAppDispatch();
	const currentToken = useAppSelector((state) => state.user.token);

	const [loginAsFn, { isLoading }] = useLoginAsMutation();
	const [loginAsUserFn, { isLoading: userIsLoading }] = useLoginAsUserMutation();

	const handleConfirm = async () => {
		if (!userId || !currentToken) return;

		if (!!customTrigger) {
			await customTrigger({ userId });
			return;
		}

		try {
			const result = await (isLoginFromUser ? loginAsUserFn : loginAsFn)({ userId }).unwrap();
			const newToken = result?.data?.token;

			if (!newToken) {
				SweetAlertToast.fire({
					icon: "error",
					title: "توکن کاربر دریافت نشد.",
				});
				return;
			}

			// توکن مدیر فعلی در prev-token نگه داشته می‌شود و توکن کاربر هدف جایگزین token می‌گردد
			dispatch(loginAs({ prevToken: currentToken, token: newToken }));

			// اگر نوع فعالیت کارشناس فنی مشخص باشد، قبل از ریدایرکت ذخیره می‌شود
			// تا پس از بارگذاری مجدد در initialState از localStorage بازیابی شود
			if (tmWorkType != null) dispatch(setCompanyUsage(tmWorkType));

			// بارگذاری مجدد کامل تا verify_token اطلاعات کاربر هدف را hydrate کند
			window.location.href = "/dashboard";
		} catch {
			// خطاها در AxiosBaseQuery نمایش داده می‌شوند
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="xs"
			fullWidth={true}
		>
			<div className="p-2 lg:p-4">
				<div className="w-full flex items-center justify-between">
					<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">ورود به‌جای کاربر</DialogTitle>
					<IconButton onClick={onClose}>
						<CloseCircle
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				</div>
				<DialogContent className="flex flex-col items-center gap-4 text-center">
					<LoginCurve
						size="48"
						className="text-primary"
					/>
					<p className="leading-7">
						آیا می‌خواهید با حساب کاربری
						{fullName ? <span className="font-bold"> «{fullName}» </span> : " این کاربر "}
						وارد شوید؟ نشست فعلی شما حفظ شده و با خروج از حساب، دوباره به حساب مدیریت بازمی‌گردید.
					</p>
				</DialogContent>
				<div className="flex items-center gap-2 mt-2">
					<Button
						className="grow"
						variant="outlined"
						color="error"
						onClick={onClose}
						disabled={isLoading || userIsLoading}
					>
						لغو
					</Button>
					<Button
						className="grow"
						variant="contained"
						color="primary"
						loading={isLoading || userIsLoading}
						onClick={handleConfirm}
					>
						تایید و ورود
					</Button>
				</div>
			</div>
		</Dialog>
	);
};

export default LoginAsDialog;
