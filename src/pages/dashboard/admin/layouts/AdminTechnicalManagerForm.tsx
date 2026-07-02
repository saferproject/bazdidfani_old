import { FC, useEffect, useState } from "react";
import AdminTechnicalManagerFormProps from "../interfaces/admin-technical-manager-form-porps.interface";
import { Controller, useForm, useWatch } from "react-hook-form";
import TechnicalManagerFormSchema, { TechnicalManagerFormType } from "../../../RoleAssignment/schemas/technical-manager-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import CertificateImage from "../../../RoleAssignment/interfaces/certificate-image.interface";
import { dataUrlToFile } from "../../../../utilities/dataURLToFile";
import { Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup } from "@mui/material";
import TextField from "../../../../components/shared/Inputs/SaferTextField";
import TechnicalManagerRoleData from "../../../RoleAssignment/interfaces/technical-manager-role-data.interface";
import { useAddAdminTechnicalManagerMutation, useEditAdminTechnicalManagerMutation } from "../api/admin-technical-manager.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { STORAGE_URL } from "../../../../Stores/api-urls";
import { compressImage } from "../../../../utilities/compress-image";
import DatePickerComponent from "../../../../components/shared/DatePicker/DatePickerComponent";
import CustomeAutoComplete from "../../../../components/shared/Inputs/CustomeAutoComplete";
import { useGetTechnicalManagerCompaniesQuery } from "../../../../api/TechnicalManager/TechnicalVisit";
import { useGetCitiesQuery } from "../../../../api/Categories/Location";
import { useGetCompaniesQuery } from "../../../../api/Company/NewRequest";

const AdminTechnicalManagerForm: FC<AdminTechnicalManagerFormProps> = ({
	formState,
	formData,
	onSubmitTechnicalManager,
	onCancelAddTechnicalManager,
	onCancelEditTechnicalManager,
}) => {
	const [freighterCertificationImage, setFreighterCertificationImage] = useState<CertificateImage | null>(null);
	const [passengerCertificationImage, setPassengerCertificationImage] = useState<CertificateImage | null>(null);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		reset,
		resetField,
		trigger,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TechnicalManagerFormType>({
		defaultValues: { type: null },
		resolver: zodResolver(TechnicalManagerFormSchema),
		mode: "onBlur",
	});

	const { citySearch } = useWatch({ control });

	const { capacity, freighter_capacity, passenger_capacity, type } = useWatch<TechnicalManagerFormType>({ control });

	const [addTechnicalManagerFn, addTechnicalManagerResult] = useAddAdminTechnicalManagerMutation();
	const [editTechnicalManagerFn, editTechnicalManagerResult] = useEditAdminTechnicalManagerMutation();

	const getCompanies = useGetCompaniesQuery();

	const cities = useGetCitiesQuery({
		query: citySearch,
	  });

	const onSubmit = async (data: TechnicalManagerFormType) => {
		const newFormData = new FormData();

		for (const key in data) {
			if (key === "freighter_capacity" || key === "passenger_capacity")
				newFormData.append(key, data[key] ?? 0);
			else
				newFormData.append(key, data[key]);
		}

		// ? چون به عکس های روی سرور دسترسی در کد نداریم شرط دوم را گذاشتم
		if (
			freighterCertificationImage &&
			!freighterCertificationImage.image.includes("https://api.bazdidfani.ir/storage/") &&
			!freighterCertificationImage.image.includes("https://test-backend.bazdidfani.ir/storage/")
		)
			newFormData.append(
				"Certification_technicalmanager_freighter",
				await compressImage(await dataUrlToFile(freighterCertificationImage.image, freighterCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (
			passengerCertificationImage &&
			!passengerCertificationImage.image.includes("https://api.bazdidfani.ir/storage/") &&
			!passengerCertificationImage.image.includes("https://test-backend.bazdidfani.ir/storage/")
		)
			newFormData.append(
				"Certification_technicalmanager_passenger",
				await compressImage(await dataUrlToFile(passengerCertificationImage.image, passengerCertificationImage.name), {
					maxSizeMB: 0.5,
					useWebWorker: true,
				})
			);

		if (formData) newFormData.append("user_id", String(formData.user_id));

		// TODO: add submittion functions here
		if (formState === "ADD") addTechnicalManagerFn(newFormData);
		else editTechnicalManagerFn(newFormData);
	};

	const setFormData = (data: TechnicalManagerRoleData) => {
		reset({
			national_code: data.user.personal.national_code,
			phone: data.user.personal.phone,
			...data,
		});

		const imageFreighter = data.user.images?.find((image) => image.image_type === "freighter");
		const imagePassenger = data.user.images?.find((image) => image.image_type === "passenger");

		if (imageFreighter)
			setFreighterCertificationImage({
				image: STORAGE_URL + imageFreighter.url,
				name: "عکس گواهی بازدید باری",
				id: imageFreighter.id,
				user_id: imageFreighter.user_id,
			});

		if (imagePassenger)
			setPassengerCertificationImage({
				image: STORAGE_URL + imagePassenger.url,
				name: "عکس گواهی بازدید مسافری",
				id: imagePassenger.id,
				user_id: imagePassenger.user_id,
			});
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
		switch (type) {
			case 1:
				setPassengerCertificationImage(null);
				break;

			case 2:
				setFreighterCertificationImage(null);
				break;
		}

		if (type !== 3) {
			resetField("freighter_capacity");
			resetField("passenger_capacity");
		}
	}, [type]);

	useEffect(() => {
		if (formState === "EDIT" && formData) setFormData(formData);
	}, [formState, formData]);

	useEffect(() => {
		if (type === 3) {
			trigger("freighter_capacity");
			trigger("passenger_capacity");
		}
	}, [capacity, freighter_capacity, passenger_capacity, type]);

	useEffect(() => {
		if (addTechnicalManagerResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: addTechnicalManagerResult.data.message,
			});

			onSubmitTechnicalManager();
		}
	}, [addTechnicalManagerResult.isSuccess, addTechnicalManagerResult.data]);

	useEffect(() => {
		if (editTechnicalManagerResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: editTechnicalManagerResult.data.message,
			});

			onSubmitTechnicalManager();
		}
	}, [editTechnicalManagerResult.isSuccess, editTechnicalManagerResult.data]);

	console.log(errors)

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-5"
		>
			<Controller
				name="type"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<FormControl
						required
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
							defaultValue={null}
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
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
				fullWidth
			/>
			<TextField
				{...register("full_name")}
				label="نام کامل"
				type="text"
				error={!!errors.full_name}
				helperText={errors.full_name?.message ?? ""}
				placeholder="نام کامل را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("father_name")}
				label="نام پدر"
				type="text"
				error={!!errors.father_name}
				helperText={errors.father_name?.message ?? ""}
				placeholder="نام پدر را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("address")}
				label="آدرس"
				type="text"
				error={!!errors.address}
				helperText={errors.address?.message ?? ""}
				placeholder="آدرس را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("email")}
				label="ایمیل"
				type="text"
				error={!!errors.email}
				helperText={errors.email?.message ?? ""}
				placeholder="ایمیل را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				{...register("telephone")}
				label="تلفن ثابت‌"
				type="text"
				error={!!errors.telephone}
				helperText={errors.telephone?.message ?? ""}
				placeholder="تلفن ثابت‌ را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<DatePickerComponent
				{...register("birthdate")}
				control={control}
				label="تاریخ تولد"
				error={!!errors.birthdate}
				helperText={errors.birthdate?.message ?? ""}
				placeholder="تاریخ تولد را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				disableFuture
			/>
			<CustomeAutoComplete
				showField="name"
				name="city"
				className="md:col-span-1"
				control={control}
				data={cities.data?.data}
				loading={cities.isLoading || cities.isFetching}
				setValue={setValue}
				onChange={(_, newValue) => {
					setValue("city_code", newValue.code);
					setValue("city", newValue);
				}}
				searchName="citySearch"
				label="شهر"
				rules={{
					required: "این فیلد الزامی است",
				}}
			/>
			<CustomeAutoComplete
				showField="name"
				name="company"
				className="md:col-span-1"
				control={control}
				data={getCompanies.data?.data}
				loading={getCompanies.isLoading || getCompanies.isFetching}
				setValue={setValue}
				getOptionLabel={(option) => option.name}
				onChange={(_, newValue) => {
					setValue("company_id", newValue.id);
					setValue("company", newValue);
				}}
				searchName="companySearch"
				label="شرکت حمل و نقل"
				rules={{
					required: "این فیلد الزامی است",
				}}
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
					inputLabel: {
						shrink: true,
					},
				}}
				disabled={formState === "EDIT"}
				fullWidth
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
					inputLabel: {
						shrink: true,
					},
				}}
				required
				fullWidth
			/>
			{type !== 2 && (
				<TextField
					{...register("freighter_capacity", { valueAsNumber: true })}
					label="حداکثر پذیرش باری"
					type="number"
					dir="ltr"
					error={!!errors.freighter_capacity}
					helperText={errors.freighter_capacity?.message ?? ""}
					placeholder="حداکثر پذیرش باری را وارد کنید"
					autoComplete="off"
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
						inputLabel: {
							shrink: true,
						},
					}}
					fullWidth
				/>
			)}
			{type !== 1 && (
				<TextField
					{...register("passenger_capacity", { valueAsNumber: true })}
					label="حداکثر پذیرش مسافری"
					type="number"
					dir="ltr"
					error={!!errors.passenger_capacity}
					helperText={errors.passenger_capacity?.message ?? ""}
					placeholder="حداکثر پذیرش مسافری را وارد کنید"
					autoComplete="off"
					onChange={(event) => {
						let newValue = event.target.value;

						if (newValue.match(/\D/g))
							setError("passenger_capacity", { message: "حداکثر پذیرش مسافری نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

						newValue = newValue.replace(/\D/g, "");
						newValue = Number(newValue) > 999 ? "999" : newValue;
						newValue = Number(newValue) < 0 ? "0" : newValue;

						event.target.value = newValue;
					}}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
					fullWidth
				/>
			)}
			<DatePickerComponent
				{...register("start_cooperate")}
				control={control}
				label="تاریخ شروع همکاری"
				error={!!errors.start_cooperate}
				helperText={errors.start_cooperate?.message ?? ""}
				placeholder="تاریخ شروع همکاری را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<DatePickerComponent
				{...register("end_cooperate")}
				control={control}
				label="تاریخ پایان همکاری"
				error={!!errors.end_cooperate}
				helperText={errors.end_cooperate?.message ?? ""}
				placeholder="تاریخ پایان همکاری را وارد کنید"
				autoComplete="off"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<Box className="flex flex-row items-stretch gap-4! col-span-4 w-full! justify-start">
				<Button
					variant="outlined"
					color="secondary"
					onClick={formState === "ADD" ? onCancelAddTechnicalManager : onCancelEditTechnicalManager}
				>
					انصراف
				</Button>
				<Button
					variant="contained"
					type="submit"
					size="large"
					loading={addTechnicalManagerResult.isLoading || editTechnicalManagerResult.isLoading}
				>
					{formState === "ADD" ? "افزودن مدیر فنی" : "ویرایش اطلاعات مدیر فنی"}
				</Button>
			</Box>
		</form>
	);
};

export default AdminTechnicalManagerForm;
