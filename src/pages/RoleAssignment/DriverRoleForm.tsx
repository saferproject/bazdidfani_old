import { Button } from "@mui/material";
import TextField from "../../components/shared/Inputs/SaferTextField";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

import DriverFormInterface from "./interfaces/driver-role-form.interface";
import { useRegisterDriverMutation } from "../../api/Profile/Register/Driver";
import SweetAlertToast from "../../components/shared/Functions/SweetAlertToast";
import { useAppSelector } from "../../Stores/hooks";

const DriverForm: FC = () => {
	const nationalCode = useAppSelector((state) => state.user.personal.national_code);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<DriverFormInterface>({ defaultValues: { national_code: nationalCode ?? "" } });

	const [RegisterDriverFn, RegisterDriverResult] = useRegisterDriverMutation();

	const onSubmit = (data: DriverFormInterface) => {
		RegisterDriverFn(data);
	};

	useEffect(() => {
		if (RegisterDriverResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: RegisterDriverResult.data.message,
			});
			window.location.href = "/dashboard";
		}
	}, [RegisterDriverResult.isSuccess]);

	useEffect(() => {
		if (errors.national_code?.type === "pattern") setTimeout(() => clearErrors("national_code"), 3000);
	}, [errors.national_code]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:w-fit"
		>
			<TextField
				label="کد ملی"
				type="tel"
				dir="ltr"
				error={!!errors.national_code}
				helperText={errors.national_code?.message ?? ""}
				placeholder="کد ملی را وارد کنید"
				autoComplete="off"
				{...register("national_code", {
					required: "کد ملی الزامی است",
					minLength: { value: 10, message: "کد ملی باید 10 رقم باشد" },
					maxLength: { value: 10, message: "کد ملی باید 10 رقم باشد" },
					pattern: { value: /\d/g, message: "کد ملی باید فقط عدد باشد" },
					validate: (value) => {
						const digits = value.split("").map(Number);
						const sum = digits.slice(0, 9).reduce((acc, digit, i) => acc + digit * (10 - i), 0);
						const remainder = sum % 11;
						const lastDigit = digits[9];

						if ((remainder < 2 && lastDigit === remainder) || lastDigit === 11 - remainder) return true;

						return "کد ملی معتبر نیست";
					},
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("national_code", { message: "کد ملی نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 10);

					event.target.value = newValue;
				}}
				disabled={!!nationalCode}
				fullWidth
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
				}}
			/>
			<Button
				variant="contained"
				type="submit"
				size="large"
				loading={RegisterDriverResult.isLoading}
				fullWidth
			>
				استعلام راننده
			</Button>
		</form>
	);
};

export default DriverForm;
