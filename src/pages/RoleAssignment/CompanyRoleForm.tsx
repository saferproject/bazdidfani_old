import { FC, useEffect } from "react";
import { useCompanyRoleDataQuery, useUpdateCompanyRoleDataMutation } from "./api/role-assignment.api";
import CompanyFormProps from "./interfaces/company-role-form-props.interface";
import { useForm, useWatch } from "react-hook-form";
import CompanyRoleForm from "./interfaces/company-role-form.interface";
import { Button, Checkbox, FormControlLabel, InputAdornment, TextField } from "@mui/material";
import { TbArrowsExchange } from "react-icons/tb";
import { useInquiryOrgCodeMutation } from "../../api/Inquiry";
import SweetAlertToast from "../../components/shared/Functions/SweetAlertToast";
import SelectCustom from "../../components/shared/Inputs/CustomeSelect";
import CustomeAutoComplete from "../../components/shared/Inputs/CustomeAutoComplete";
import { useGetCitiesQuery } from "../../api/Categories/Location";
import { useGetCityLocationQuery, useGetDetailsByLocationQuery } from "../../api/Map/GetCityLocation";
import MapComponent from "../../components/shared/Map/Map";
import { useRegisterCompanyMutation } from "../../api/Profile/Register/Company";
import { LatLngExpression } from "leaflet";
import DEFAULT_LOCATION from "../../shared/constants/default-location";

const CompanyForm: FC<CompanyFormProps> = ({ formState }) => {
	const {
		register,
		control,
		handleSubmit,
		setError,
		clearErrors,
		getValues,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm<CompanyRoleForm>({ defaultValues: { location: DEFAULT_LOCATION, branch_code: 1 } });

	const { location, cities, states, citySearch, ceo_as_coordinator, organization_code } = useWatch({
		control,
	});

	const companyRoleData = useCompanyRoleDataQuery(undefined, { skip: formState === "ADD" });
	const [updateCompanyRoleDataFn, updateCompanyRoleDataResult] = useUpdateCompanyRoleDataMutation();
	const [inquiryORGCodeFn, inquiryORGCodeResult] = useInquiryOrgCodeMutation();
	const [registerCompanyFn, registerCompanyResult] = useRegisterCompanyMutation();
	const citiesQuery = useGetCitiesQuery({
		query: citySearch,
	});
	const GetCityLocation = useGetCityLocationQuery(
		{
			city: cities?.name,
			state: states?.name,
		},
		{
			skip: !cities || !states,
		}
	);
	//@ts-ignore
	const getAddress = useGetDetailsByLocationQuery(location, {
		skip: !location,
	});

	const handleGetCompanyInfo = async () => {
		inquiryORGCodeFn(String(getValues("organization_code")));
	};

	const handleCompanyCodeInputKeyDown = (event) => {
		if (event.key === "Enter") handleGetCompanyInfo();
	};

	const handleSetCEOAsCoordinator = (event) => {
		const [ceo_name, ceo_phone] = getValues(["ceo_name", "ceo_phone"]);

		event.target.checked ? setValue("coordinator_name", ceo_name) : setValue("coordinator_name", "");
		event.target.checked ? setValue("coordinator_phone", ceo_phone) : setValue("coordinator_phone", "");

		setValue("ceo_as_coordinator", event.target.checked);
	};

	const handleSetCenter = (location: LatLngExpression) => {
		setValue("location", location);
	};

	const onSubmit = (data: CompanyRoleForm) => {
		if (formState === "ADD")
			registerCompanyFn({
				...data,
				city_code: data.cities?.code,
				state_id: data.states.uuid,
				location: (data.location as number[]).join(","),
			});
		else
			updateCompanyRoleDataFn({
				...data,
				city_code: data.cities?.code,
				state_id: data.states.uuid,
				//@ts-ignore
				location: (data.location as number[]).join(","),
			});
	};

	useEffect(() => {
		if (inquiryORGCodeResult.isSuccess) setValue("name", inquiryORGCodeResult.data.data.company_name);
	}, [inquiryORGCodeResult.isSuccess]);

	useEffect(() => {
		if (errors.organization_code?.type === "pattern") setTimeout(() => clearErrors("organization_code"), 3000);
	}, [errors.organization_code]);

	useEffect(() => {
		if (errors.company_national_code?.type === "pattern") setTimeout(() => clearErrors("company_national_code"), 3000);
	}, [errors.company_national_code]);

	useEffect(() => {
		if (errors.branch_code?.type === "pattern") setTimeout(() => clearErrors("branch_code"), 3000);
	}, [errors.branch_code]);

	useEffect(() => {
		if (errors.postal_code?.type === "pattern") setTimeout(() => clearErrors("postal_code"), 3000);
	}, [errors.postal_code]);

	useEffect(() => {
		if (errors.ceo_name?.type === "pattern") setTimeout(() => clearErrors("ceo_name"), 3000);
	}, [errors.ceo_name]);

	useEffect(() => {
		if (errors.ceo_phone?.type === "pattern") setTimeout(() => clearErrors("ceo_phone"), 3000);
	}, [errors.ceo_phone]);

	useEffect(() => {
		if (errors.coordinator_name?.type === "pattern") setTimeout(() => clearErrors("coordinator_name"), 3000);
	}, [errors.coordinator_name]);

	useEffect(() => {
		if (errors.coordinator_phone?.type === "pattern") setTimeout(() => clearErrors("coordinator_phone"), 3000);
	}, [errors.coordinator_phone]);

	useEffect(() => {
		if (errors.address?.type === "pattern") setTimeout(() => clearErrors("address"), 3000);
	}, [errors.address]);

	useEffect(() => {
		if (watch("cities.state")) setValue("states", watch("cities.state"));
	}, [watch("cities.state"), setValue]);

	useEffect(() => {
		if (GetCityLocation.isSuccess && GetCityLocation.data?.length) setValue("location", [GetCityLocation.data[0].lat, GetCityLocation.data[0].lon]);
	}, [GetCityLocation.isSuccess, GetCityLocation.data]);

	useEffect(() => {
		if (getAddress.isSuccess) setValue("address", getAddress.data.display_name);
	}, [getAddress.isSuccess, getAddress.data]);

	useEffect(() => {
		if (registerCompanyResult.isSuccess) window.location.href = "/dashboard";
	}, [registerCompanyResult.isSuccess]);

	useEffect(() => {
		if (formState === "EDIT" && companyRoleData.isSuccess)
			reset({
				...companyRoleData.data.data,
				location: companyRoleData.data.data.location.split(",").map(l => Number(l)),
				citySearch: companyRoleData.data.data.city,
			});
	}, [formState, companyRoleData.isSuccess, companyRoleData.data]);

	useEffect(() => {
		if (updateCompanyRoleDataResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: updateCompanyRoleDataResult.data.message,
			});

			reset({
				...updateCompanyRoleDataResult.data.data,
				location: updateCompanyRoleDataResult.data.data.location.split(",").map((l) => Number(l)),
				citySearch: updateCompanyRoleDataResult.data.data.city,
			});
		}
	}, [updateCompanyRoleDataResult.isSuccess, updateCompanyRoleDataResult.data]);

	useEffect(() => {
		if (formState === "ADD" && organization_code?.length < 7) setValue("name", "");
	}, [organization_code]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="w-full flex flex-col gap-4 lg:grid lg:grid-cols-6"
			autoComplete="off"
		>
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
									<TbArrowsExchange size={24} />
								</Button>
							</InputAdornment>
						),
					},
					inputLabel: {
						shrink: true,
					},
					htmlInput: {
						autoComplete: "off",
					},
				}}
				onKeyDown={handleCompanyCodeInputKeyDown}
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
					htmlInput: {
						autoComplete: "off",
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
					htmlInput: {
						autoComplete: "off",
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
					htmlInput: {
						autoComplete: "off",
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
					htmlInput: {
						autoComplete: "off",
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
					htmlInput: {
						autoComplete: "off",
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
					htmlInput: {
						autoComplete: "off",
					},
				}}
				fullWidth
				required
			/>
			<FormControlLabel
				control={
					<Checkbox
						{...register("ceo_as_coordinator")}
						onChange={handleSetCEOAsCoordinator}
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
							htmlInput: {
								autoComplete: "off",
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
								setError("ceo_name", {
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
							htmlInput: {
								autoComplete: "off",
							},
						}}
						fullWidth
					/>
				</>
			)}
			<SelectCustom
				control={control}
				label="زمینه فعالیت"
				name="company_usage"
				error={errors.company_usage}
				items={[
					{ title: "باری", value: 1 },
					{ title: "مسافری", value: 2 },
					{ title: "مسافری و باری", value: 3 },
				]}
				rules={{ required: "فیلد کاربری الزامی است" }}
				required={true}
				fullWidth
			/>
			<CustomeAutoComplete
				label="شهر"
				showField="name"
				name="cities"
				control={control}
				data={citiesQuery.data?.data || []}
				loading={citiesQuery.isLoading || citiesQuery.isFetching}
				setValue={setValue}
				searchName="citySearch"
				placeholder="شهر باید مکان ثبت شده شرکت باشد"
				rules={{ required: "فیلد کاربری الزامی است" }}
				required={true}
			/>
			<TextField
				label="استان"
				type="text"
				{...register("states.name")}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
					htmlInput: {
						autoComplete: "off",
					},
				}}
				disabled
				fullWidth
				required
			/>
			<TextField
				className="lg:col-start-1 lg:col-end-3"
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
					htmlInput: {
						autoComplete: "off",
					},
				}}
				multiline
				fullWidth
				required
			/>
			<div className="w-full rounded-xl border overflow-hidden lg:col-start-3 lg:col-end-7">
				<MapComponent
					//@ts-ignore
					center={location}
					setCenter={handleSetCenter}
				/>
			</div>
			<Button
				type="submit"
				variant="contained"
				loading={registerCompanyResult.isLoading || updateCompanyRoleDataResult.isLoading}
				fullWidth
			>
				{formState === "ADD" ? "ثبت" : "ویرایش"} اطلاعات شرکت
			</Button>
		</form>
	);
};

export default CompanyForm;
