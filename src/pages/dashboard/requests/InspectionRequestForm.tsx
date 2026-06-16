import { useGetLoadingTypesQuery } from "../../../api/Categories/Requests";
import { useGetCompanyTechnicalManagersQuery } from "../../../api/Categories/TechnicalManager";
import { useAddNewRequestMutation, useAddSelfStatementByCompanyMutation } from "../../../api/Company/NewRequest";
import { useGetNationalCodeInquiryMutation, useGetSmartNumberInquiryMutation } from "../../../api/Inquiry";
import DriverList from "../../../components/Driver/DriverList";
import NewDriver from "../../../components/Driver/NewDriver";
import FleetList from "../../../components/Fleet/FleetList";
import NewFleet from "../../../components/Fleet/NewFleet";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import CustomeDialog, { CustomDialogProps, EmptyCustomDialoProps } from "../../../components/shared/Dialog/CustomeDialog";
import SaferTextDialogProps from "../../../components/shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";
import SaferTextDialog from "../../../components/shared/dialogs/TextDialog/TextDialog";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import CustomeAutoComplete from "../../../components/shared/Inputs/CustomeAutoComplete";
import SelectCustom from "../../../components/shared/Inputs/CustomeSelect";
import PlateTextField from "../../../components/shared/Inputs/PlateTextField";
import { useAppSelector } from "../../../Stores/hooks";
import CompanyUsage from "../admin/enums/company-usage.enum";
import InspectionRequestFormProps from "./interfaces/inspection-request-form-props.interface";
import InspectionRequestformSchema, { InspectionRequestFormType } from "./schemas/inspection-reqeust-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { ArrowSwapHorizontal, DocumentText1, Edit, InfoCircle, SearchNormal1, TruckFast, UserOctagon, UserSquare } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

























































































































const InspectionRequestForm: FC<InspectionRequestFormProps> = ({ isOpen, data, onClose }) => {
	const companyUsage: CompanyUsage = useAppSelector((state) => state.user.companyUsage);
	const initialType = companyUsage === CompanyUsage.PASSENGER ? 2 : 1;

	//#region Form

	const {
		register,
		reset,
		getValues,
		setValue,
		trigger,
		watch,
		control,
		formState: { errors },
	} = useForm<InspectionRequestFormType>({
		defaultValues: { type: initialType, smart_number: null, driver_national_code: null },
		resolver: zodResolver(InspectionRequestformSchema),
	});

	const { loadingTypeSearch, driver_national_code, smart_number, type } = useWatch({ control });

	//#endregion

	//#region Handlers

	const handleAddOrEditTruckSuccess = (data) => {
		const { company_truck, truck, truck_info } = data;

		reset((prevData) => ({
			...prevData,
			...truck_info,
			...truck,
			truck_id: company_truck?.id,
			loader: truck.loader,
			smart_number: truck.smart_number,
			VIN: truck.VIN,
			date_made: truck.date_made,
			first_number: truck.first_number,
			fourth_number: truck.fourth_number,
			loader_type_id: truck.loader_type_id,
			second_number: truck.second_number,
			third_character: truck.third_character,
			validity_technical_examination: truck.validity_technical_examination,
			loader_type: truck.loader.name,
			insurance_validity: data.truck_info.Insurance_validity,
			type: truck.usage === "passenger" ? 2 : 1,
			is_new: false,
			loadingTypeSearch: truck.loader.name,
		}));

		setCustomDialoProps({ ...EmptyCustomDialoProps });
		setInquiredTruckData(true);
		truckTypesRefetch();
	};

	const handleAddOrEditDriverSuccess = (data) => {
		reset((prevData) => ({
			...prevData,
			driver_full_name: data.full_name,
			driver_father_name: data.father_name,
			driver_phone_number: data.phone_number,
			driver_smart_card_validity: data.smart_card_validity,
			driver_health_card_validity: data.health_card_validity,
			driver_national_code: data.national_code,
			driver_id: data.id,
		}));

		setCustomDialoProps({ ...EmptyCustomDialoProps });
		setInquiredDriverData(true);
	};

	const handleAddDriver = () => {
		const initialData = getValues();

		if (inquiredDriverData)
			setCustomDialoProps({
				children: (
					<div className="mx-5 my-2">
						<NewDriver
							onSuccess={handleAddOrEditDriverSuccess}
							initialData={initialData}
							onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
							formMode={driverFormState}
						/>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialoProps({ ...EmptyCustomDialoProps });
				},
				show: true,
				maxWidth: "xl",
				fullWidth: true,
			});
		else handleNationalCodeInquiry();

		setIsClickedOnEditDriver(true);
		setDriverFormState("EDIT");
	};

	const handleAddFleet = () => {
		const initialData = getValues();

		if (inquiredTruckData)
			setCustomDialoProps({
				children: (
					<div>
						<NewFleet
							onSuccess={handleAddOrEditTruckSuccess}
							mode={truckFormState}
							onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
							initialData={initialData}
							owner="company"
							isDialog={true}
						/>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialoProps({ ...EmptyCustomDialoProps });
				},
				show: true,
				fullWidth: true,
				maxWidth: "md",
			});
		else handleSmartNumberInquiry();

		setIsClickedOnEditFleet(true);
		setTruckFormState("EDIT");
	};

	const handleNationalCodeInquiry = async () => {
		const validation = await trigger("driver_national_code");

		if (validation) {
			driverInquiryFn(driver_national_code);
			setIsClickedOnEditDriver(false);
		}
	};

	const handleSmartNumberInquiry = async () => {
		const validation = await trigger("smart_number");

		if (validation) {
			smartNumberInquiryFn({
				smartNumber: smart_number.toString(),
				owner: "company",
				companyUsage,
				usage: type === 1 ? "freighter" : "passenger",
				userType: "company",
			});
			setIsClickedOnEditFleet(false);
		}
	};

	const handleSubmitInspectionData = async () => {
		const formData = getValues();

		newRequestFn({
			...formData,
			technical_manager_national_code: formData.technicalmanager.national_code,
			technical_manager_id: formData.technicalmanager.technical_manager_id,
		});
	};

	const handleSubmitSelfStatement = async () => {
		const formValues = getValues();

		formValues["self_statement"] = 1;
		formValues["truck_info_id"] = formValues.truck_id;
		formValues["technical_manager_id"] = formValues.technicalmanager.technical_manager_id;
		formValues["technical_manager_national_code"] = formValues.technicalmanager.national_code;
		formValues["loader_type"] ||= formValues.loader_type;

		if (formValues.driver_national_code !== "") addSelfStatementFn(formValues);
		else if (formValues.driver_national_code === "")
			SweetAlertToast.fire({
				text: "کد ملی راننده را وارد کنید",
				icon: "warning",
			});
	};

	const handleSubmitForm = async () => {
		const nationalCode = getValues("driver_national_code");

		if (nationalCode) handleSubmitSelfStatement();
		else handleSubmitInspectionData();
	};

	const handleSelectTruck = (data) => {
		const truckData = data.truck;
		const truckInfoData = data.truck_info;

		reset((prevData) => ({
			...prevData,
			...truckInfoData,
			...truckData,
			type: truckData.usage === "passenger" ? 2 : 1,
			loader: truckData.loader,
			smart_number: truckData.smart_number,
			VIN: truckData.VIN,
			date_made: truckData.date_made,
			first_number: truckData.first_number,
			fourth_number: truckData.fourth_number,
			loader_type_id: truckData.loader_type_id,
			plate_type: truckData.plate_type,
			second_number: truckData.second_number,
			third_character: truckData.third_character,
			validity_technical_examination: truckData.validity_technical_examination,
			loader_type: truckData.loader.name,
			insurance_validity: truckInfoData.insurance_validity,
			is_new: false,
			loadingTypeSearch: truckData.loader.name,
		}));

		setCustomDialoProps({ ...EmptyCustomDialoProps });
		setInquiredTruckData(true);
		setTruckFormState("EDIT");
		truckTypesRefetch();
	};

	const handleChooseFleet = () => {
		setCustomDialoProps({
			children: (
				<div className="max-h-[80vh] min-h-[80vh] overflow-auto">
					<FleetList
						isDialog
						onSelect={handleSelectTruck}
					/>
				</div>
			),
			hasOnClose: true,
			onClose: () => {
				setCustomDialoProps({ ...EmptyCustomDialoProps });
			},
			show: true,
			maxWidth: "xl",
			fullWidth: true,
		});
	};

	const handleChooseDriver = () => {
		setCustomDialoProps({
			children: (
				<div className="max-h-[80vh] min-h-[80vh] overflow-auto">
					<DriverList
						isDialog
						onSuccess={(data) => {
							const driverInfo = data.drivers_info;

							reset((prevData) => ({
								...prevData,
								driver: { ...driverInfo },
								driver_company_id: data.id,
								driver_father_name: driverInfo.father_name,
								driver_full_name: data.full_name,
								driver_health_card_validity: driverInfo.health_card_validity,
								driver_id: driverInfo.id,
								driver_national_code: driverInfo.national_code,
								driver_smart_card_validity: driverInfo.smart_card_validity,
								driver_phone_number: data.phone_number,
								driver_certificate_type: data.certificate_type,
								driver_certificate_validity: driverInfo.certificate_validity,
								driver_status: data.status,
							}));

							setCustomDialoProps({ ...EmptyCustomDialoProps });
							setInquiredDriverData(true);
						}}
					/>
				</div>
			),
			hasOnClose: true,
			onClose: () => {
				setCustomDialoProps({ ...EmptyCustomDialoProps });
			},
			show: true,
			maxWidth: "xl",
			fullWidth: true,
		});
	};

	const handleCloseRecreateDialog = () => {
		setRecreateInspectionRequestDialog((currentValue) => ({ ...currentValue, isOpen: false }));
	};

	const handleRecreateInspectionRequest = () => {
		const formData = getValues();

		newRequestFn({
			...formData,
			technical_manager_national_code: formData.technicalmanager.national_code,
			technical_manager_id: formData.technicalmanager.technical_manager_id,
			// NOTE if this property is true the request will be created even if it is dublicate
			force_create: true,
		});

		setRecreateInspectionRequestDialog((currentValue) => ({
			...currentValue,
			buttons: (
				<>
					<Button
						variant="contained"
						onClick={handleCloseRecreateDialog}
						disabled={true}
					>
						خیر
					</Button>
					<Button
						variant="outlined"
						color="error"
						loading={true}
						onClick={handleRecreateInspectionRequest}
					>
						بله
					</Button>
				</>
			),
		}));
	};

	//#endregion

	//#region Hooks

	const getTechnicalManagers = useGetCompanyTechnicalManagersQuery({
    status: 1,
  });

  useEffect(() => {
    if (getTechnicalManagers.isSuccess) console.info(getTechnicalManagers.data);
  }, [getTechnicalManagers.isSuccess]);

	const {
		data: truckTypes,
		isLoading: truckTypesIsLoading,
		isFetching: truckTypesIsFetching,
		refetch: truckTypesRefetch,
	} = useGetLoadingTypesQuery({ query: loadingTypeSearch, activityType: type });

	const [driverInquiryFn, driverInquiryResult] = useGetNationalCodeInquiryMutation();
	const [smartNumberInquiryFn, smartNumberInquiryResult] = useGetSmartNumberInquiryMutation();
	const [newRequestFn, newRequestResult] = useAddNewRequestMutation();
	const [addSelfStatementFn, addSelfStatementResult] = useAddSelfStatementByCompanyMutation();

	//#region States

	const [customDialoProps, setCustomDialoProps] = useState<CustomDialogProps>({
		...EmptyCustomDialoProps,
	});
	const [inquiredTruckData, setInquiredTruckData] = useState(false);
	const [inquiredDriverData, setInquiredDriverData] = useState(false);
	const [truckFormState, setTruckFormState] = useState<"ADD" | "EDIT">(null);
	const [driverFormState, setDriverFormState] = useState<"ADD" | "EDIT">(null);
	const [isClickedOnEditFleet, setIsClickedOnEditFleet] = useState(false);
	const [isClickedOnEditDriver, setIsClickedOnEditDriver] = useState(false);
	const [recreateInspectionRequestDialog, setRecreateInspectionRequestDialog] = useState<SaferTextDialogProps>({
		isOpen: false,
		title: "خطا در ایجاد درخواست",
		description: "یک درخواست در جریان برای هوشمند وارد شده وجود دارد. آیا می خواهید درخواست قبلی ابطال شود و درخواست جدید ثبت شود؟",
		maxWidth: "sm",
		buttons: (
			<>
				<Button
					variant="contained"
					onClick={handleCloseRecreateDialog}
				>
					خیر
				</Button>
				<Button
					variant="outlined"
					color="error"
					onClick={handleRecreateInspectionRequest}
				>
					بله
				</Button>
			</>
		),
	});

	//#endregion

	//#region Effects

	useEffect(() => {
		if (data) {
			reset({
				driver_full_name: data?.driver?.full_name,
				driver_father_name: data?.driver?.father_name,
				driver_phone_number: data?.driver?.phone,
				driver_smart_card_validity: data?.driver?.smart_card_validity,
				driver_health_card_validity: data?.driver?.health_card_validity,
				driver_national_code: data?.driver?.national_code,
				driver_id: data?.driver?.driver_id,
				driver_insurance_number: data?.driver?.insurance_number,
				driver_description: data?.driver?.description,
				smart_number: Number(data?.truck?.smart_number),
				VIN: data?.truck?.VIN,
				date_made: data?.truck?.date_made,
				first_number: data?.truck?.first_number,
				fourth_number: data?.truck?.fourth_number,
				loader_type_id: data?.truck?.loader_type_id,
				plate_type: data?.truck?.plate_type,
				second_number: data?.truck?.second_number,
				third_character: data?.truck?.third_character,
				validity_technical_examination: data?.truck?.validity_technical_examination,
				loader_type: data?.truck?.loader_type,
				insurance_validity: data?.truck?.Insurance_validity,
				type: data?.type,
				usage: data?.truck?.usage,
				technicalmanager: getTechnicalManagers.data?.data.find((item) => item?.personal?.phone === data?.technical_manager?.phone)
					?.personal,
				loadingTypeSearch: data?.truck?.loader_type,
				loader: { uuid: data?.truck?.loader_type_id, name: data?.truck?.loader_type },
				truck: { ...data?.truck },
			});

			setInquiredTruckData(true);
			setInquiredDriverData(true);
			truckTypesRefetch();
		}
	}, [data]);

	useEffect(() => {
		if (driverInquiryResult.isSuccess) {
			const driverInfo = driverInquiryResult.data.data?.driver_info;
			setInquiredDriverData(true);

			if (driverInfo.is_new) {
				setDriverFormState("ADD");
				reset((prevData) => ({
					...prevData,
					...driverInfo,
					driver_id: driverInfo.id,
					driver_full_name: driverInfo.full_name,
					driver_father_name: driverInfo.father_name,
					driver_national_code: driverInfo.national_code,
					driver_phone_number: driverInfo.phone_number,
					driver_health_card_validity: driverInfo.health_card_validity,
					driver_smart_card_validity: driverInfo.smart_card_validity,
					driver_insurance_number: driverInfo.insurance_number,
					driver_description: "",
				}));
			} else {
				reset((prevData) => ({
					...prevData,
					...driverInfo,
					driver_father_name: driverInfo.father_name,
					driver_full_name: driverInfo.full_name,
					driver_health_card_validity: driverInfo.health_card_validity,
					driver_id: driverInfo.id,
					driver_national_code: driverInfo.national_code,
					driver_smart_card_validity: driverInfo.smart_card_validity,
					driver_phone_number: driverInfo.phone_number,
					driver_certificate_type: driverInfo.certificate_type,
					driver_insurance_number: driverInfo.insurance_number,
					driver_description: driverInfo.description,
				}));

				if (isClickedOnEditDriver) {
					setCustomDialoProps({
						children: (
							<div className="mx-5 my-2">
								<NewDriver
									onSuccess={handleAddOrEditDriverSuccess}
									initialData={{ ...getValues(), ...driverInfo }}
									onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
									formMode={driverFormState}
								/>
							</div>
						),
						hasOnClose: true,
						onClose: () => {
							setCustomDialoProps({ ...EmptyCustomDialoProps });
						},
						show: true,
						fullWidth: true,
						maxWidth: "xl",
					});
				}
			}
		}
	}, [driverInquiryResult.isSuccess]);

	useEffect(() => {
		// NOTE وقتی سازمان استعلامش برای راننده کار نمی دهد شروط پایین برقرار است و بدون استعلام کاربر می تواند راننده ثبت کند
		if (driverInquiryResult.isError && driverInquiryResult.error?.data?.data?.driver_inquiry === false)
			setCustomDialoProps({
				children: (
					<div className="mx-5 my-2">
						<NewDriver
							onSuccess={handleAddOrEditDriverSuccess}
							initialData={{ ...getValues(), is_new: true, is_active: true }}
							onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
							formMode="ADD_WITHOUT_INQUIRY"
						/>
					</div>
				),
				hasOnClose: true,
				onClose: () => setCustomDialoProps({ ...EmptyCustomDialoProps }),
				show: true,
				maxWidth: "xl",
				fullWidth: true,
			});
	}, [driverInquiryResult.isError]);

	useEffect(() => {
		if (smartNumberInquiryResult.isSuccess) {
			const inNew = smartNumberInquiryResult.data.data.is_new;
			const truckData = smartNumberInquiryResult.data.data;
			setInquiredTruckData(true);

			if (inNew) {
				setTruckFormState("ADD");
				reset((prevValue) => ({
					...prevValue,
					...truckData,
					loader: truckData.loader,
					smart_number: truckData.smart_number,
					VIN: truckData.VIN,
					date_made: truckData.date_made,
					first_number: truckData.first_number,
					fourth_number: truckData.fourth_number,
					loader_type: truckData.loader.name,
					loader_type_id: truckData.loader.id,
					plate_type: truckData.plate_type,
					second_number: truckData.second_number,
					third_character: truckData.third_character,
					type: truckData.usage === "freighter" ? 1 : 2,
					validity_technical_examination: truckData.validity_technical_examination,
					insurance_validity: truckData.Insurance_validity,
					allowed_certificate: truckData.allowed_certificate,
				}));
			} else {
				reset((prevData) => ({
					...prevData,
					...truckData,
					loader: truckData.loader,
					smart_number: truckData.smart_number,
					VIN: truckData.VIN,
					date_made: truckData.date_made,
					first_number: truckData.first_number,
					fourth_number: truckData.fourth_number,
					loader_type: truckData.loader.name,
					loader_type_id: truckData.loader.id,
					plate_type: truckData.plate_type,
					second_number: truckData.second_number,
					third_character: truckData.third_character,
					type: truckData.usage === "freighter" ? 1 : 2,
					validity_technical_examination: truckData.validity_technical_examination,
					insurance_validity: truckData.Insurance_validity,
					allowed_certificate: truckData.allowed_certificate,
				}));

				if (isClickedOnEditFleet) {
					setCustomDialoProps({
						children: (
							<div>
								<NewFleet
									onSuccess={handleAddOrEditTruckSuccess}
									mode={truckFormState}
									onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
									initialData={getValues()}
									owner="company"
									isDialog={true}
								/>
							</div>
						),
						hasOnClose: true,
						onClose: () => {
							setCustomDialoProps({ ...EmptyCustomDialoProps });
						},
						show: true,
						fullWidth: true,
						maxWidth: "md",
					});
				}
			}
		}
	}, [smartNumberInquiryResult.isSuccess]);

	useEffect(() => {
		if (smartNumberInquiryResult.isError && smartNumberInquiryResult.error?.data?.data?.truck_inquiry === false)
			setCustomDialoProps({
				children: (
					<div>
						<NewFleet
							onSuccess={handleAddOrEditTruckSuccess}
							mode="ADD_WITHOUT_INQUIRY"
							onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
							initialData={{ is_new: true, is_active: true, smart_number: getValues("smart_number") }}
							owner="company"
							isDialog={true}
						/>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialoProps({ ...EmptyCustomDialoProps });
				},
				show: true,
				fullWidth: true,
				maxWidth: "md",
			});
	}, [smartNumberInquiryResult.isError]);

	useEffect(() => {
		if (newRequestResult.isSuccess) {
			SweetAlertToast.fire({
				title: newRequestResult.data.message,
				icon: "success",
			});
			onClose();
		} else if (newRequestResult.isError && newRequestResult.error.status === 409)
			setRecreateInspectionRequestDialog((currentValue) => ({
				...currentValue,
				isOpen: true,
				description: `یک درخواست در جریان برای هوشمند ${getValues(
					"smart_number"
				)} وارد شده وجود دارد. آیا می خواهید درخواست قبلی ابطال شود و درخواست جدید ثبت شود؟`,
			}));
	}, [newRequestResult]);

	useEffect(() => {
		if (addSelfStatementResult.isSuccess) {
			SweetAlertToast.fire({
				text: addSelfStatementResult.data?.message,
				icon: "success",
			});
			onClose();
		}
	}, [addSelfStatementResult.isSuccess]);

	useEffect(() => {
		if (driverFormState === "ADD") handleAddDriver();
	}, [driverFormState]);

	useEffect(() => {
		if (truckFormState === "ADD") handleAddFleet();
	}, [truckFormState]);

	//#endregion

	//#endregion

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
			slotProps={{
				paper: {
					sx: {
						borderRadius: "16px",
					},
				},
			}}
		>
			<div className="p-2 lg:p-x-4">
				<DialogTitle>
					<div className="w-full flex items-center justify-between">
						<div className="flex items-center gap-4">
							<DocumentText1
								className="text-primary"
								size="32"
							/>
							<h2 className="font-extrabold text-xl">درخواست جدید بازدید فنی</h2>
						</div>
					</div>
				</DialogTitle>
				<DialogContent
					dividers={true}
					className="flex flex-col"
				>
					<CustomeDialog {...customDialoProps} />
					{recreateInspectionRequestDialog.isOpen && <SaferTextDialog {...recreateInspectionRequestDialog} />}
					<div className="w-full mx-auto flex flex-col gap-12">
						<div className="flex flex-col gap-4">
							<div className="flex gap-2 items-center">
								<TruckFast className="text-primary" />
								<h2 className="font-extrabold">هوشمند ناوگان</h2>
							</div>
							<div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
								{companyUsage === 3 && (
									<SelectCustom
										control={control}
										label="کاربری"
										name="type"
										error={errors}
										fullWidth
										items={[
											{ title: "باری", value: 1 },
											{ title: "مسافری", value: 2 },
										]}
									/>
								)}
								<TextField
									fullWidth
									error={!!errors.smart_number}
									helperText={errors.smart_number?.message.toString() ?? ""}
									{...register("smart_number", {
										required: "هوشمند ماشین الزامی است",
										valueAsNumber: true,
										validate: (data: any) => {
											if (data?.length < 7) return data?.length === 7 || "طول شماره هوشمند ماشین ۷ رقمی است";
										},
										onChange: (event) => {
											reset((prevData) => ({
												...prevData,
												loader: null,
												smart_number:
													Number(event.target.value) === 0 || event.target.value.match(/\D/) ? null : Number(event.target.value),
												VIN: "",
												date_made: null,
												first_number: null,
												fourth_number: null,
												loader_type_id: null,
												plate_type: 0,
												second_number: null,
												third_character: "ع",
												type: initialType,
												validity_technical_examination: null,
												loader_type: "",
												insurance_validity: null,
											}));

											setInquiredTruckData(false);
										},
									})}
									label="هوشمند ماشین"
									type="text"
									slotProps={{
										htmlInput: { maxLength: "7", dir: "ltr" },
										input: {
											sx: {
												borderRadius: "8px",
											},
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
												<div className="flex items-end gap-2">
													<IconButton
														onClick={handleAddFleet}
														className="text-yellow-500"
														title="افزودن / ویرایش ناوگان"
													>
														<Edit size="24" />
													</IconButton>
													<IconButton
														onClick={handleChooseFleet}
														className="text-blue-500"
														title="لیست ناوگان شرکت"
													>
														<SearchNormal1 size="24" />
													</IconButton>
												</div>
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
								<div className="w-full h-10">
									<PlateTextField
										control={control}
										watch={watch}
										readOnly
									/>
								</div>
								{companyUsage !== null && companyUsage !== 3 && (
									<SelectCustom
										readOnly
										control={control}
										label="کاربری"
										name="type"
										error={errors}
										disabled
										fullWidth
										items={[
											{ title: "باری", value: 1 },
											{ title: "مسافری", value: 2 },
										]}
									/>
								)}
								<div>
									<CustomeAutoComplete
										showField="name"
										control={control}
										data={truckTypes?.data ?? []}
										loading={truckTypesIsLoading || truckTypesIsFetching}
										setValue={setValue}
										searchName="loadingTypeSearch"
										label="نوع بارگیر"
										name="loader"
										readOnly
										disabled
									/>
								</div>
								<TextField
									fullWidth
									error={!!errors.date_made}
									helperText={errors.date_made?.message.toString() ?? ""}
									{...register("date_made", {
										required: "سال ساخت الزامی است",
									})}
									label="سال ساخت"
									type="text"
									disabled
									slotProps={{
										htmlInput: { maxLength: "7", readOnly: true },
										inputLabel: {
											shrink: true,
										},
									}}
								/>
								<DatePickerComponent
									name="validity_technical_examination"
									label="معاینه فنی"
									control={control}
									readOnly
									disabled
								/>
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<UserSquare className="text-primary" />
								<h2 className="font-extrabold">اطلاعات راننده</h2>
							</div>
							<div className="flex items-center gap-2 mb-4">
								<InfoCircle
									size="20"
									className="text-blue-500"
								/>
								<p className="text-sm text-gray-600">جهت استعلام خوداظهاری اطلاعات راننده الزامی است</p>
							</div>
							<div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
								<TextField
									slotProps={{
										htmlInput: { maxLength: "10", dir: "ltr" },
										input: {
											sx: {
												borderRadius: "8px",
											},
											endAdornment: (
												<IconButton
													loading={driverInquiryResult.isLoading}
													onClick={handleNationalCodeInquiry}
													className="text-primary"
													title="استعلام"
												>
													<ArrowSwapHorizontal size="24" />
												</IconButton>
											),
											startAdornment: (
												<div className="flex gap-2 items-end">
													<IconButton
														className="text-yellow-500"
														onClick={handleAddDriver}
														title="افزودن / ویرایش راننده"
													>
														<Edit size="24" />
													</IconButton>
													<IconButton
														className="text-blue-500"
														onClick={handleChooseDriver}
														title="لیست رانندگان شرکت"
													>
														<SearchNormal1 size="24" />
													</IconButton>
												</div>
											),
										},
										inputLabel: {
											shrink: true,
										},
									}}
									error={!!errors.driver_national_code}
									helperText={errors.driver_national_code?.message.toString() ?? ""}
									{...register("driver_national_code", {
										onChange: (event) => {
											reset((prevData) => ({
												...prevData,
												driver_father_name: "",
												driver_full_name: "",
												driver_health_card_validity: null,
												driver_id: null,
												driver_national_code: event.target.value,
												driver_smart_card_validity: null,
												driver_phone_number: "",
											}));
										},
									})}
									label="کد ملی"
									type="text"
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											event.stopPropagation();
											event.preventDefault();
											handleNationalCodeInquiry();
										}
									}}
								/>
								<TextField
									disabled
									id="outlined-required"
									fullWidth
									label="نام و نام خانوادگی"
									type="text"
									slotProps={{
										htmlInput: {
											readOnly: true,
										},
										inputLabel: {
											shrink: !!watch("driver_full_name"),
										},
									}}
									{...register("driver_full_name", {
										// required: "فیلد نام کامل راننده الزامی است",
									})}
								/>
								<TextField
									disabled
									id="outlined-required"
									fullWidth
									label="نام پدر"
									type="text"
									slotProps={{
										htmlInput: {
											readOnly: true,
										},
										input: {
											sx: {
												borderRadius: "8px",
											},
										},
										inputLabel: {
											shrink: !!watch("driver_father_name"),
										},
									}}
									{...register("driver_father_name", {
										// required: "فیلد نام کامل راننده الزامی است",
									})}
									sx={{
										borderColor: "#f4f2f2",
									}}
								/>
								<TextField
									disabled
									id="outlined-required"
									fullWidth
									label="شماره تماس"
									type="text"
									{...register("driver_phone_number", {
										// required: "فیلد شماره تماس الزامی است",
									})}
									sx={{
										borderColor: "#f4f2f2",
									}}
									slotProps={{
										htmlInput: { readOnly: true },
										input: {
											sx: {
												borderRadius: "8px",
											},
										},
										inputLabel: {
											shrink: !!watch("driver_phone_number"),
										},
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<UserOctagon className="text-primary" />
								<h2 className="font-extrabold">مدیر فنی</h2>
							</div>
							<div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
								<Controller
									name="technical_manager_id"
									control={control}
									rules={{ required: "مدیر فنی الزامی است" }}
									render={({ field }) => (
										<Autocomplete
											{...field}
											options={getTechnicalManagers.data?.data.map((ele) => ele.personal) ?? []}
											getOptionKey={(option) => option.id}
											getOptionLabel={(option) => option.full_name}
											loading={getTechnicalManagers.isLoading || getTechnicalManagers.isFetching}
											loadingText="در حال دریافت مدیران فنی"
											className="col-span-2 md:col-span-1"
											onChange={(_event, newValue: unknown) => {
												setValue("technical_manager_id", newValue.id);
												setValue("technical_manager_national_code", newValue.national_code);
												setValue("technicalmanager", newValue);
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													label="مدیر فنی"
													InputProps={{
														...params.InputProps,
														endAdornment: (
															<>
																{getTechnicalManagers.isLoading || getTechnicalManagers.isFetching ? (
																	<CircularProgress
																		color="inherit"
																		size={20}
																	/>
																) : null}
																{params.InputProps.endAdornment}
															</>
														),
													}}
													required
													fullWidth
												/>
											)}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				</DialogContent>
				<DialogActions className="flex flex-col items-center justify-end gap-2 mt-2 lg:flex-row">
					<Button
						size="large"
						className="w-full md:w-auto order-3 md:order-0"
						variant="outlined"
						color="secondary"
						onClick={onClose}
					>
						انصراف
					</Button>
					<Button
						size="large"
						variant="contained"
						color="primary"
						className="w-full md:w-auto order-2 md:order-0"
						loading={addSelfStatementResult.isLoading || newRequestResult.isLoading}
						onClick={handleSubmitForm}
					>
						ثبت درخواست
					</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export default InspectionRequestForm;
