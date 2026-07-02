import { Button,
  IconButton } from "@mui/material";
import TextField from "../shared/Inputs/SaferTextField";
import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import SelectCustom from "../shared/Inputs/CustomeSelect";
import { useAddDriverMutation, useEditDriverMutation } from "../../api/Driver/Driver";
import { useNavigate } from "react-router-dom";
import { useGetNationalCodeInquiryMutation } from "../../api/Inquiry";
import DatePickerComponent from "../shared/DatePicker/DatePickerComponent";
import { ArrowSwapHorizontal, UserSquare } from "iconsax-reactjs";
import { TbArrowsExchange } from "react-icons/tb";

interface driverForm {
	national_code: string;
	full_name: string;
	father_name: string;
	insurance_number: string;
	smart_card_validity: string;
	phone_number: string;
	birthdate: string;
	status: number;
	health_card_validity: string;
	certificate_number: string;
	certificate_type: number;
	description: string;
	certificate_validity: string;
	id: number;
	is_active: boolean;
}

export default function NewDriver({
	onSuccess,
	initialData,
	onCancel,
	formMode: formState = "ADD",
	nationalCode,
}: {
	onSuccess?: (data?: Record<string, any>) => void;
	onCancel?: () => void;
	initialData?: any;
	formMode?: "ADD" | "ADD_WITHOUT_INQUIRY" | "EDIT";
	nationalCode?: string;
}) {
	const {
		control,
		register,
		watch,
		reset,
		setError,
		clearErrors,
		trigger,
		formState: { errors },
		setValue,
	} = useForm<driverForm>();
	const [formMode, setFormMode] = useState(formState);

	const navigate = useNavigate();

	const [addDriverFn, addDriverResult] = useAddDriverMutation();
	const [editDriverFn, editDriverResult] = useEditDriverMutation();

	const { national_code } = useWatch({ control });

	useEffect(() => {
		if (formMode === "EDIT") {
			setValue("national_code", nationalCode);
			handlenationalCodeInquiryMutation();
		}
	}, [formMode]);

	useEffect(() => {
		if (national_code === "") {
			reset((prevData) => {
				const newData = {};

				for (const key in prevData)
					newData[key] =
						typeof prevData[key] === "string" ? "" : prevData[key] === "number" ? 0 : prevData[key] === "boolean" ? false : prevData[key];

				return newData;
			});
		}
	}, [national_code]);

	useEffect(() => {
		if (addDriverResult.isSuccess) {
			SweetAlertToast.fire({
				title: addDriverResult.data.message,
				icon: "success",
			});

			setValue("id", addDriverResult.data.data.id);

			if (onSuccess) {
				onSuccess(watch());
				reset();
			} else navigate("/dashboard/drivers");
		}
	}, [addDriverResult, onSuccess, navigate]);

	useEffect(() => {
		if (editDriverResult.isSuccess) {
			SweetAlertToast.fire({
				title: editDriverResult.data.message,
				icon: "success",
			});

			setValue("id", editDriverResult.data.data.id);

			if (onSuccess) {
				onSuccess({ ...editDriverResult.data.data.driver[0], ...editDriverResult.data.data });
				reset();
			} else navigate("/dashboard/drivers");
		}
	}, [editDriverResult.isSuccess, editDriverResult.data]);

	const [nationalCodeInquiryFn, nationalCodeInquiryResult] = useGetNationalCodeInquiryMutation();

	useEffect(() => {
		if (nationalCodeInquiryResult.isSuccess) {
			const driver_info = nationalCodeInquiryResult.data.data?.driver_info;

			const today = new Date();
			const startDate = new Date(driver_info?.start_activity * 1000);
			const yearDiff = today.getFullYear() - startDate.getFullYear();

			reset({
				...driver_info,
				start_activity: yearDiff,
			});
		} else if (nationalCodeInquiryResult.isError) {
			const { error } = nationalCodeInquiryResult;

			if (error.data.data.driver_inquiry === false) {
				setFormMode("ADD_WITHOUT_INQUIRY");
			} else if (error?.response?.data?.data?.national_code)
				setError("national_code", {
					type: "serverError",
					message: error?.response?.data?.data?.national_code || "",
				});
			else clearErrors("national_code");
		}
	}, [nationalCodeInquiryResult.isSuccess, nationalCodeInquiryResult.isError]);

	useEffect(() => {
		initialData &&
			reset({
				national_code: initialData.driver_national_code ?? initialData.national_code,
				certificate_type: initialData.driver_certificate_type ?? initialData.certificate_type,
				birthdate: initialData.birthdate ?? initialData.driver?.birthdate,
				certificate_number: initialData.certificate_number ?? initialData.driver?.certificate_number,
				description: initialData.driver_description ?? initialData.driver?.description,
				father_name: initialData.father_name ?? initialData.driver?.father_name,
				full_name: initialData.full_name || initialData.driver_full_name,
				health_card_validity: initialData.driver_health_card_validity ?? initialData.health_card_validity,
				insurance_number: initialData.driver_insurance_number ?? initialData.insurance_number,
				phone_number: initialData.driver_phone_number || initialData.phone_number,
				smart_card_validity: initialData.driver_smart_card_validity ?? initialData.smart_card_validity,
				status: initialData.driver_status ?? initialData.status,
				certificate_validity: initialData.driver_certificate_validity ?? initialData.certificate_validity,
				id: initialData.driver_company_id,
			});
	}, [initialData]);

	const handlenationalCodeInquiryMutation = useCallback(async () => {
		const validation = await trigger("national_code");
		if (validation) nationalCodeInquiryFn(watch("national_code"));
		else {
			SweetAlertToast.fire({
				html: Object.values(errors)
					.map((error) => error?.message)
					.join("<br>"),
				icon: "error",
			});
		}
	}, [errors, nationalCodeInquiryFn, trigger, watch]);

	const handleSubmit = useCallback(async () => {
		const validation = await trigger();

		if (validation) {
			if (formMode === "ADD" || formMode === "ADD_WITHOUT_INQUIRY")
				addDriverFn({
					is_active: true,
					...initialData,
					...watch(),
				});
			else editDriverFn({ ...watch() });
		} else
			SweetAlertToast.fire({
				html: Object.values(errors)
					.map((error) => error?.message)
					.join("<br>"),
				icon: "warning",
			});
	}, [addDriverFn, editDriverFn, errors]);

	return (
		<div className="flex flex-col items-start w-full gap-12">
			<div className="flex gap-4 items-center">
				<UserSquare
					size="32"
					className="text-primary"
				/>
				<h2 className="text-xl font-bold font-Yekan-Bakh">
					{formMode === "ADD" || formMode === "ADD_WITHOUT_INQUIRY" ? "افزودن" : "ویرایش"} راننده
				</h2>
			</div>
			<div className="w-full flex items-center justify-center gap-2 lg:grid lg:grid-cols-6">
				<TextField
					slotProps={{
						htmlInput: { maxLength: "10", dir: "ltr", autoComplete: "off" },
						input: {
							endAdornment: (
								<IconButton
									loading={nationalCodeInquiryResult.isLoading}
									onClick={handlenationalCodeInquiryMutation}
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
					error={!!errors.national_code}
					helperText={errors.national_code?.message.toString() ?? ""}
					{...register("national_code", {
						validate: (data: string) => {
							if (data?.length < 10) return data?.length === 10 || "طول کد ملی 10 رقمی رقمی است";
						},
					})}
					onChange={(event) => {
						let value = event.target.value;
						value = value.replace(/\D/g, "");
						value = value.slice(0, 10);
						event.target.value = value;
					}}
					label="کد ملی"
					type="text"
					fullWidth
					onKeyDown={(e) => {
						if (e.key === "Enter") handlenationalCodeInquiryMutation();
					}}
				/>
			</div>

			<div className="flex flex-col gap-4 w-full">
				<div className="flex gap-2 items-center">
					<ArrowSwapHorizontal className="text-primary" />
					<h2 className="text-lg font-semibold">نتیجه استعلام</h2>
				</div>
				<div className="flex flex-col gap-4 w-full lg:grid lg:grid-cols-6">
					<TextField
						slotProps={{
							htmlInput: { autoComplete: "off" },
							inputLabel: {
								shrink: true,
							},
						}}
						error={!!errors.full_name}
						helperText={errors?.full_name?.message.toString() ?? ""}
						{...register("full_name", {
							required: "نام و نام خانوادگی الزامی است .",
						})}
						fullWidth
						label="نام و نام خانوادگی"
						disabled={formMode === "ADD"}
					/>

					<TextField
						slotProps={{
							htmlInput: { autoComplete: "off" },
							inputLabel: {
								shrink: true,
							},
						}}
						error={!!errors.father_name}
						helperText={errors.father_name?.message.toString() ?? ""}
						{...register("father_name", {
							required: "نام پدر الزامی است",
						})}
						fullWidth
						label="نام پدر"
						disabled={formMode === "ADD"}
					/>
					<TextField
						slotProps={{
							htmlInput: { maxLength: 11, dir: "ltr", autoComplete: "off" },
							inputLabel: {
								shrink: true,
							},
						}}
						error={!!errors.insurance_number}
						helperText={errors.insurance_number?.message.toString() ?? ""}
						{...register("insurance_number", {
							required: "شماره بیمه الزامی است",
						})}
						fullWidth
						label="شماره بیمه"
						disabled={formMode === "ADD"}
					/>
					<div>
						<DatePickerComponent
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "8px",
								},
							}}
							name="smart_card_validity"
							rules={{ required: "اعتبار هوشمند الزامی است" }}
							error={errors.smart_card_validity ? true : false}
							helperText={errors.smart_card_validity?.message?.toString()}
							label="اعتبار هوشمند"
							control={control}
						/>
					</div>
					<TextField
						slotProps={{
							htmlInput: { maxLength: "11", dir: "ltr", autoComplete: "off" },
							inputLabel: {
								shrink: true,
							},
						}}
						error={!!errors.phone_number}
						helperText={errors.phone_number?.message.toString() ?? ""}
						{...register("phone_number", {
							minLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
							maxLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
						})}
						onChange={(event) => {
							let value = event.target.value;
							value = value.replace(/\D/g, "");
							value = value.slice(0, 11);
							event.target.value = value;
						}}
						fullWidth
						label="شماره همراه"
					/>
					<div>
						<DatePickerComponent
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "8px",
								},
							}}
							name="birthdate"
							rules={{ required: "تاریخ تولد الزامی است" }}
							error={!!errors.birthdate}
							helperText={errors.birthdate?.message.toString() ?? ""}
							label="تاریخ تولد"
							control={control}
						/>
					</div>
					<div>
						<SelectCustom
							control={control}
							label="وضعیت"
							name="status"
							rules={{ required: "وضعیت الزامی است" }}
							error={!!errors.status}
							helperText={errors.status?.message.toString() ?? ""}
							fullWidth={true}
							items={[
								{ title: "غیر فعال", value: "0" },
								{ title: "فعال", value: "1" },
							]}
						/>
					</div>
					<div>
						<DatePickerComponent
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "8px",
								},
							}}
							name="health_card_validity"
							rules={{ required: "اعتبار سلامت الزامی است" }}
							error={!!errors.health_card_validity}
							helperText={errors.health_card_validity?.message.toString() ?? ""}
							label="اعتبار سلامت"
							control={control}
						/>
					</div>
					<div>
						<DatePickerComponent
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "8px",
								},
							}}
							name="certificate_validity"
							rules={{ required: "اعتبار گواهینامه الزامی است" }}
							error={!!errors.certificate_validity}
							helperText={errors.certificate_validity?.message.toString() ?? ""}
							label="اعتبار گواهینامه"
							control={control}
						/>
					</div>
					<TextField
						slotProps={{
							htmlInput: { maxLength: 10, dir: "ltr", autoComplete: "off" },
							inputLabel: {
								shrink: true,
							},
						}}
						error={!!errors.certificate_number}
						helperText={errors.certificate_number?.message.toString() ?? ""}
						{...register("certificate_number")}
						fullWidth
						label="شماره گواهی نامه"
					/>
					<div>
						<SelectCustom
							control={control}
							label="نوع گواهی نامه"
							name="certificate_type"
							rules={{ required: "نوع گواهی نامه الزامی است" }}
							error={!!errors.certificate_type}
							helperText={errors.certificate_type?.message.toString() ?? ""}
							fullWidth={true}
							items={[
								{ title: "پایه یک", value: 1 },
								{ title: "پایه دو", value: 2 },
								{ title: "پایه دو تبصره 99", value: 3 },
							]}
						/>
					</div>
					<div className="w-full lg:col-span-full">
						<TextField
							slotProps={{
								htmlInput: { autoComplete: "off" },
								inputLabel: {
									shrink: true,
								},
							}}
							error={!!errors.description}
							helperText={errors.description?.message.toString() ?? ""}
							{...register("description")}
							fullWidth
							label="توضیحات"
							multiline
							rows={4}
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2 w-full lg:flex-row lg:justify-end">
				<Button
					variant="outlined"
					color="secondary"
					onClick={() => {
						onCancel ? onCancel() : navigate(-1);
					}}
					className="order-last lg:order-first lg:w-32"
				>
					<div className="w-full flex justify-between items-center text-lg lg:text-base">
						انصراف
						<IoClose size={24} />
					</div>
				</Button>
				<Button
					loading={addDriverResult.isLoading}
					variant="contained"
					onClick={handleSubmit}
					className="w-full flex justify-between order-first lg:order-last lg:w-32"
					endIcon={<FaLongArrowAltLeft size={24} />}
				>
					ثبت
				</Button>
			</div>
		</div>
	);
}
