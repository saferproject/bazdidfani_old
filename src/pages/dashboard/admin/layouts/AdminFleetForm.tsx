import { FC, useEffect, useState } from "react";
import AdminFleetFormProps from "../interfaces/admin-fleet-form-props.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import AdminFleetFormSchema, { AdminFleetFormType } from "../schemas/admin-fleet-form.schema";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import TextField from "../../../../components/shared/Inputs/SaferTextField";
import { ArrowSwapHorizontal } from "iconsax-reactjs";
import {
	useAddAdminFleetMutation,
	useEditAdminFleetMutation,
	useGetAdminFleetDataForEditMutation,
	useGetAdminFleetDataMutation,
} from "../api/admin-fleet.api";
import DatePickerComponent from "../../../../components/shared/DatePicker/DatePickerComponent";
import { useGetLoadingTypesByActivityTypeQuery } from "../../../../api/fleet/Fleet";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import PlateTextField from "../../../../components/shared/Inputs/PlateTextField";
import { useAppSelector } from "../../../../Stores/hooks";

const AdminFleetForm: FC<AdminFleetFormProps> = ({ formState, formData, onSubmitFleet, onCancelAddFleet, onCancelEditFleet }) => {
	const [isLoaderSelectOpen, setIsloaderSelectOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		getValues,
		setValue,
		watch,
		control,
		formState: { errors },
	} = useForm<AdminFleetFormType>({
		defaultValues: {
			smart_number: null,
			certificate_type: 1,
			type_ownership: 3,
			usage: "freighter",
			...formData,
			...(formData?.trucks_info[0] ?? {}),
			loaderSearch: formData?.loader.name ?? "",
		},
		resolver: zodResolver(AdminFleetFormSchema),
		mode: "onBlur",
	});

	useEffect(() => {

	}, []);

	const { usage, loaderSearch } = useWatch({ control });

	const onSubmit = (data: AdminFleetFormType) => {
		if (formState === "ADD") addFleetFn(data);
		else editFleetFn({ ...data, id: formData.id });
	};

	const loaders = useGetLoadingTypesByActivityTypeQuery(
		{
			activityType: usage,
			query: loaderSearch ?? "",
		},
		{ skip: (!isLoaderSelectOpen || !usage) && formState !== "EDIT" }
	);

	const [smartNumberInquiryFn, smartNumberInquiryResult] = useGetAdminFleetDataMutation();
	const [smartNumberInquiryForEditFn, smartNumberInquiryForEditResult] = useGetAdminFleetDataForEditMutation();
	const [addFleetFn, addFleetResult] = useAddAdminFleetMutation();
	const [editFleetFn, editFleetResult] = useEditAdminFleetMutation();

	const handleGetTruckInfo = async () => {
		const [smart_number, usage] = getValues(["smart_number", "usage"]);

		if (smart_number && usage) {
			if (formState === "ADD") smartNumberInquiryFn({ smart_number, usage, company_usage: 3 });
			else smartNumberInquiryForEditFn({ smart_number, usage });
		} else
			SweetAlertToast.fire({
				icon: "warning",
				text: "نوع کاربری و شماره هوشمند را پر کنید",
			});
	};

	const handleSmartNumberInputKeyDown = (key: string) => {
		if (key === "Enter") handleGetTruckInfo();
	};

	useEffect(() => {
		if (errors.smart_number?.type === "pattern") setTimeout(() => clearErrors("smart_number"), 3000);
	}, [errors.smart_number]);

	useEffect(() => {
		if (errors.date_made?.type === "pattern") setTimeout(() => clearErrors("date_made"), 3000);
	}, [errors.date_made]);

	useEffect(() => {
		if (errors.description?.type === "pattern") setTimeout(() => clearErrors("description"), 3000);
	}, [errors.description]);

	useEffect(() => {
		if (smartNumberInquiryResult.isSuccess) reset(smartNumberInquiryResult.data.data);
	}, [smartNumberInquiryResult.isSuccess, smartNumberInquiryResult.isError, smartNumberInquiryResult.data]);

	useEffect(() => {
		if (smartNumberInquiryForEditResult.isSuccess) reset(smartNumberInquiryForEditResult.data.data);
	}, [smartNumberInquiryForEditResult.isSuccess, smartNumberInquiryForEditResult.isError, smartNumberInquiryForEditResult.data]);

	useEffect(() => {
		if (addFleetResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: addFleetResult.data.message,
			});

			onSubmitFleet();
		}
	}, [addFleetResult.isSuccess, addFleetResult.data]);

	useEffect(() => {
		if (editFleetResult.isSuccess) {
			SweetAlertToast.fire({
				icon: "success",
				text: editFleetResult.data.message,
			});

			onSubmitFleet();
		}
	}, [editFleetResult.isSuccess, editFleetResult.data]);

	useEffect(() => {
		if (formState === "EDIT" && formData && !loaders.isUninitialized) loaders.refetch();
	}, [formState, formData, loaders.isUninitialized]);

	// useEffect(() => {
	// 	if (formState === "EDIT" && loaders.isSuccess && loaders.data[0]?.uuid) setValue("loader_type_id", loaders.data[0].uuid);
	// }, [formState, loaders.isSuccess, loaders.data]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit(onSubmit)}
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			<Controller
				name="type_ownership"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<FormControl required className="col-span-full">
						<FormLabel id="type-label" required>
							نوع مالکیت
						</FormLabel>
						<RadioGroup
							{...field}
							row
							onChange={(event) => field.onChange(Number(event.target.value))}
							defaultValue={1}
						>
							<FormControlLabel value={0} label="ملکی" control={<Radio />} />
							<FormControlLabel value={1} label="استیجاری" control={<Radio />} />
							<FormControlLabel value={2} label="آزاد" control={<Radio />} />
							<FormControlLabel value={3} label="نامعلوم" control={<Radio />} />
						</RadioGroup>
					</FormControl>
				)}
			/>
			<Controller
				name="usage"
				control={control}
				render={({ field }) => (
					<FormControl fullWidth>
						<InputLabel
							shrink={true}
							required
						>
							نوع کاربری
						</InputLabel>
						<Select
							{...field}
							label="نوع کاربری"
							error={!!errors.usage}
							onChange={(event) => field.onChange(event.target.value)}
							sx={{ borderRadius: "8px" }}
							required
						>
							<MenuItem value="freighter">باری</MenuItem>
							<MenuItem value="passenger">مسافری</MenuItem>
						</Select>
						{errors.usage && <FormHelperText>{errors.usage?.message}</FormHelperText>}
					</FormControl>
				)}
			/>
			<TextField
				{...register("smart_number", { valueAsNumber: true })}
				label="شماره هوشمند"
				type="tel"
				autoComplete="off"
				error={!!errors.smart_number}
				helperText={errors.smart_number?.message ?? ""}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("smart_number", { message: "شماره هوشمند نمیتواند شامل حروف یا فاصله باشد", type: "pattern" });

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
									onClick={handleGetTruckInfo}
									loading={smartNumberInquiryResult.isLoading || smartNumberInquiryForEditResult.isLoading}
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
				onKeyDown={(event) => handleSmartNumberInputKeyDown(event.key)}
				disabled={formState === "EDIT"}
				required
				fullWidth
			/>
			<div className="col-span-full sm:col-span-2 lg:col-span-1">
				<PlateTextField
					control={control}
					watch={watch}
					error={!!(errors.first_number || errors.third_character || errors.second_number || errors.fourth_number)}
					helperText={errors.first_number?.message?.toString()}
					rules={{ required: "فیلد پلاک ماشین الزامی است" }}
				/>
			</div>
			<DatePickerComponent
				label="اعتبار بیمه"
				name="Insurance_validity"
				rules={{ required: "اعتبار بیمه الزامی است" }}
				error={!!errors.Insurance_validity}
				helperText={errors.Insurance_validity?.message ?? ""}
				control={control}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "8px",
					},
				}}
			/>
			<DatePickerComponent
				label="اعتبار معاینه فنی"
				name="validity_technical_examination"
				rules={{ required: "اعتبار معاینه فنی الزامی است" }}
				error={!!errors.validity_technical_examination}
				helperText={errors.validity_technical_examination?.message ?? ""}
				control={control}
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "8px",
					},
				}}
			/>
			<TextField
				{...register("date_made", { valueAsNumber: true })}
				label="سال ساخت"
				type="number"
				autoComplete="off"
				placeholder="سال ساخت را وارد کنید"
				error={!!errors.date_made}
				helperText={errors.date_made?.message ?? ""}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("date_made", {
							message: "سال ساخت نمیتواند شامل حروف باشد",
							type: "pattern",
						});

					newValue = newValue.replace(/\D/g, "");
					newValue = newValue.slice(0, 4);

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
			<Controller
				name="loader_type_id"
				control={control}
				rules={{ required: "نوع الزامی است" }}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={loaders.data?.data ?? []}
						getOptionKey={(option) => option.uuid}
						getOptionLabel={(option) => (typeof option === "string" ? option : option.name ?? "")}
						isOptionEqualToValue={(option, value) => (typeof value === "string" ? option.uuid === value : option.uuid === value.uuid)}
						value={loaders.data?.data.find((l) => l.uuid === field.value) ?? null}
						onChange={(_event, newValue) => {
							field.onChange(newValue ? newValue.uuid : null);
						}}
						loading={loaders.isLoading || loaders.isFetching}
						loadingText="در حال دریافت"
						onInputChange={(_event, newInputValue) => {
							if (newInputValue !== "undefined") setValue("loaderSearch", newInputValue);
						}}
						onOpen={() => {
							setIsloaderSelectOpen(true);
						}}
						onClose={() => {
							setIsloaderSelectOpen(false);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label={watch("usage") === "freighter" ? "بارگیر" : "ظرفیت"}
								placeholder="نوع را وارد کنید"
								slotProps={{
									input: {
										...params.InputProps,
										endAdornment: (
											<>
												{loaders.isLoading || loaders.isFetching ? (
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
				{...register("VIN")}
				label="VIN"
				type="text"
				autoComplete="off"
				placeholder="VIN را وارد کنید"
				error={!!errors.VIN}
				helperText={errors.VIN?.message ?? ""}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				required
			/>
			<Controller
				name="allowed_certificate"
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
							error={!!errors.usage}
							onChange={(event) => field.onChange(event.target.value)}
							sx={{ borderRadius: "8px" }}
							required
						>
							<MenuItem value={1}>پایه یک</MenuItem>
							<MenuItem value={2}>پایه دو</MenuItem>
							<MenuItem value={3}>پایه دو تبصره 99</MenuItem>
						</Select>
						{errors.usage && <FormHelperText>{errors.usage?.message}</FormHelperText>}
					</FormControl>
				)}
			/>
			<TextField
				label="شماره همراه مالک"
				type="tel"
				autoComplete="off"
				placeholder="شماره همراه مالک را وارد کنید"
				error={!!errors.owner_phone_number}
				helperText={errors.owner_phone_number?.message}
				{...register("owner_phone_number")}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/\D/g))
						setError("owner_phone_number", {
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
			<TextField
				{...register("description")}
				className="col-span-full"
				label="توضیحات"
				type="text"
				autoComplete="off"
				placeholder="توضیحات را وارد کنید"
				error={!!errors.description}
				helperText={errors.description?.message ?? ""}
				onChange={(event) => {
					let newValue = event.target.value;

					if (newValue.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g))
						setError("description", {
							message: "توضیحات نمیتواند شامل حروفی غیر از فارسی یا نماد باشد",
							type: "pattern",
						});

					newValue = newValue.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s]/g, "");
					newValue = newValue.slice(0, 255);

					event.target.value = newValue;
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				fullWidth
				multiline
			/>
			<div className="col-span-full flex gap-3 justify-end">
				<Button
					variant="outlined"
					color="secondary"
					onClick={formState === "ADD" ? onCancelAddFleet : onCancelEditFleet}
				>
					انصراف
				</Button>
				<Button
					type="submit"
					variant="contained"
					loading={addFleetResult.isLoading || editFleetResult.isLoading}
				>
					{formState === "ADD" ? "ثبت" : "ویرایش"} ناوگان
				</Button>
			</div>
		</form>
	);
};

export default AdminFleetForm;
