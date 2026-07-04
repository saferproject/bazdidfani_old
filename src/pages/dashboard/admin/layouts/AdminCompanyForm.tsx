import { FC, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import AdminCompanyFormInterface from "../interfaces/admin-company-form.interface";
import AdminCompanyFormProps from "../interfaces/admin-company-form-props.interface";
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import TextField from "../../../../components/shared/Inputs/SaferTextField";
import { ArrowSwapHorizontal } from "iconsax-reactjs";
import MapComponent from "../../../../components/shared/Map/Map";
import { useGetCityLocationQuery, useGetDetailsByLocationQuery } from "../../../../api/Map/GetCityLocation";
import { LatLngExpression } from "leaflet";
import { useInquiryOrgCodeMutation } from "../../../../api/Inquiry";
import { useAddCompanyMutation, useEditCompanyMutation } from "../api/admin-company.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { useGetCitiesQuery } from "../../../../api/Categories/Location";
import City from "../interfaces/city.interface";
import DEFAULT_LOCATION from "../../../../shared/constants/default-location";
import { useGetCompaniesQuery } from "../../../../api/Company/NewRequest";

const AdminCompanyForm: FC<AdminCompanyFormProps> = ({ formState, formData, onSubmitCompany, onCancelAddCompany, onCancelEditCompany }) => {
	const [location, setLocation] = useState<LatLngExpression | null>(
		(formData?.location.split(",").map((coordination) => Number(coordination)) as LatLngExpression) ?? DEFAULT_LOCATION
	);
	const [isCitySelectOpen, setIsCitySelectOpen] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		setError,
		getValues,
		control,
		formState: { errors },
	} = useForm<AdminCompanyFormInterface>({
		defaultValues: {
			branch_code: 1,
			company_original_fee: 0,
			...formData,
			city: formData?.cities ?? null,
			state: formData?.states ?? null,
		},
	});

	const { ceo_as_coordinator, city, state, citySearch, organization_code } = useWatch({ control });

	const cities = useGetCitiesQuery({ query: citySearch ?? "" }, { skip: !isCitySelectOpen });

	const [inquiryORGCodeFn, inquiryORGCodeResult] = useInquiryOrgCodeMutation();
	const [addCompanyFn, addCompanyResult] = useAddCompanyMutation();
	const [editCompanyFn, editCompanyResult] = useEditCompanyMutation();

	const onSubmit = (data: AdminCompanyFormInterface) => {
		if (formState === "ADD") addCompanyFn({ ...data, city_code: data.city.code, state_id: data.state.uuid, location: location.toString() });
		else editCompanyFn({ ...data, city_code: data.city.code, state_id: data.state.uuid, location: location.toString() });
	};

	const GetCityLocation = useGetCityLocationQuery({ city: city?.name ?? "", state: state?.name ?? "" });
	const getAddress = useGetDetailsByLocationQuery(location, {
		skip: !location,
	});
	const activeCompanies = useGetCompaniesQuery({
		status: 3
	});

	const handleGetCompanyInfo = async () => {
		inquiryORGCodeFn(getValues("organization_code"));
	};

	const handleCompanyCodeInputKeyDown = (key: string) => {
		if (key === "Enter") handleGetCompanyInfo();
	};

	const handleSetCEOAsCoordinator = (checked: boolean) => {
		const [ceo_name, ceo_phone] = getValues(["ceo_name", "ceo_phone"]);

		checked ? setValue("coordinator_name", ceo_name) : setValue("coordinator_name", "");
		checked ? setValue("coordinator_phone", ceo_phone) : setValue("coordinator_phone", "");

		setValue("ceo_as_coordinator", checked);
	};

	const handleSetCenter = (location: LatLngExpression) => {
		setLocation(location);
	};

	useEffect(() => {
		if (GetCityLocation.isSuccess && GetCityLocation.data?.[0]) setLocation([GetCityLocation.data[0].lat, GetCityLocation.data[0].lon]);
	}, [GetCityLocation.isSuccess, GetCityLocation.data]);

	useEffect(() => {
		if (getAddress.isSuccess) setValue("address", getAddress.data.display_name);
	}, [getAddress.isSuccess, getAddress.data]);

	useEffect(() => {
		if (location) getAddress.refetch();
	}, [location]);

	useEffect(() => {
		if (addCompanyResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: addCompanyResult.data.message,
			});

			onSubmitCompany();
		}
	}, [addCompanyResult.isSuccess, addCompanyResult.data]);

	useEffect(() => {
		if (editCompanyResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: editCompanyResult.data.message,
			});

			onSubmitCompany();
		}
	}, [editCompanyResult.isSuccess, editCompanyResult.data]);

	useEffect(() => {
		if (inquiryORGCodeResult.isSuccess) setValue("name", inquiryORGCodeResult.data.data.company_name);
	}, [inquiryORGCodeResult.isSuccess]);

	useEffect(() => {
		if (formState === "ADD" && organization_code?.length < 7) setValue("name", "");
	}, [organization_code]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-6"
		>
			<Controller
				name="parent"
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={activeCompanies.data?.data ?? []}
						getOptionKey={(option) => option.id}
						getOptionLabel={(option) => option.name}
						loading={activeCompanies.isLoading || activeCompanies.isFetching}
						loadingText="در حال دریافت شرکت ها"
						onChange={(_event, newValue: City) => {
							setValue("parent", newValue);
							setValue("parent_id", newValue.id);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="شرکت"
								placeholder="در صورت دارا بودن شرکت والد آن را انتخاب کنید."
								slotProps={{
									input: {
										...params.InputProps,
										endAdornment: (
											<>
												{activeCompanies.isLoading || activeCompanies.isFetching ? (
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
							/>
						)}
					/>
				)}
			/>
			<TextField
				label="کد سازمانی شرکت"
				type="tel"
				autoComplete="off"
				error={!!errors.organization_code}
				helperText={errors.organization_code?.message ?? ""}
				{...register("organization_code", {
					required: "کد سازمانی الزامی است",
					minLength: { value: 7, message: "کد سازمانی باید 7 رقم باشد" },
					maxLength: { value: 7, message: "کد سازمانی باید 7 رقم باشد" },
					pattern: { value: /^\d+$/, message: "کد سازمانی باید فقط عدد باشد" },
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("organization_code", { message: "کد سازمانی نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 7);

					event.target.value = newValue;
				}}
				slotProps={{
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<Button
									variant="contained"
									size="small"
									className="px-1! min-w-0!"
									onClick={handleGetCompanyInfo}
									loading={inquiryORGCodeResult.isLoading}
								>
									<ArrowSwapHorizontal size="24" />
								</Button>
							</InputAdornment>
						),
					},
					inputLabel: {
						shrink: true,
					},
				}}
				onKeyDown={(event) => handleCompanyCodeInputKeyDown(event.key)}
				disabled={formState === "EDIT"}
				required
				fullWidth
			/>
			<TextField
				label="نام شرکت"
				type="text"
				autoComplete="off"
				error={!!errors.name}
				helperText={errors.name?.message ?? ""}
				{...register("name", {
					required: "لطفا استعلام کد سازمانی شرکت را بگیرید",
					deps: "organization_code",
				})}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
				disabled
			/>
			<TextField
				label="کد ملی شرکت"
				type="tel"
				autoComplete="off"
				error={!!errors.company_national_code}
				helperText={errors.company_national_code?.message ?? ""}
				{...register("company_national_code", {
					required: "کد ملی شرکت الزامی است",
					minLength: { value: 10, message: "کد ملی شرکت باید حداقل 10 رقم باشد" },
					maxLength: { value: 11, message: "کد ملی شرکت باید حداکثر 11 رقم باشد" },
					pattern: { value: /^\d+$/, message: "کد ملی شرکت باید فقط عدد باشد" },
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("company_national_code", { message: "کد ملی شرکت نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

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
				label="کد شعبه"
				type="number"
				autoComplete="off"
				placeholder="کد شعبه را وارد کنید"
				error={!!errors.branch_code}
				helperText={errors.branch_code?.message}
				defaultValue={1}
				{...register("branch_code", {
					required: "کد شعبه را وارد کنید",
					min: { value: 1, message: "کد شعبه حداقل 1 باید باشد" },
					max: { value: 999, message: "کد شعبه حداکثر 999 باید باشد" },
					pattern: { value: /^\d+$/, message: "کد شعبه باید فقط عدد باشد" },
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("branch_code", { message: "کد شعبه نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

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
			<TextField
				label="کد پستی"
				type="tel"
				autoComplete="off"
				placeholder="کد پستی را وارد کنید"
				error={!!errors.postal_code}
				helperText={errors.postal_code?.message}
				{...register("postal_code", {
					required: "کد پستی الزامی است",
					minLength: { value: 10, message: "کد پستی باید 10 رقم باشد" },
					maxLength: { value: 10, message: "کد پستی باید 10 رقم باشد" },
					pattern: { value: /^[13-9][13-9][13-9][13-9][13-9]\d{5}$/g, message: "در 5 رقم اول کد پستی نباید 0 یا 2 باشد" },
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g)) setError("postal_code", { message: "کد پستی نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

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
				label="نام و نام خانوادگی مدیر عامل"
				type="text"
				autoComplete="off"
				placeholder="نام کامل مدیر عامل را وارد کنید"
				error={!!errors.ceo_name}
				helperText={errors.ceo_name?.message}
				{...register("ceo_name", {
					required: "نام و نام خانوادگی مدیر عامل الزامی است",
					maxLength: { value: 64, message: "نام و نام خانوادگی مدیر عامل حداکثر باید 64 حرف باشد" },
					pattern: {
						value: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g,
						message: "نام و نام خانوادگی باید به حروف فارسی باشد",
					},
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g))
						setError("ceo_name", {
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
				label="شماره همراه مدیر عامل"
				type="tel"
				autoComplete="off"
				placeholder="شماره همراه مدیر عامل را وارد کنید"
				error={!!errors.ceo_phone}
				helperText={errors.ceo_phone?.message}
				{...register("ceo_phone", {
					deps: "ceo_name",
					required: "شماره همراه مدیر عامل الزامی است",
					minLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
					maxLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
					pattern: { value: /^09/g, message: "شماره همراه باید با 09 شروع شود" },
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("ceo_phone", {
							message: "شماره همراه نمیتواند شامل حروف یا فاصله باید",
							type: "pattern",
						});

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
				required
			/>
			<TextField
				label="نام پدر مدیر عامل"
				type="text"
				autoComplete="off"
				placeholder="نام پدر مدیر عامل را وارد کنید"
				error={!!errors.father_name}
				helperText={errors.father_name?.message}
				{...register("father_name", {
					deps: "ceo_name",
					required: "نام پدر الزامی است."
				})}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
			/>
			<TextField
				label="کد ملی مدیر عامل"
				type="text"
				autoComplete="off"
				placeholder="کد ملی مدیر عامل را وارد کنید"
				error={!!errors.national_code}
				helperText={errors.national_code?.message}
				{...register("national_code", {
					deps: "ceo_name",
					required: "کد ملی الزامی است.",
					valueAsNumber: false
				})}
				onChange={(event) => {
					const newValue = event.target.value;

					event.target.value = newValue.slice(0, 10);
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
				label="پسوورد مدیر عامل"
				type="text"
				autoComplete="off"
				placeholder="پسووردی برای مدیر عامل وارد کنید"
				error={!!errors.password}
				helperText={errors.password?.message}
				{...register("password", {
					deps: "ceo_name",
					required: "پسوورد الزامی است.",
					min: { value: 6, message: "پسوورد حداقل باید ۶ کارکتر باشد." }
				})}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
			/>
			<FormControlLabel
				control={
					<Checkbox
						{...register("ceo_as_coordinator")}
						onChange={(event) => handleSetCEOAsCoordinator(event.target.checked)}
					/>
				}
				label="مدیر عامل به عنوان رابط فنی"
			/>
			{!ceo_as_coordinator && (
				<>
					<TextField
						label="نام رابط فنی"
						type="text"
						autoComplete="off"
						placeholder="نام کامل رابط فنی را وارد کنید"
						error={!!errors.coordinator_name}
						helperText={errors.coordinator_name?.message}
						{...register("coordinator_name", {
							maxLength: { value: 64, message: "نام و نام خانوادگی حداکثر باید 64 حرف باشد" },
							pattern: {
								value: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g,
								message: "نام و نام خانوادگی باید به حروف فارسی باشد",
							},
						})}
						onChange={(event) => {
							let newValue = event.target.value;

							if (newValue.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g))
								setError("coordinator_name", {
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
					/>
					<TextField
						label="همراه رابط فنی"
						type="tel"
						autoComplete="off"
						placeholder="شماره همراه رابط فنی را وارد کنید"
						error={!!errors.coordinator_phone}
						helperText={errors.coordinator_phone?.message}
						{...register("coordinator_phone", {
							deps: "coordinator_name",
							minLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
							maxLength: { value: 11, message: "شماره همراه باید 11 رقم باشد" },
							pattern: { value: /^09/g, message: "شماره همراه باید با 09 شروع شود" },
						})}
						onChange={(event) => {
							let newValue = event.target.value;

							if (newValue.match(/\D/g))
								setError("coordinator_phone", {
									message: "شماره همراه نمیتواند شامل حروف یا فاصله باید",
									type: "pattern",
								});

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
				</>
			)}
			<Controller
				name="company_usage"
				control={control}
				rules={{ required: "فیلد کاربری الزامی است" }}
				render={({ field }) => (
					<FormControl fullWidth>
						<InputLabel
							shrink={true}
							required
						>
							زمینه فعالیت
						</InputLabel>
						<Select
							{...field}
							label="زمینه فعالیت"
							error={!!errors.company_usage}
							onChange={(event) => field.onChange(event.target.value)}
							sx={{ borderRadius: "8px" }}
							required
						>
							<MenuItem value={1}>باری</MenuItem>
							<MenuItem value={2}>مسافری</MenuItem>
							<MenuItem value={3}>مسافری و باری</MenuItem>
						</Select>
						{errors.company_usage && <FormHelperText>{errors.company_usage?.message}</FormHelperText>}
					</FormControl>
				)}
			/>
			<Controller
				name="city"
				control={control}
				rules={{ required: "شهر الزامی است" }}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={cities.data?.data ?? []}
						getOptionKey={(option) => option.uuid}
						getOptionLabel={(option) => option.name}
						loading={cities.isLoading || cities.isFetching}
						loadingText="در حال دریافت شهر ها"
						onChange={(_event, newValue: City) => {
							setValue("city", { uuid: newValue.uuid, name: newValue.name, code: newValue.code });
							setValue("state", { uuid: newValue.state.uuid, name: newValue.state.name, code: newValue.code });
						}}
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
				label="هزینه اختصاصی بازدید فنی"
				type="number"
				autoComplete="off"
				placeholder="مبلغ هزینه هر بازدید فنی را وارد کنید"
				error={!!errors.company_original_fee}
				helperText={errors.company_original_fee?.message}
				{...register("company_original_fee", {
					min: { value: 0, message: "هزینه اختصاصی بازدید فنی نمی تواند کمتر از 0 باشد" },
					max: { value: 999999999, message: "هزینه اختصاصی بازدید فنی باید کمتر از 999999999 باشد" },
					valueAsNumber: true,
				})}
				onChange={(event) => {
					let newValue = event.target.value;

					if (Number(newValue) < 0)
						setError("company_original_fee", {
							message: "هزینه اختصاصی بازدید فنی نمیتواند کمتر از 0 باشد",
							type: "pattern",
						});
					else if (newValue.match(/\D/g))
						setError("company_original_fee", {
							message: "هزینه اختصاصی بازدید فنی نمیتواند شامل حروف یا فاصله باشد",
							type: "pattern",
						});

					newValue = Number(newValue) < 0 || newValue === "" || newValue === null ? "0" : newValue;
					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 9);

					event.target.value = newValue;
				}}
				slotProps={{
					htmlInput: { step: 1000 },
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
			/>
			<TextField
				className="lg:col-start-1 lg:col-end-4"
				label="آدرس"
				type="text"
				autoComplete="off"
				placeholder="آدرس شرکت را وارد کنید"
				error={!!errors.address}
				helperText={errors.address?.message}
				rows={9}
				{...register("address", {
					required: "آدرس الزامی است",
					maxLength: { value: 1024, message: "آدرس نباید بیش از 1024 حرف باید" },
				})}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				multiline
				fullWidth
				required
			/>
			<div className="w-full rounded-xl border overflow-hidden lg:col-start-4 lg:col-end-7">
				<MapComponent
					center={location}
					setCenter={handleSetCenter}
				/>
			</div>
			<Button
				variant="outlined"
				color="secondary"
				onClick={formState === "ADD" ? onCancelAddCompany : onCancelEditCompany}
			>
				انصراف
			</Button>
			<Button
				type="submit"
				variant="contained"
				loading={addCompanyResult.isLoading || editCompanyResult.isLoading}
				fullWidth
			>
				{formState === "ADD" ? "ثبت" : "ویرایش"} اطلاعات شرکت
			</Button>
		</form>
	);
};

export default AdminCompanyForm;
