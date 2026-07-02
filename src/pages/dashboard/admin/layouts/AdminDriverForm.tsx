import { Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select } from "@mui/material";
import TextField from "../../../../components/shared/Inputs/SaferTextField";
import { FC, useEffect } from "react";
import AdminDriverFormProps from "../interfaces/admin-driver-form-props.interface";
import AdminDriverFormSchema, { AdminDriverFormType } from "../schemas/admin-driver-form.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowSwapHorizontal } from "iconsax-reactjs";
import DatePickerComponent from "../../../../components/shared/DatePicker/DatePickerComponent";
import { useAdminAddDriverMutation, useAdminEditDriverMutation } from "../api/admin-driver.api";
import Driver from "../interfaces/driver.interface";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { useGetNationalCodeInquiryMutation } from "../../../../api/Inquiry";

const AdminDriverForm: FC<AdminDriverFormProps> = ({ formState, formData, onSubmitDriver, onCancelAddDriver, onCancelEditDriver }) => {
	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		getValues,
		trigger,
		control,
		formState: { errors },
	} = useForm<AdminDriverFormType>({
		// @ts-ignore
		defaultValues: { certificate_type: 1, ...formData },
		resolver: zodResolver(AdminDriverFormSchema),
		mode: "onBlur",
	});

	const [nationalCodeInquiryFn, nationalCodeInquiryResult] = useGetNationalCodeInquiryMutation();
	const [addDriverFn, addDriverResult] = useAdminAddDriverMutation();
	const [editDriverFn, editDriverResult] = useAdminEditDriverMutation();

	const onSubmit = (data: AdminDriverFormType) => {
		if (formState === "ADD") addDriverFn({ ...nationalCodeInquiryResult.data.data.driver_info, ...data, status: 1 });
		else editDriverFn({ ...data, status: 1, id: formData.id });
	};

	// TODO: set formData prop to form
	const setFormData = (data: Driver) => {
		// @ts-ignore
		reset({
			full_name: data.driver[0].full_name,
			certificate_type: data.driver[0].certificate_type,
			phone_number: data.driver[0].phone_number,
			...data,
		});
	};

	const getDriverData = async () => {
		if (await trigger("national_code")) nationalCodeInquiryFn(getValues("national_code"));
	};

	useEffect(() => {
		if (errors.full_name?.type === "pattern") setTimeout(() => clearErrors("full_name"), 3000);
	}, [errors.full_name]);

	useEffect(() => {
		if (errors.father_name?.type === "pattern") setTimeout(() => clearErrors("father_name"), 3000);
	}, [errors.father_name]);

	useEffect(() => {
		if (errors.national_code?.type === "pattern") setTimeout(() => clearErrors("national_code"), 3000);
	}, [errors.national_code]);

	useEffect(() => {
		if (errors.certificate_type?.type === "pattern") setTimeout(() => clearErrors("certificate_type"), 3000);
	}, [errors.certificate_type]);

	useEffect(() => {
		if (errors.certificate_number?.type === "pattern") setTimeout(() => clearErrors("certificate_number"), 3000);
	}, [errors.certificate_number]);

	useEffect(() => {
		if (errors.insurance_number?.type === "pattern") setTimeout(() => clearErrors("insurance_number"), 3000);
	}, [errors.insurance_number]);

	useEffect(() => {
		if (formState === "EDIT" && formData) setFormData(formData);
	}, [formState, formData]);

	useEffect(() => {
		if (addDriverResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: addDriverResult.data.message,
			});

			onSubmitDriver();
		}
	}, [addDriverResult.isSuccess, addDriverResult.data]);

	useEffect(() => {
		if (editDriverResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: editDriverResult.data.message,
			});

			onSubmitDriver();
		}
	}, [editDriverResult.isSuccess, editDriverResult.data]);

	useEffect(() => {
		if (nationalCodeInquiryResult.isSuccess)
			reset({
				...nationalCodeInquiryResult.data.data.driver_info,
			});
	}, [nationalCodeInquiryResult.isSuccess, nationalCodeInquiryResult.data]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="grid grid-cols-6 gap-4"
		>
			<TextField
				{...register("national_code")}
				label="کد ملی"
				type="tel"
				error={!!errors.national_code}
				helperText={errors.national_code?.message ?? ""}
				placeholder="کد ملی را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("national_code", { message: "کد ملی نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 10);

					event.target.value = newValue;
				}}
				slotProps={{
					input: {
						endAdornment: (
							<IconButton
								loading={nationalCodeInquiryResult.isLoading}
								onClick={getDriverData}
								className="text-primary"
								title="استعلام"
							>
								<ArrowSwapHorizontal size="24" />
							</IconButton>
						),
					},
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
				required
				fullWidth
			/>
			<TextField
				{...register("phone_number")}
				label="شماره همراه"
				type="tel"
				error={!!errors.phone_number}
				helperText={errors.phone_number?.message ?? ""}
				placeholder="شماره همراه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("phone_number", { message: "شماره همراه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 11);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
				required
				fullWidth
			/>
			<TextField
				{...register("full_name")}
				label="نام و نام خانوادگی"
				type="text"
				autoComplete="off"
				placeholder="نام کامل را وارد کنید"
				error={!!errors.full_name}
				helperText={errors.full_name?.message}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g))
						setError("full_name", {
							message: "نام و نام خانوادگی نمیتواند شامل حروفی غیر از فارسی یا عدد یا نماد باشد",
							type: "pattern",
						});

					newValue = newValue.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, "");
					newValue = newValue.slice(0, 64);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
			/>
			<TextField
				{...register("father_name")}
				label="نام پدر"
				type="text"
				autoComplete="off"
				placeholder="نام پدر را وارد کنید"
				error={!!errors.father_name}
				helperText={errors.father_name?.message}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g))
						setError("father_name", {
							message: "نام نمیتواند شامل حروفی غیر از فارسی یا عدد یا نماد باشد",
							type: "pattern",
						});

					newValue = newValue.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, "");
					newValue = newValue.slice(0, 32);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
			/>
			<DatePickerComponent
				label="تاریخ تولد"
				name="birthdate"
				rules={{ required: "تاریخ تولد الزامی است" }}
				error={!!errors.birthdate}
				helperText={errors.birthdate?.message ?? ""}
				control={control}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "8px",
					},
				}}
			/>
			<Controller
				name="certificate_type"
				control={control}
				render={({ field }) => (
					<FormControl fullWidth>
						<InputLabel
							shrink={true}
							required
						>
							نوع گواهی نامه
						</InputLabel>
						<Select
							{...field}
							label="نوع گواهی نامه"
							error={!!errors.certificate_type}
							onChange={(event) => field.onChange(event.target.value)}
							sx={{ borderRadius: "8px" }}
							required
						>
							<MenuItem value={1}>پایه یک</MenuItem>
							<MenuItem value={2}>پایه دو</MenuItem>
							<MenuItem value={3}>پایه دو تبصره 99</MenuItem>
						</Select>
						{errors.certificate_type && <FormHelperText>{errors.certificate_type?.message}</FormHelperText>}
					</FormControl>
				)}
			/>
			<TextField
				{...register("certificate_number")}
				label="شماره گواهی نامه"
				type="tel"
				error={!!errors.certificate_number}
				helperText={errors.certificate_number?.message ?? ""}
				placeholder="شماره گواهی نامه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("certificate_number", { message: "شماره گواهی نامه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 10);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			<DatePickerComponent
				label="اعتبار گواهی نامه"
				name="certificate_validity"
				rules={{ required: "اعتبار گواهی نامه الزامی است" }}
				error={!!errors.certificate_validity}
				helperText={errors.certificate_validity?.message ?? ""}
				control={control}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "8px",
					},
				}}
			/>
			<TextField
				{...register("insurance_number")}
				label="شماره بیمه"
				type="tel"
				error={!!errors.insurance_number}
				helperText={errors.insurance_number?.message ?? ""}
				placeholder="شماره بیمه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("insurance_number", { message: "شماره بیمه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 8);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			<DatePickerComponent
				label="اعتبار کارت سلامت"
				name="health_card_validity"
				rules={{ required: "اعتبار کارت سلامت الزامی است" }}
				error={!!errors.health_card_validity}
				helperText={errors.health_card_validity?.message ?? ""}
				control={control}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "8px",
					},
				}}
			/>

			<Button
				className="row-start-3"
				variant="outlined"
				color="secondary"
				onClick={formState === "ADD" ? onCancelAddDriver : onCancelEditDriver}
			>
				انصراف
			</Button>
			<Button
				type="submit"
				className="row-start-3"
				variant="contained"
				loading={addDriverResult.isLoading || editDriverResult.isLoading}
			>
				{formState === "ADD" ? "ثبت" : "ویرایش"} راننده
			</Button>
		</form>
	);
};

export default AdminDriverForm;
