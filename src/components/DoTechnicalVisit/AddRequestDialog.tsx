import { useGetLoadingTypesQuery } from "../../api/Categories/Requests";
import { useGetTechnicalManagerSmartNumberInquiryMutation } from "../../api/Inquiry";
import {
  useAddTechnicalInspectionMutation,
  useGetTechnicalManagerCompaniesQuery,
  useGetVisitChecklistMutation,
} from "../../api/TechnicalManager/TechnicalVisit";
import { InspectionModel } from "../../database/models/inspection.model";
import CompanyUsage from "../../pages/dashboard/admin/enums/company-usage.enum";
import { useAppDispatch, useAppSelector } from "../../Stores/hooks";
import { setInspectionData } from "../../Stores/slices/inspection-data.slice";
import { setInspectionType } from "../../Stores/slices/inspection-type.slice";
import useIsInIran from "../../utilities/custom-hooks/use-is-in-iran";
import FleetList from "../Fleet/FleetList";
import NewFleet from "../Fleet/NewFleet";
import DatePickerComponent from "../shared/DatePicker/DatePickerComponent";
import CustomeDialog, {
  CustomDialogProps,
  EmptyCustomDialoProps,
} from "../shared/Dialog/CustomeDialog";
import SaferTextDialogProps from "../shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";
import SaferTextDialog from "../shared/dialogs/TextDialog/TextDialog";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import CustomeAutoComplete from "../shared/Inputs/CustomeAutoComplete";
import SelectCustom from "../shared/Inputs/CustomeSelect";
import PlateTextField from "../shared/Inputs/PlateTextField";
import TechnicalInspectionFormSchema, {
  TechnicalInspectionFormType,
} from "./technical-inspection-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { ArrowSwapHorizontal, DocumentText1, TruckFast } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function AddRequest({ isOpen, onClose }) {
  const { currentLocation, isInIran, error, isLoading } = useIsInIran();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
  } = useForm<TechnicalInspectionFormType>({
    defaultValues: { type: 1, smart_number: null },
    resolver: zodResolver(TechnicalInspectionFormSchema),
  });

  const {
    loadingTypeSearch,
    smart_number,
    type,
    first_number,
    second_number,
    third_character,
    fourth_number,
  } = useWatch({ control });

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
      // type: truck.usage === "passenger" ? 2 : 1,
      type: 2,
      is_new: false,
      loadingTypeSearch: truck.loader.name,
    }));

    setCustomDialoProps({ ...EmptyCustomDialoProps });
    setInquiredTruckData(true);
    truckTypesRefetch();
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
              owner="technical-manager"
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

  const handleSmartNumberInquiry = async () => {
    const validation = await trigger("smart_number");

    if (validation) {
      smartNumberInquiryFn({
        smartNumber: smart_number.toString(),
        companyUsage,
        usage: type === 1 ? "freighter" : "passenger",
      });
      setIsClickedOnEditFleet(false);
    }
  };

  const handleSubmitInspectionData = async () => {
    const formData = getValues();

    if (
      !formData.first_number ||
      !formData.second_number ||
      !formData.third_character ||
      !formData.fourth_number
    ) {
      SweetAlertToast.fire({
        icon: "error",
        text: "لطفا شماره پلاک را کامل وارد کنید",
      });
      return;
    }

    if (!formData.company_id) {
      SweetAlertToast.fire({
        icon: "error",
        text: "لطفا شرکت حمل و نقل را انتخاب کنید",
      });
      return;
    }

    newRequestFn({
      first_number: formData.first_number,
      second_number: formData.second_number,
      third_character: formData.third_character,
      fourth_number: formData.fourth_number,
      company_id: formData.company_id,
      type: String(formData.type),
    });
  };

  const handleSelectTruck = (data) => {
    const truckData = data.truck;
    const truckInfoData = data.truck_info;

    reset((prevData) => ({
      ...prevData,
      ...truckInfoData,
      ...truckData,
      // type: truckData.usage === "passenger" ? 2 : 1,
      type: 2,
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
          <FleetList isDialog onSelect={handleSelectTruck} />
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

  const handleClose = () => {
    reset({ type: 2, smart_number: null });
    setInquiredTruckData(false);
    setTruckFormState(null);
    onClose();
  };

  // HINT: added for default passenger registering on plaque entering
  useEffect(() => {
    reset({ type: 2, smart_number: null });
  }, []);

  const handleCloseRecreateDialog = () => {
    setRecreateInspectionRequestDialog((currentValue) => ({
      ...currentValue,
      isOpen: false,
    }));
  };

  const handleRecreateInspectionRequest = () => {
    const formData = getValues();

    newRequestFn({
      first_number: formData.first_number,
      second_number: formData.second_number,
      third_character: formData.third_character,
      fourth_number: formData.fourth_number,
      company_id: formData.company_id,
      type: 2 /*String(formData.type)*/,
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

  const companyUsage: CompanyUsage = useAppSelector(
    (state) => state.user.companyUsage,
  );

  const {
    data: truckTypes,
    isLoading: truckTypesIsLoading,
    isFetching: truckTypesIsFetching,
    refetch: truckTypesRefetch,
  } = useGetLoadingTypesQuery({ query: loadingTypeSearch, activityType: type });

  const [smartNumberInquiryFn, smartNumberInquiryResult] =
    useGetTechnicalManagerSmartNumberInquiryMutation();
  const [newRequestFn, newRequestResult] = useAddTechnicalInspectionMutation();
  const [getVisitChecklistFn, getVisitChecklistResult] =
    useGetVisitChecklistMutation();
  const getCompanies = useGetTechnicalManagerCompaniesQuery({});

  //#region States

  const [customDialoProps, setCustomDialoProps] = useState<CustomDialogProps>({
    ...EmptyCustomDialoProps,
  });
  const [inquiredTruckData, setInquiredTruckData] = useState(false);
  const [truckFormState, setTruckFormState] = useState<"ADD" | "EDIT">(null);
  const [isClickedOnEditFleet, setIsClickedOnEditFleet] = useState(false);
  const [recreateInspectionRequestDialog, setRecreateInspectionRequestDialog] =
    useState<SaferTextDialogProps>({
      isOpen: false,
      title: "خطا در ایجاد درخواست",
      description:
        "یک درخواست در جریان برای پلاک وارد شده وجود دارد. آیا می خواهید درخواست قبلی ابطال شود و درخواست جدید ثبت شود؟",
      maxWidth: "sm",
      buttons: (
        <>
          <Button variant="contained" onClick={handleCloseRecreateDialog}>
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
          type: 2 /* truckData.usage === "freighter" ? 1 : 2*/,
          validity_technical_examination:
            truckData.validity_technical_examination,
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
          // type: truckData.usage === "freighter" ? 1 : 2,
          type: 2,
          validity_technical_examination:
            truckData.validity_technical_examination,
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
                  onCancel={() =>
                    setCustomDialoProps({ ...EmptyCustomDialoProps })
                  }
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
    const companies = getCompanies.data?.data ?? [];

    // Auto-select when there is only one company; otherwise leave it for the user to choose.
    if (companies.length === 1) {
      setValue("company", companies[0]);
      setValue("company_id", companies[0].company.id);
    }
  }, [getCompanies.data, setValue]);

  useEffect(() => {
    if (!smartNumberInquiryResult.isError) return;

    setCustomDialoProps({
      children: (
        <div>
          <NewFleet
            onSuccess={handleAddOrEditTruckSuccess}
            mode="ADD_WITHOUT_INQUIRY"
            onCancel={() => setCustomDialoProps({ ...EmptyCustomDialoProps })}
            initialData={{
              is_new: true,
              is_active: true,
              smart_number: getValues("smart_number"),
              company_id: getValues("company_id"),
            }}
            owner="technical-manager"
            isDialog={true}
            companyUsage={getValues("company").company.company_usage}
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
      handleCloseRecreateDialog();
      const bazdidfaniId = newRequestResult.data.data.bazdidfani.id;
      getVisitChecklistFn({
        bazdidfani_id: bazdidfaniId,
        latitude: currentLocation?.latitude ?? 0,
        longitude: currentLocation?.longitude ?? 0,
        description: "",
      });
    } else if (
      newRequestResult.isError &&
      newRequestResult.error.status === 409
    )
      setRecreateInspectionRequestDialog((currentValue) => ({
        ...currentValue,
        isOpen: true,
        description: `یک درخواست در جریان برای پلاک وارد شده وجود دارد. آیا می خواهید درخواست قبلی ابطال شود و درخواست جدید ثبت شود؟`,
      }));
  }, [newRequestResult]);

  useEffect(() => {
    if (!getVisitChecklistResult.isSuccess) return;

    (async () => {
      const bazdidfaniId = newRequestResult.data?.data.bazdidfani.id;
      const inspectionItems = getVisitChecklistResult.data?.data ?? [];
      const formData = getValues();

      await InspectionModel.insertInspection({
        inspectionId: bazdidfaniId,
        inspectorId: 0,
        trailerCode: formData.loader?.loader_code ?? 0,
        isSelfStatement: false,
        driverNationalCode: null,
        dateStarted: new Date(),
        items: inspectionItems,
      });

      dispatch(setInspectionType("DIRECT_TECHNICAL_VISIT"));
      dispatch(
        setInspectionData({
          id: bazdidfaniId,
          code: newRequestResult.data?.data.bazdidfani.code ?? "",
          type: formData.type,
          status: 2,
          created_at: new Date().toISOString(),
          company_name: "",
          driver_phone: null,
          driver_name: null,
          driver_national_code: null,
          plate_first_number: Number(formData.first_number) || 0,
          plate_second_number: Number(formData.second_number) || 0,
          plate_character: formData.third_character ?? "",
          plate_fourth_number: Number(formData.fourth_number) || 0,
          self_statement: 0,
          TechnicalInspection: 0,
          sabaf_code: "",
          truck_info: {
            title: null,
            insurance_validity: "",
            loader_code: formData.loader?.loader_code ?? 0,
            loader_name: formData.loader?.name ?? "",
            smart_number: formData.smart_number ?? 0,
          },
          technical_manager: {
            id: 0,
            national_code: "",
          },
        }),
      );

      SweetAlertToast.fire({
        title: newRequestResult.data?.message,
        icon: "success",
      });

      navigate(
        formData.type === 1
          ? "/dashboard/do-technical-visit-freighter"
          : "/dashboard/do-technical-visit-passenger",
      );

      handleClose();
    })();
  }, [getVisitChecklistResult.isSuccess]);

  useEffect(() => {
    if (truckFormState === "ADD") handleAddFleet();
  }, [truckFormState]);

  useEffect(() => {
    if (first_number && second_number && third_character && fourth_number) {
    }
  }, [first_number, second_number, third_character, fourth_number]);

  //#endregion

  //#endregion

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
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
              <DocumentText1 className="text-primary" size="32" />
              <h2 className="font-extrabold text-xl">
                درخواست جدید بازدید فنی
              </h2>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} className="flex flex-col">
          <CustomeDialog {...customDialoProps} />
          {recreateInspectionRequestDialog.isOpen && (
            <SaferTextDialog {...recreateInspectionRequestDialog} />
          )}
          <div className="w-full mx-auto flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold">شرکت حمل و نقل</h2>
              </div>
              <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
                <Controller
                  name="company"
                  control={control}
                  rules={{ required: "شرکت حمل و نقل الزامی است" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={getCompanies.data?.data ?? []}
                      getOptionKey={(option) => option.company.id}
                      getOptionLabel={(option) => option.company.name}
                      loading={
                        getCompanies.isLoading || getCompanies.isFetching
                      }
                      loadingText="در حال دریافت لیست شرکت ها"
                      className="col-span-2 md:col-span-1"
                      onChange={(_event, newValue: unknown) => {
                        setValue("company_id", newValue.company.id);
                        setValue("company", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="شرکت حمل و نقل"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {getCompanies.isLoading ||
                                  getCompanies.isFetching ? (
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
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </div>
            </div>
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
                <div
                  className="w-full h-10 flex items-center gap-2 flex-nowrap"
                  onClick={() => {
                    if (!watch("company_id"))
                      SweetAlertToast.fire({
                        icon: "warning",
                        text: "لطفا ابتدا شرکت حمل و نقل را انتخاب کنید",
                      });
                  }}
                >
                  <PlateTextField
                    disabled={!watch("company_id")}
                    control={control}
                    watch={watch}
                  />
                  <IconButton
                    loading={smartNumberInquiryResult.isLoading}
                    onClick={handleSubmitInspectionData}
                    className="text-primary"
                    title="استعلام"
                  >
                    <ArrowSwapHorizontal size="24" />
                  </IconButton>
                </div>
                <div
                  className="flex items-center flex-nowrap gap-x-2"
                  onClick={() => {
                    if (!watch("company_id"))
                      SweetAlertToast.fire({
                        icon: "warning",
                        text: "لطفا ابتدا شرکت حمل و نقل را انتخاب کنید",
                      });
                  }}
                >
                  <TextField
                    fullWidth
                    inputMode="numeric"
                    error={!!errors.smart_number}
                    helperText={errors.smart_number?.message.toString() ?? ""}
                    disabled={!watch("company_id")}
                    {...register("smart_number", {
                      required: "هوشمند ماشین الزامی است",
                      valueAsNumber: true,
                      validate: (data: any) => {
                        if (data?.length < 7)
                          return (
                            data?.length === 7 ||
                            "طول شماره هوشمند ماشین ۷ رقمی است"
                          );
                      },
                      onChange: (event) => {
                        reset((prevData) => ({
                          ...prevData,
                          loader: null,
                          smart_number:
                            Number(event.target.value) === 0 ||
                            event.target.value.match(/\D/)
                              ? null
                              : Number(event.target.value),
                          VIN: "",
                          date_made: null,
                          first_number: null,
                          fourth_number: null,
                          loader_type_id: null,
                          plate_type: 0,
                          second_number: null,
                          third_character: "ع",
                          type: 2,
                            // companyUsage === 1 ? 1 : companyUsage === 2 ? 2 : 1,
                          validity_technical_examination: null,
                          loader_type: "",
                          insurance_validity: null,
                        }));

                        setInquiredTruckData(false);
                      },
                    })}
                    label="هوشمند ماشین"
                    type="tel"
                    slotProps={{
                      htmlInput: { maxLength: "7", dir: "ltr" },
                      input: {
                        sx: {
                          borderRadius: "8px",
                        },
                        inputMode: "numeric",
                        // endAdornment: (
                        //   <IconButton
                        //     loading={smartNumberInquiryResult.isLoading}
                        //     onClick={handleSmartNumberInquiry}
                        //     className="text-primary"
                        //     title="استعلام"
                        //   >
                        //     <ArrowSwapHorizontal size="24" />
                        //   </IconButton>
                        // ),
                        // startAdornment: (
                        //   <div className="flex items-end gap-2">
                        //     <IconButton
                        //       onClick={handleAddFleet}
                        //       className="text-yellow-500"
                        //       title="افزودن / ویرایش ناوگان"
                        //     >
                        //       <Edit size="24" />
                        //     </IconButton>
                        //     <IconButton
                        //       onClick={handleChooseFleet}
                        //       className="text-blue-500"
                        //       title="لیست ناوگان شرکت"
                        //     >
                        //       <SearchNormal1 size="24" />
                        //     </IconButton>
                        //   </div>
                        // ),
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
                  <IconButton
                    loading={smartNumberInquiryResult.isLoading}
                    onClick={handleSmartNumberInquiry}
                    className="text-primary"
                    title="استعلام"
                  >
                    <ArrowSwapHorizontal size="24" />
                  </IconButton>
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
          </div>
        </DialogContent>
        <DialogActions className="flex flex-col items-center justify-end gap-2 mt-2 lg:flex-row">
          <Button
            size="large"
            className="w-full md:w-auto order-3 md:order-0"
            variant="outlined"
            color="secondary"
            onClick={handleClose}
          >
            انصراف
          </Button>
          <Button
            size="large"
            variant="contained"
            color="primary"
            className="w-full md:w-auto order-2 md:order-0"
            loading={
              newRequestResult.isLoading || getVisitChecklistResult.isLoading
            }
            onClick={handleSubmitInspectionData}
          >
            ثبت درخواست
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
