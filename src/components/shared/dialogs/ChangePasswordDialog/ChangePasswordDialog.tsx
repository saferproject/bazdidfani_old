import { FC, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CloseCircle, Key } from "iconsax-reactjs";
import { useLogoutMutation } from "../../../../api/Auth/Logout";
import { useChangePasswordMutation } from "../../../../api/Profile/Profile";
import { useAppDispatch, useAppSelector } from "../../../../Stores/hooks";
import SweetAlertToast from "../../Functions/SweetAlertToast";
import ChangePasswordForm from "./interfaces/change-password-form.interface";
import ChangePasswordErrors from "./types/change-password-errors.type";
import { clear } from "../../../../Stores/slices/user";
import { closeChangePasswordDialog } from "../../../../Stores/slices/change-passwrod-dialog.slice";

const ChangePasswordDialog: FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const isOpen = useAppSelector((state) => state.changePasswordDialog.isOpen);

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, isValid },
	} = useForm<ChangePasswordForm>();

	const [changePasswordFn, { isError: CPError, isLoading: CPLoading, isSuccess: CPSuccess, data: CPData, error: CPErrors }] =
		useChangePasswordMutation();
	const [logOutFn, logOutResult] = useLogoutMutation();

	const handleCloseDialog = () => {
		dispatch(closeChangePasswordDialog());
	};

	const submitForm = async (data: ChangePasswordForm) => {
		if (!isValid) {
			SweetAlertToast.fire({ icon: "warning", title: "لطفا فرم را به درستی پر کنید." });
			return;
		}

		changePasswordFn({
			current_password: data.currentPassword,
			password: data.newPassword,
			password_confirmation: data.newPasswordConfirm,
		});
	};

	useEffect(() => {
		if (CPSuccess) {
			SweetAlertToast.fire({ icon: "success", title: CPData.message || "رمز عبور با موفقیت تغییر کرد." });
			logOutFn();
		} else if (CPError)
			SweetAlertToast.fire({
				icon: "error",
				title: (CPErrors as ChangePasswordErrors).data.message || "خطا در تغییر رمز عبور. لطفا دوباره تلاش کنید.",
			});
	}, [CPError, CPSuccess, CPData]);

	useEffect(() => {
		if (logOutResult.isSuccess) {
			dispatch(clear());
			SweetAlertToast.fire({
				title: "خروج با موفقیت انجام شد",
				icon: "success",
			});
			navigate("/");
		} else if (logOutResult.isError) {
			dispatch(clear());
			navigate("/");
		}
	}, [logOutResult, dispatch, navigate]);

	return (
		<Dialog
			open={isOpen}
			onClose={handleCloseDialog}
		>
			<div className="p-2 lg:p-4">
				<div className="w-full flex items-center justify-between">
					<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh flex items-center gap-2">
						<Key
							size="24"
							color="#30eca5"
							variant="Bold"
						/>
						<h1 className="font-Yekan-Bakh text-lg font-semibold">تغییر رمز عبور</h1>
					</DialogTitle>
					<IconButton onClick={handleCloseDialog}>
						<CloseCircle
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				</div>
				<DialogContent>
					<form
						onSubmit={handleSubmit(submitForm)}
						autoComplete="off"
					>
						<section className="w-full lg:w-96">
							<main>
								<TextField
									{...register("currentPassword", {
										required: "رمز عبور فعلی الزامی است",
									})}
									autoComplete="off"
									name="currentPassword"
									label="رمز عبور فعلی"
									type="password"
									margin="normal"
									error={!!errors.currentPassword}
									helperText={errors.currentPassword ? errors.currentPassword.message : ""}
									fullWidth
								></TextField>
								<TextField
									{...register("newPassword", {
										required: "رمز عبور فعلی الزامی است",
										minLength: { value: 4, message: "رمز عبور باید حداقل 4 کاراکتر باشد" },
									})}
									autoComplete="off"
									name="newPassword"
									label="رمز عبور جدید"
									type="password"
									margin="normal"
									error={!!errors.newPassword}
									helperText={errors.newPassword ? errors.newPassword.message : ""}
									fullWidth
								></TextField>
								<TextField
									{...register("newPasswordConfirm", {
										required: "تکرار رمز عبور جدید الزامی است",
										validate: (value) => {
											if (value !== getValues("newPassword")) return "رمز عبور جدید و تکرار آن باید یکسان باشند";
										},
									})}
									autoComplete="off"
									name="newPasswordConfirm"
									label="تکرار رمز عبور جدید"
									type="password"
									margin="normal"
									error={!!errors.newPasswordConfirm}
									helperText={errors.newPasswordConfirm ? errors.newPasswordConfirm.message : ""}
									fullWidth
								></TextField>
							</main>
							<footer className="mt-4">
								<Button
									type="submit"
									color="primary"
									variant="contained"
									loading={CPLoading}
									disabled={CPLoading}
									fullWidth
								>
									تغییر رمز عبور
								</Button>
							</footer>
						</section>
					</form>
				</DialogContent>
			</div>
		</Dialog>
	);
};

export default ChangePasswordDialog;
