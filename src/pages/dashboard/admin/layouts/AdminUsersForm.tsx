import { FC, useEffect, useState } from "react";
import { useEditAdminUsersMutation } from "../api/admin-users.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import AdminUsersFormProps from "../interfaces/admin-users-form-props.interface";
import AdminUserFormSchema, { AdminUserFormType } from "../schemas/admin-user-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCitiesQuery } from "../../../../api/Categories/Location";
import DatePickerComponent from "../../../../components/shared/DatePicker/DatePickerComponent";

const AdminUsersForm: FC<AdminUsersFormProps> = ({ formState, formData, onCancelEditUser }) => {
	const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		setValue,
		control,
		formState: { errors },
	} = useForm<AdminUserFormType>({
		defaultValues: { ...formData.personal, citySearch: formData.personal.cities.name },
		resolver: zodResolver(AdminUserFormSchema),
		mode: "onBlur",
	});

	const { citySearch } = useWatch({ control });

	const onSubmit = (data: AdminUserFormType) => editAdminUsersFn({ ...data, user_id: formData.id });

	const cities = useGetCitiesQuery({ query: citySearch ?? "" }, { skip: !isCitySelectOpen && formState !== "EDIT" });

	const [editAdminUsersFn, editAdminUsersResult] = useEditAdminUsersMutation();

	useEffect(() => {
		if (editAdminUsersResult.isSuccess) {
			SweetAlertToast.fire({
				text: editAdminUsersResult.data.message,
				icon: "success",
			});
			onCancelEditUser();
		}
	}, [editAdminUsersResult.isSuccess, editAdminUsersResult.data]);

	useEffect(() => {
		if (errors.national_code?.type === "pattern") setTimeout(() => clearErrors("national_code"), 3000);
	}, [errors.national_code]);

	useEffect(() => {
		if (errors.phone?.type === "pattern") setTimeout(() => clearErrors("phone"), 3000);
	}, [errors.phone]);

	useEffect(() => {
		if (errors.father_name?.type === "pattern") setTimeout(() => clearErrors("father_name"), 3000);
	}, [errors.father_name]);

	useEffect(() => {
		if (errors.full_name?.type === "pattern") setTimeout(() => clearErrors("full_name"), 3000);
	}, [errors.full_name]);

	useEffect(() => {
		if (errors.telephone?.type === "pattern") setTimeout(() => clearErrors("telephone"), 3000);
	}, [errors.telephone]);

	useEffect(() => {
		if (formState === "EDIT" && formData && !cities.isUninitialized) cities.refetch();
	}, [formState, formData, cities.isUninitialized]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-4"
		>
			<TextField
				{...register("phone")}
				label="شماره همراه / نام کاربری"
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
				required
				fullWidth
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
							message: "نام پدر نمیتواند شامل حروفی غیر از فارسی یا عدد یا نماد باشد",
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
				{...register("telephone")}
				label="شماره تلفن ثابت"
				type="tel"
				error={!!errors.telephone}
				helperText={errors.telephone?.message ?? ""}
				placeholder="شماره تلفن ثابت را وارد کنید"
				autoComplete="off"
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("telephone", { message: "شماره تلفن ثابت نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 11);

					event.target.value = newValue;
				}}
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
				type="email"
				autoComplete="off"
				placeholder="ایمیل را وارد کنید"
				error={!!errors.email}
				helperText={errors.email?.message}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
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
				name="city_code"
				control={control}
				rules={{ required: "شهر الزامی است" }}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={cities.data?.data ?? []}
						getOptionKey={(option) => option.code}
						getOptionLabel={(option) => (typeof option === "number" ? option : option.name ?? "")}
						isOptionEqualToValue={(option, value) => (typeof value === "number" ? option.code === value : option.code === value.code)}
						value={cities.data?.data.find((city) => city.code === field.value) ?? null}
						onChange={(_event, newValue) => {
							field.onChange(newValue ? newValue.code : null);
						}}
						loading={cities.isLoading || cities.isFetching}
						loadingText="در حال دریافت شهر ها"
						onInputChange={(_event, newInputValue) => {
							setValue("citySearch", newInputValue);
						}}
						onOpen={() => {
							setIsCitySelectOpen(true);
						}}
						onClose={() => {
							setIsCitySelectOpen(false);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="شهر"
								placeholder="شهر باید مکان ثبت شده شرکت باشد"
								slotProps={{
									input: {
										...params.InputProps,
										endAdornment: (
											<>
												{cities.isLoading || cities.isFetching ? (
													<CircularProgress
														color="inherit"
														size={20}
													/>
												) : null}
												{params.InputProps.endAdornment}
											</>
										),
									},
								}}
								required
							/>
						)}
					/>
				)}
			/>
			<TextField
				{...register("password", { 
					onChange: (event) => {
						if (event.target.value === "" || event.target.value === null) event.target.value = undefined;
					}
				})}
				label="پسوورد"
				type="text"
				autoComplete="off"
				placeholder="پسوورد را وارد کنید"
				error={!!errors.password}
				helperText={errors.password?.message}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				className="lg:col-start-1 lg:col-end-5"
				label="آدرس"
				type="text"
				autoComplete="off"
				placeholder="آدرس شرکت را وارد کنید"
				error={!!errors.address}
				helperText={errors.address?.message}
				// rows={9}
				{...register("address", {
					required: "آدرس الزامی است",
					maxLength: { value: 1024, message: "آدرس نباید بیش از 1024 حرف باید" },
					pattern: {
						value:
							/[\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641-\u0642\u06A9\u06AF\u0644-\u0648\u0647\u06CC\u06F0-\u06F9\u064B-\u0652\s،]/g,
						message: "آدرس نباید شامل حروف غیر فارسی باشد",
					},
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (
						newValue.match(
							/[^\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641-\u0642\u06A9\u06AF\u0644-\u0648\u0647\u06CC\u06F0-\u06F9\u064B-\u0652\s،]/g
						)
					)
						setError("address", {
							message: "ادرس نمیتواند شامل حروفی غیر از فارسی باشد",
							type: "pattern",
						});

					newValue = newValue.replace(
						/[^\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641-\u0642\u06A9\u06AF\u0644-\u0648\u0647\u06CC\u06F0-\u06F9\u064B-\u0652\s،]/g,
						""
					);
					newValue = newValue.slice(0, 64);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				multiline
				fullWidth
				required
			/>
			<div className="flex gap-4">
				<Button
					variant="outlined"
					color="secondary"
					onClick={formState === "ADD" ? () => {} : onCancelEditUser}
					fullWidth
				>
					انصراف
				</Button>
				<Button
					type="submit"
					variant="contained"
					loading={editAdminUsersResult.isLoading}
					fullWidth
				>
					{formState === "ADD" ? "ثبت" : "ویرایش"} اطلاعات کاربر
				</Button>
			</div>
		</form>
	);
};

export default AdminUsersForm;
