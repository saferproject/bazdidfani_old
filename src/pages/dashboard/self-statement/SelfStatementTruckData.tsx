import { FC, useCallback, useEffect, useState } from "react";

import { useForm, useWatch } from "react-hook-form";
import CustomeDialog, { CustomDialogProps, EmptyCustomDialoProps } from "../../../components/shared/Dialog/CustomeDialog";
import { useNavigate } from "react-router-dom";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { useGetSmartNumberInquiryMutation } from "../../../api/Inquiry";
import SelectCustom from "../../../components/shared/Inputs/CustomeSelect";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import CustomeAutoComplete from "../../../components/shared/Inputs/CustomeAutoComplete";
import PlateTextField from "../../../components/shared/Inputs/PlateTextField";
import FleetList from "../../../components/Fleet/FleetList";
import { useGetLoadingTypesByActivityTypeQuery } from "../../../api/fleet/Fleet";
import NewFleet from "../../../components/Fleet/NewFleet";
import TruckDataForm from "./interfaces/truckDataForm.interface";
import { useAddSelfStatementMutation } from "../../../api/Driver/Driver";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { ArrowSwapHorizontal, CloseCircle, DocumentText, InfoCircle, SearchNormal1, Truck } from "iconsax-reactjs";
import SelfStatementFormProps from "./interfaces/self-statement-form-props.interface";
import { useGetAdminSettingsQuery } from "../admin/api/admin-settings.api";

const SelfStatementTruckData: FC<SelfStatementFormProps> = ({ isOpen, onClose }) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const {
		register,
		watch,
		control,
		setValue,
		getValues,
		reset,
		trigger,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<TruckDataForm>();

	const { smart_number } = useWatch({ control });

	const companyUsage = useAppSelector((state) => state.user.companyUsage);
	const nationalCode = useAppSelector((state) => state.user.personal.national_code);

	const [customDialogProps, setCustomDialogProps] = useState<CustomDialogProps>({
		...EmptyCustomDialoProps,
	});

	const settings = useGetAdminSettingsQuery();
	const loadingTypes = useGetLoadingTypesByActivityTypeQuery({
		activityType: watch("usage"),
		query: watch("loaderTypeSearch"),
	});

	const [smartNumberInquiryFn, smartNumberInquiryResult] = useGetSmartNumberInquiryMutation();
	const [addSelfStatementFn, addSelfStatementResult] = useAddSelfStatementMutation();

	const handleAddOrEditFleet = (data) => {
		const truckData = data[0];

		reset((prevData) => ({
			...prevData,
			...truckData,
			loader: {
				id: truckData.loader_type_id,
				name: truckData.truck_loader_name,
			},
			loader_type: truckData.truck_loader_name,
			type: data.usage === "passenger" ? 2 : 1,
		}));

		setCustomDialogProps({ ...EmptyCustomDialoProps });
	};

	const handleSubmit = useCallback(async () => {
		if (getValues("truck_id")) {
			const newTruckData = getValues();

			const {
				smart_number,
				first_number,
				second_number,
				third_character,
				fourth_number,
				truck_id,
				type: typeCode,
				description,
				validity_technical_examination: insurance_validity,
				loader: { type_code: type, name: loader_type },
			} = newTruckData as any;

			addSelfStatementFn({
				truck_info_id: truck_id,
				smart_number,
				first_number,
				second_number,
				third_character,
				fourth_number,
				insurance_validity,
				type: type ?? typeCode,
				loader_type,
				driver_national_code: nationalCode.toString(),
				self_statement: 1,
				description,
			});
		} else
			SweetAlertToast.fire({
				title: "این ماشین در سیستم ثبت نشده است",
				icon: "warning",
			});
	}, [watch, dispatch, navigate]);

	const handleOnFleetSelect = ({ truck, truck_info }) => {
		reset({
			...truck,
			...truck_info,
			truck_id: truck.id,
			type: truck.usage === "passenger" ? 2 : 1,
			loader: truck.loader,
			smart_number: truck.smart_number,
			VIN: truck.VIN,
			date_made: truck.date_made,
			first_number: truck.first_number,
			fourth_number: truck.fourth_number,
			loader_type_id: truck.loader_type_id,
			plate_type: truck.plate_type,
			second_number: truck.second_number,
			third_character: truck.third_character,
			usage: truck.usage,
			validity_technical_examination: truck.validity_technical_examination,
			loader_type: truck.loader.name,
			insurance_validity: truck_info.insurance_validity,
		});

		setCustomDialogProps({
			...EmptyCustomDialoProps,
		});
	};

	const handleSmartNumberInquiry = async () => {
		const validation = await trigger("smart_number");

		if (validation)
			smartNumberInquiryFn({ owner: "me", smartNumber: watch("smart_number"), companyUsage, usage: "freighter", userType: "driver" });
	};

	const handleShowVehicleList = () => {
		setCustomDialogProps({
			children: (
				<FleetList
					isDialog
					onSelect={handleOnFleetSelect}
					owner="me"
				/>
			),
			hasOnClose: true,
			onClose: () => {
				setCustomDialogProps({ ...EmptyCustomDialoProps });
			},
			show: true,
			maxWidth: "xl",
		});
	};

	useEffect(() => {
		if (smartNumberInquiryResult.isSuccess) {
			const truckData = smartNumberInquiryResult.data.data;

			if (!truckData.is_new)
				reset((prevData) => ({
					...prevData,
					...truckData,
					smart_number: prevData?.smart_number,
					truck_id: truckData.id,
				}));
			else
				setCustomDialogProps({
					children: (
						<NewFleet
							mode="ADD"
							owner="me"
							initialData={{ ...smartNumberInquiryResult.data.data }}
							onSuccess={handleAddOrEditFleet}
							onCancel={() => setCustomDialogProps({ ...EmptyCustomDialoProps })}
							isDialog={true}
						/>
					),
					hasOnClose: false,
					onClose: () => {
						setCustomDialogProps({ ...EmptyCustomDialoProps });
					},
					show: true,
					maxWidth: "xl",
					fullWidth: true,
				});
		} else if (smartNumberInquiryResult.isError) {
			if (smartNumberInquiryResult.error.data.data.truck_inquiry === false) {
				setCustomDialogProps({
					children: (
						<NewFleet
							mode="ADD_WITHOUT_INQUIRY"
							owner="me"
							initialData={{ is_new: true, is_active: true, smart_number: getValues("smart_number") }}
							onSuccess={handleAddOrEditFleet}
							onCancel={() => setCustomDialogProps({ ...EmptyCustomDialoProps })}
							isDialog={true}
						/>
					),
					hasOnClose: false,
					onClose: () => {
						setCustomDialogProps({ ...EmptyCustomDialoProps });
					},
					show: true,
					maxWidth: "xl",
					fullWidth: true,
				});
			} else {
				const error = smartNumberInquiryResult.error as any;
				if (error?.response?.data?.data?.smart_number) {
					setError("smart_number", {
						type: "serverError",
						message: error?.response?.data?.data?.smart_number || "",
					});
				} else {
					clearErrors("smart_number");
				}
			}
		}
	}, [smartNumberInquiryResult.isSuccess, smartNumberInquiryResult.isError]);

	useEffect(() => {
		if (addSelfStatementResult.isSuccess) {
			SweetAlertToast.fire({
				title: addSelfStatementResult.data.message,
				icon: "success",
			});
			onClose();
		}
	}, [addSelfStatementResult.isSuccess]);

	useEffect(() => {
		if (smart_number?.length < 7)
			reset({
				allowed_certificate: null,
				date_made: null,
				first_number: null,
				fourth_number: null,
				insurance_validity: null,
				loader: null,
				loaderTypeSearch: null,
				second_number: null,
				smartcard_status: null,
				truck_id: null,
				type: null,
				usage: null,
				validity_technical_examination: null,
			});
	}, [smart_number]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="md"
			slotProps={{
				paper: {
					sx: {
						borderRadius: "16px",
					},
				},
			}}
			fullWidth
		>
			<div className="p-2 lg:p-x-4">
				<DialogTitle>
					<div className="w-full flex items-center justify-between">
						<div className="flex items-center gap-4">
							<DocumentText
								className="text-primary"
								size="32"
							/>
							<h2 className="font-extrabold text-xl">درخواست جدید خوداظهاری</h2>
						</div>
						<IconButton onClick={onClose}>
							<CloseCircle size="24" className="text-red-500" />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent
					dividers={true}
					className="flex flex-col"
				>
					<div className="flex flex-col gap-4">
						<CustomeDialog {...customDialogProps} />
						<div className="flex items-center gap-2">
							<Truck className="text-primary" />
							<h2 className="font-semibold">مشخصات ماشین</h2>
						</div>
						{settings.data && (
							<div className="flex items-center gap-2">
								<InfoCircle
									size={16}
									className="text-blue-500"
								/>
								<p className="text-gray-500 text-sm">
									{settings.data.find((setting) => setting.key === "default_fee_for_drivers")?.status
										? `هزینه ثبت درخواست خوداظهاری ${
												settings.data.find((setting) => setting.key === "default_fee_for_drivers").value
										  } تومان می باشد`
										: "هزینه ثبت درخواست خوداظهاری رایگان می باشد"}
								</p>
							</div>
						)}
						<div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
							<TextField
								fullWidth
								error={!!errors.smart_number}
								helperText={errors.smart_number?.message.toString() ?? ""}
								{...register("smart_number", {
									required: "هوشمند ماشین الزامی است",
									validate: (data: any) => {
										if (data?.length < 7) return data?.length === 7 || "طول شماره هوشمند ماشین ۷ رقمی است";
									},
								})}
								label=" هوشمند ماشین"
								type="tel"
								slotProps={{
									htmlInput: { maxLength: "7", dir: "ltr" },
									input: {
										endAdornment: (
											<IconButton
												loading={smartNumberInquiryResult.isLoading}
												onClick={handleSmartNumberInquiry}
												className="text-primary"
												title="استعلام"
											>
												<ArrowSwapHorizontal size="24" />
											</IconButton>
										),
										startAdornment: (
											<IconButton
												onClick={handleShowVehicleList}
												className="text-blue-500"
												title="لیست ناوگان شرکت"
											>
												<SearchNormal1 size="24" />
											</IconButton>
										),
									},
									inputLabel: {
										shrink: true,
									},
								}}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.stopPropagation();
										event.preventDefault();
										handleSmartNumberInquiry();
									}
								}}
							/>
							<div>
								<PlateTextField
									control={control}
									watch={watch}
									readOnly
								/>
							</div>
							<div>
								<SelectCustom
									control={control}
									label="کاربری"
									name="usage"
									error={errors}
									fullWidth
									disabled
									items={[
										{ title: "مسافری", value: "passenger" },
										{ title: "باری", value: "freighter" },
									]}
								/>
							</div>
							<div>
								<CustomeAutoComplete
									showField="name"
									name="loader"
									error={!!errors.loader}
									helperText={errors.loader?.message.toString() ?? ""}
									rules={{ required: "فیلد نوع بارگیر الزامی است" }}
									control={control}
									data={loadingTypes.data?.data ?? []}
									loading={loadingTypes.isLoading || loadingTypes.isFetching}
									setValue={setValue}
									searchName="loaderTypeSearch"
									label={watch("type") === 1 ? "بارگیر" : "ظرفیت"}
									disabled
								/>
							</div>
							<TextField
								fullWidth
								error={!!errors.date_made}
								helperText={errors.date_made?.message ?? ""}
								{...register("date_made", {
									required: "سال ساخت الزامی است",
								})}
								label="سال ساخت"
								type="text"
								disabled
								slotProps={{
									htmlInput: { maxLength: "7", readOnly: true, dir: "ltr" },
									input: {
										sx: {
											borderRadius: "8px",
										},
									},
									inputLabel: {
										shrink: true,
									},
								}}
							/>
							<div>
								<DatePickerComponent
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
									name="validity_technical_examination"
									label="اعتبار معاینه فنی"
									control={control}
									readOnly
									disabled
								/>
							</div>
							<div>
								<DatePickerComponent
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "8px",
										},
									}}
									name="insurance_validity"
									label="اعتبار بیمه"
									control={control}
									readOnly
									disabled
								/>
							</div>
							<div>
								<SelectCustom
									control={control}
									label="گواهی نامه مجاز"
									name="allowed_certificate"
									error={errors}
									fullWidth={true}
									disabled
									items={[
										{ title: "پایه یک", value: 1 },
										{ title: "پایه دو", value: 2 },
										{ title: "پایه دو تبصره 99", value: 3 },
									]}
								/>
							</div>
							<TextField
								{...register("description", { maxLength: { value: 500, message: "توضیحات نباید بیشتر از 500 حرف باشد" } })}
								className="col-span-full"
								label="توضیحات"
								error={!!errors.description}
								helperText={errors.description?.message.toString() ?? ""}
								slotProps={{
									inputLabel: { shrink: true },
								}}
							/>
						</div>
					</div>
				</DialogContent>
				<DialogActions className="flex flex-col gap-2 lg:flex-row mt-2 lg:justify-end">
					<Button
						size="large"
						variant="outlined"
						color="secondary"
						className="w-full md:w-auto order-3 md:order-0"
						onClick={onClose}
						disabled={addSelfStatementResult.isLoading}
					>
						انصراف
					</Button>
					<Button
						size="large"
						variant="contained"
						className="w-full md:w-auto order-2 md:order-0"
						loading={addSelfStatementResult.isLoading}
						onClick={handleSubmit}
					>
						ثبت درخواست
					</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export default SelfStatementTruckData;
