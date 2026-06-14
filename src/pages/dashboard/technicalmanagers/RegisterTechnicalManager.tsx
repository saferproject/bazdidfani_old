import { FC, useEffect } from "react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import TechnicalManagerFormProps from "./interfaces/technical-manager-role-form-props.interface";
import TechnicalManagerFormSchema, { TechnicalManagerFormType } from "./schemas/technical-manager-form.schema";

import { useAppSelector } from "../../../Stores/hooks";
import { useNavigate } from "react-router-dom";
import { useRegisterNewTechManagerMutation } from "../../../api/TechnicalManager/TechnicalManager";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";

const RegisterTechnicalManager: FC<TechnicalManagerFormProps> = ({ formState }) => {
	const userPhoneNumber = useAppSelector((state) => state.user.newTechnicalManagerData.phone);
	const nationalCode = useAppSelector((state) => state.user.newTechnicalManagerData.national_code);

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		resetField,
		trigger,
		control,
		formState: { errors },
	} = useForm<TechnicalManagerFormType>({
		defaultValues: { type: 1, phone: userPhoneNumber, national_code: nationalCode ?? "" },
		resolver: zodResolver(TechnicalManagerFormSchema),
	});

	// useEffect(() => {
	// 	console.error(errors);
	// }, [errors]);

	const { capacity, freighter_capacity, passenger_capacity, type } = useWatch<TechnicalManagerFormType>({ control });

	const [registerTechnicalManagerFn, registerTechnicalManagerResult] = useRegisterNewTechManagerMutation();

	// TODO: later make images required based on selected type
	const onSubmit = async (data: TechnicalManagerFormType) => {
		const formData = new FormData();

		for (const key in data) if (data[key]) formData.append(key, data[key]);

			// @ts-ignore
		registerTechnicalManagerFn(formData);
	};

	useEffect(() => {
		if (errors.national_code?.type === "pattern") setTimeout(() => clearErrors("national_code"), 3000);
	}, [errors.national_code]);

	useEffect(() => {
		if (errors.phone?.type === "pattern") setTimeout(() => clearErrors("phone"), 3000);
	}, [errors.phone]);

	useEffect(() => {
		if (errors.capacity?.type === "pattern") setTimeout(() => clearErrors("capacity"), 3000);
	}, [errors.capacity]);

	useEffect(() => {
		if (errors.freighter_capacity?.type === "pattern") setTimeout(() => clearErrors("freighter_capacity"), 3000);
	}, [errors.freighter_capacity]);

	useEffect(() => {
		if (errors.passenger_capacity?.type === "pattern") setTimeout(() => clearErrors("passenger_capacity"), 3000);
	}, [errors.passenger_capacity]);

	useEffect(() => {
		if (type !== 3) {
			resetField("freighter_capacity");
			resetField("passenger_capacity");
		}
	}, [type]);

	useEffect(() => {
		if (type === 3) {
			trigger("freighter_capacity");
			trigger("passenger_capacity");
		}
	}, [capacity, freighter_capacity, passenger_capacity, type]);

	useEffect(() => {
		if (registerTechnicalManagerResult.isSuccess) navigate("/dashboard/technicalmanagers");
	}, [registerTechnicalManagerResult.isSuccess]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit((data) => onSubmit(data), (submitErrors) => console.error("submit errors: ", submitErrors))}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-5"
		>
			<Controller
				name="type"
				control={control}
				rules={{ required: "این فیلد الزامی است." }}
				render={({ field }) => (
					<FormControl
						className="lg:col-start-1 lg:col-end-6"
					>
						<FormLabel
							id="type-label"
							required
						>
							حوزه فعالیت
						</FormLabel>
						<RadioGroup
							{...field}
							onChange={(event) => field.onChange(Number(event.target.value))}
							defaultValue={1}
						>
							<FormControlLabel
								value={1}
								label="باری"
								control={<Radio />}
							/>
							<FormControlLabel
								value={2}
								label="مسافری"
								control={<Radio />}
							/>
							<FormControlLabel
								value={3}
								label="باری و مسافری"
								control={<Radio />}
							/>
						</RadioGroup>
					</FormControl>
				)}
			/>
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
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT" || !!nationalCode}
				required
				fullWidth
			/>
			<TextField
				{...register("phone")}
				label="شماره همراه"
				type="tel"
				error={!!errors.phone}
				helperText={errors.phone?.message ?? ""}
				placeholder="شماره همراه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("phone", { message: "شماره همراه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 11);

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
				disabled
			/>
			<TextField
				{...register("capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش روزانه"
				type="number"
				dir="ltr"
				error={!!errors.capacity}
				helperText={errors.capacity?.message ?? ""}
				placeholder="حداکثر پذیرش روزانه را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("capacity", { message: "حداکثر پذیرش روزانه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			<TextField
				{...register("freighter_capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش باری"
				type="number"
				dir="ltr"
				error={!!errors.freighter_capacity}
				helperText={errors.freighter_capacity?.message ?? ""}
				placeholder="حداکثر پذیرش باری را وارد کنید"
				autoComplete="off"
				hidden={type === 2}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("freighter_capacity", { message: "حداکثر پذیرش باری نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("passenger_capacity", { valueAsNumber: true })}
				label="حداکثر پذیرش مسافری"
				type="number"
				dir="ltr"
				error={!!errors.passenger_capacity}
				helperText={errors.passenger_capacity?.message ?? ""}
				placeholder="حداکثر پذیرش مسافری را وارد کنید"
				autoComplete="off"
				hidden={type === 1}
				slotProps={{
					htmlInput: {
						autoComplete: "off",
					},
					inputLabel: {
						shrink: true,
					},
				}}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("passenger_capacity", { message: "حداکثر پذیرش مسافری نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = Number(newValue) > 999 ? "999" : newValue;
					newValue = Number(newValue) < 0 ? "0" : newValue;

					event.target.value = newValue;
				}}
				fullWidth
			/>
			<DatePickerComponent 
				label="تاریخ شروع همکاری"
				name="start_cooperate"
				control={control}
				disablePast
                autoComplete="off"
			/>
			<DatePickerComponent 
				label="تاریخ پایان همکاری"
				name="end_cooperate"
				control={control}
				disablePast
                autoComplete="off"
			/>
			<Button
				className="lg:row-start-4 lg:h-fit"
				variant="contained"
				type="submit"
				size="large"
				loading={registerTechnicalManagerResult.isLoading}
				fullWidth
			>
				استعلام اطلاعات مدیر فنی
			</Button>
		</form>
	);
};

export default RegisterTechnicalManager;
