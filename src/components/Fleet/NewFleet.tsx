import {
  useAddEditDriverOrComaonyFleetMutation,
  useGetCompanyFleetByIdQuery,
  useGetDriverFleetByIdQuery,
  useGetLoadingTypesByActivityTypeQuery,
} from "../../api/fleet/Fleet";
import {
  useGetSmartNumberInquiryMutation,
  useGetTechnicalManagerSmartNumberInquiryMutation,
} from "../../api/Inquiry";
import CheckSuccess from "../../assets/images/CheckSuccess.png";
import { useAppSelector } from "../../Stores/hooks";
import DatePickerComponent from "../shared/DatePicker/DatePickerComponent";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import CustomeAutoComplete from "../shared/Inputs/CustomeAutoComplete";
import SelectCustom from "../shared/Inputs/CustomeSelect";
import PlateTextField from "../shared/Inputs/PlateTextField";
import SkeletonCondition from "../shared/SkeletonCondition";
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { ArrowSwapHorizontal, CloseSquare } from "iconsax-reactjs";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface NewFleetProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  owner: "me" | "company" | "technical-manager";
  mode: "ADD" | "ADD_WITHOUT_INQUIRY" | "EDIT";
  id?: number;
  initialData?: any;
  isDialog?: boolean;
  companyUsage?: 1 | 2 | 3;
}

interface formInterface {
  id: number | null;
  smart_number: string;
  first_number: string;
  second_number: string;
  third_character: string;
  fourth_number: string;
  capacity: number | null;
  plate_type: 1 | 0;
  usage: "freighter" | "passenger";
  loader_type: string | null;
  loader_type_id: string | null;
  numbering_place: "ایران";
  system: any;
  system_id: number | null;
  tip_id: number | null;
  tip: any;
  date_made: number;
  validity_technical_examination: string;
  status: 0 | 1;
  type_ownership: 0 | 1 | 2 | 3;
  Chassis_number: string;
  document_number: string;
  document_date: Date | null;
  Insurance_validity: Date | null;
  Insurance_number: string;
  certificate_required: 0 | 1 | 2 | 3;
  owner_phone_number: string;
  description: string;
  smart_card_validity: Date | null;
  loader: any;
  systemsSearch: string | null;
  loadingTypeSearch: string | null;
  tipsSearch: string | null;
  allowed_certificate: 1 | 2 | 3;
  image: FileList | null;
  truck_id;
  is_new: boolean | null;
  restore: boolean;
}

const EmptyFormData: formInterface = {
  id: 0,
  truck_id: 0,
  smart_number: "",
  first_number: "",
  second_number: "",
  third_character: "ع",
  fourth_number: "",
  capacity: null,
  plate_type: 0, //0 , 1
  usage: "freighter", // 0>passenger or 1>freighter
  loader_type: null,
  loader_type_id: null,
  numbering_place: "ایران",
  system: null,
  system_id: null,
  tip_id: null,
  tip: null,
  date_made: null,
  validity_technical_examination: "",
  status: 0, //0 , 1
  type_ownership: 3, // 0,1,2,3,
  Chassis_number: "",
  document_number: "",
  document_date: null,
  Insurance_validity: null,
  Insurance_number: "",
  certificate_required: 0, //0,1,2,3
  owner_phone_number: "",
  description: "",
  smart_card_validity: null,
  loader: null,
  systemsSearch: null,
  loadingTypeSearch: null,
  tipsSearch: null,
  allowed_certificate: null,
  image: null,
  is_new: null,
  restore: false,
};

export default function NewFleet({
  mode: formMode,
  owner,
  id,
  onCancel,
  onSuccess,
  initialData = EmptyFormData,
  isDialog,
  companyUsage,
}: NewFleetProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [smartNumberStatus, setSmartNumberStatus] = useState(0);
  const [loaderLabel, setLoaderLabel] = useState("نوع بارگیر");
  const [capacityUnit, setCapacityUnit] = useState("کیلوگرم");
  const [mode, setMode] = useState(formMode);

  const {
    control,
    register,
    watch,
    reset,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<formInterface>({
    defaultValues: {
      ...initialData,
      Insurance_validity: initialData.insurance_validity,
      usage: companyUsage == 1 ? "freighter" : "passenger",
    },
  });

  const { usage, loadingTypeSearch, smart_number, date_made } = useWatch({
    control,
  });

  const navigate = useNavigate();

  const getDataDriverTruck = useGetDriverFleetByIdQuery(id, {
    skip: !id || owner !== "me",
  });

  const getDataCompanyTruck = useGetCompanyFleetByIdQuery(id, {
    skip: !id || owner !== "company",
  });

  useEffect(() => {
    if (smart_number === "") reset(EmptyFormData);
  }, [smart_number]);

  useEffect(() => {
    if (initialData) reset({ type_ownership: 3, ...initialData });
  }, [initialData]);

  // برای تغییر نام ورودی های loader و capacity طبق کاربری
  useEffect(() => {
    if (usage === "passenger") {
      setLoaderLabel("نوع خودرو");
      setCapacityUnit("مسافر");
    } else if (usage === "freighter") {
      setLoaderLabel("نوع بارگیر");
      setCapacityUnit("کیلوگرم");
    }
  }, [usage]);

  useEffect(() => {
    // اضافه کردن شرط برای جلوگیری از اجرای بی‌مورد
    if (getDataDriverTruck.data?.data) {
      const truckInfo = getDataDriverTruck.data.data.truck_info;
      const truck = getDataDriverTruck.data.data.truck;

      // تنظیم تمام مقادیر در یک آبجکت
      const formValues = {
        id,
        truck_id: id,
        smart_number: truck.smart_number,
        type_ownership: truckInfo.type_ownership ?? 3,
        first_number: truck.first_number,
        second_number: truck.second_number,
        third_character: truck.third_character,
        fourth_number: truck.fourth_number,
        plate_type: truck.plate_type,
        usage: truck.usage,
        date_made: truck.date_made,
        loader: truck.loader,
        loader_type: truck.loader.name,
        loader_type_id: truck.loader.id,
        Fixed_NonFixed_Type: truck.Fixed_NonFixed_Type,
        system: truckInfo.system,
        tip: truckInfo.tip,
        allowed_certificate: truckInfo.allowed_certificate,
        Chassis_number: truckInfo.Chassis_number,
        document_number: truckInfo.document_number,
        document_date: truckInfo.document_date,
        smart_card_validity: null,
        Insurance_number: truckInfo.insurance_number,
        Insurance_validity: truckInfo.insurance_validity,
        validity_technical_examination: truck.validity_technical_examination,
        owner_phone_number: truckInfo.owner_phone_number,
        description: truckInfo.description,
        color_id: truckInfo.color_id,
        organization_status: truck.organization_status,
        type: truckInfo.usage === "passenger" ? 2 : 1,
        capacity: truckInfo.capacity,
      };

      reset({
        ...formValues,
      });
    }
  }, [getDataDriverTruck, reset]); // فقط وابستگی‌های ضروری

  useEffect(() => {
    // اضافه کردن شرط برای جلوگیری از اجرای بی‌مورد
    if (getDataCompanyTruck.data?.data) {
      const companyTruck = getDataCompanyTruck.data.data.company_truck;
      const truckInfo = getDataCompanyTruck.data.data.truck_info;
      const truck = getDataCompanyTruck.data.data.truck;

      // تنظیم تمام مقادیر در یک آبجکت
      const formValues = {
        id: companyTruck.id,
        truck_id: companyTruck.id,
        smart_number: truck.smart_number,
        type_ownership: truckInfo.type_ownership ?? 3,
        first_number: truck.first_number,
        second_number: truck.second_number,
        third_character: truck.third_character,
        fourth_number: truck.fourth_number,
        plate_type: truck.plate_type,
        usage: truck.usage,
        date_made: truck.date_made,
        loader: truck.loader,
        loader_type: truck.loader.name,
        loader_type_id: truck.loader.id,
        Fixed_NonFixed_Type: truck.Fixed_NonFixed_Type,
        system: truckInfo.system,
        tip: truckInfo.tip,
        allowed_certificate: truckInfo.allowed_certificate,
        Chassis_number: truckInfo.Chassis_number,
        document_number: truckInfo.document_number,
        document_date: truckInfo.document_date,
        smart_card_validity: null,
        Insurance_number: truckInfo.insurance_number,
        Insurance_validity: truckInfo.insurance_validity,
        validity_technical_examination: truck.validity_technical_examination,
        owner_phone_number: truckInfo.owner_phone_number,
        description: truckInfo.description,
        color_id: truckInfo.color_id,
        organization_status: truck.organization_status,
        type: truckInfo.usage === "passenger" ? 2 : 1,
        capacity: truckInfo.capacity,
      };

      reset({
        ...formValues,
      });
    }
  }, [getDataCompanyTruck, reset]); // فقط وابستگی‌های ضروری

  const [addEditFleetFn, addEditFleetResult] =
    useAddEditDriverOrComaonyFleetMutation();

  useEffect(() => {
    if (addEditFleetResult.isSuccess) {
      SweetAlertToast.fire({
        title: addEditFleetResult.data?.message,
        icon: "success",
      });

      reset();

      if (onSuccess) onSuccess(addEditFleetResult.data.data);
      else if (!addEditFleetResult.data.data.restore) navigate(-1); // ? پس از ویرایش یا ثبت باعث میشود برگردد به لیست ناوگان ها
    }
  }, [addEditFleetResult.isSuccess, onSuccess, navigate]);

  const loadingTypes = useGetLoadingTypesByActivityTypeQuery({
    activityType: usage,
    query: loadingTypeSearch,
  });

  const [smartNumberInquiryFn, smartNumberInquiryResult] =
    useGetTechnicalManagerSmartNumberInquiryMutation();

  useEffect(() => {
    if (smartNumberInquiryResult.isSuccess) {
      const data = smartNumberInquiryResult.data.data;

      // تنظیم تمام مقادیر در یک آبجکت
      const formValues = {
        truck_id: data.id,
        smart_number: data.smart_number,
        type_ownership: data.type_ownership ?? 3,
        first_number: data.first_number,
        second_number: data.second_number,
        third_character: data.third_character,
        fourth_number: data.fourth_number,
        usage: data.usage,
        date_made: data.date_made,
        loader: data.loader,
        loader_type: data.loader.name,
        loader_type_id: data.loader.id,
        system: data.system,
        tip: data.tip,
        allowed_certificate: data.allowed_certificate,
        Chassis_number: data.Chassis_number,
        document_number: data.document_number,
        document_date: data.document_date,
        smart_card_validity: null,
        Insurance_number: data.Insurance_number,
        Insurance_validity: data.Insurance_validity,
        validity_technical_examination: data.validity_technical_examination,
        owner_phone_number: data.owner_phone_number,
        type: data.usage === "passenger" ? 2 : 1,
        is_new: data.is_new,
        capacity: data.capacity,
      };

      reset((prevData) => ({
        ...prevData,
        ...formValues,
      }));

      if (smartNumberInquiryResult.data.data.restore) {
        navigate(-1);
        SweetAlertToast.fire({
          icon: "success",
          text: "اطلاعات ناوگان در سامانه موجود بود و با موفقیت اضافه شد",
        });
      }

      setSmartNumberStatus(1);
      setTimeout(() => {
        setSmartNumberStatus(0);
      }, 5000);
    } else if (smartNumberInquiryResult.isError) {
      if (smartNumberInquiryResult.isError) {
        setMode("ADD_WITHOUT_INQUIRY");
      } else {
        setSmartNumberStatus(2);
        setTimeout(() => {
          setSmartNumberStatus(0);
        }, 5000);
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

  const handleSmartNumberInquiry = useCallback(
    async (smartNumber: string | undefined = smart_number) => {
      const validation = await trigger("smart_number");
      if (validation) {
        smartNumberInquiryFn({
          smartNumber,
          companyUsage,
          usage: getValues("usage"),
        });
      } else {
        SweetAlertToast.fire({
          html: Object.values(errors)
            .map((error) => error?.message)
            .join("<br>"),
          icon: "error",
        });
      }
    },
    [errors, trigger, smartNumberInquiryFn, smart_number],
  );

  const onSubmit = useCallback(
    async (data: formInterface) => {
      const validation = await trigger();
      if (validation) {
        const newData = {};

        Object.assign(newData, {
          ...data,
          loader_type: data.loader?.name,
          loader_type_id: data.loader?.id ?? data.loader?.uuid,
          system_id: data.system?.id,
          tip_id: data.tip?.id,
          image: data.image?.[0] || null,
          type: data.usage === "passenger" ? 2 : 1,
        });

        if (mode === "ADD_WITHOUT_INQUIRY")
          Object.assign(newData, {
            is_new: true,
            is_active: true,
          });

        addEditFleetFn({
          data: newData,
          mode,
          owner: owner as "company" | "me" | "technical-manager",
        });
      } else {
        SweetAlertToast.fire({
          html: Object.values(errors)
            .map((error) => error?.message)
            .join("<br>"),
          icon: "error",
        });
      }
    },
    [errors, trigger],
  );

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="md:gap-y-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center mb-4">
          {/* <Truck
								size="32"
								className="text-primary"
							/> */}
          <h2 className="font-bold text-xl">
            {mode === "ADD" || mode === "ADD_WITHOUT_INQUIRY"
              ? "افزودن ناوگان جدید"
              : "ویرایش ناوگان"}
          </h2>
        </div>
        {isDialog && (
          <IconButton onClick={onCancel}>
            <CloseSquare size="24" className="text-red-500" />
          </IconButton>
        )}
      </div>

      <Divider variant="fullWidth" className="mb-8" />

      <div className="w-full flex flex-col gap-4">
        {!isMobile && (
          <SkeletonCondition
            loading={
              getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
            }
            variant="rounded-sm"
          >
            <TextField
              id="outlined-required"
              error={!!errors.smart_number}
              helperText={errors.smart_number?.message.toString() ?? ""}
              {...register("smart_number", {
                validate: (data: any) => {
                  if (data?.length < 7)
                    return (
                      data?.length === 7 || "طول شماره هوشمند ماشین ۷ رقمی است"
                    );
                },
              })}
              value={watch("smart_number") ?? ""}
              label="هوشمند ماشین"
              type="text"
              slotProps={{
                htmlInput: { maxLength: "7", autoComplete: "off" },
                input: {
                  sx: {
                    borderRadius: "8px",
                  },
                  endAdornment: (
                    <IconButton
                      disabled={smartNumberInquiryResult.isLoading}
                      loading={smartNumberInquiryResult.isLoading}
                      onClick={() => handleSmartNumberInquiry()}
                      className="text-primary"
                      title="استعلام"
                    >
                      <ArrowSwapHorizontal size="24" />
                    </IconButton>
                  ),
                },
              }}
              className="w-48"
              onKeyDown={(e: any) => {
                if (e.key === "Enter") handleSmartNumberInquiry();
              }}
            />
          </SkeletonCondition>
        )}

        {owner === "company" && (
          <Controller
            name="type_ownership"
            control={control}
            rules={{ required: "نوع مالکیت الزامی است ." }}
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  {...field}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                  className="pt-8 px-8 md:p-0"
                  row
                >
                  <SkeletonCondition
                    loading={
                      getDataDriverTruck.isLoading ||
                      getDataDriverTruck.isFetching
                    }
                    variant="text"
                    className="w-24 ml-3"
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeigth: "500",
                        },
                      }}
                      value={0}
                      control={<Radio checked={field.value === 0} />}
                      label="ملکی"
                    />
                  </SkeletonCondition>

                  <SkeletonCondition
                    loading={
                      getDataDriverTruck.isLoading ||
                      getDataDriverTruck.isFetching
                    }
                    variant="text"
                    className="w-24 ml-3"
                  >
                    <FormControlLabel
                      value={1}
                      control={<Radio checked={field.value === 1} />}
                      label="استیجاری"
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeigth: "500",
                        },
                      }}
                    />
                  </SkeletonCondition>
                  <SkeletonCondition
                    loading={
                      getDataDriverTruck.isLoading ||
                      getDataDriverTruck.isFetching
                    }
                    variant="text"
                    className="w-24 ml-3"
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeigth: "500",
                        },
                      }}
                      value={2}
                      control={<Radio checked={field.value === 2} />}
                      label="آزاد"
                    />
                  </SkeletonCondition>
                  <SkeletonCondition
                    loading={
                      getDataDriverTruck.isLoading ||
                      getDataDriverTruck.isFetching
                    }
                    variant="text"
                    className="w-24 "
                  >
                    <FormControlLabel
                      value={3}
                      control={<Radio checked={field.value === 3} />}
                      label="نامعلوم"
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeigth: "500",
                        },
                      }}
                    />
                  </SkeletonCondition>
                </RadioGroup>
                <FormHelperText className="text-[#d32f2f]! text-xs absolute bottom-0 translate-y-4">
                  {errors.type_ownership?.message.toString() ?? ""}
                </FormHelperText>
              </FormControl>
            )}
          />
        )}

        {smartNumberStatus !== 0 && (
          <Stack>
            {smartNumberStatus === 1 && (
              <div
                className={
                  "bg-primary rounded-xl p-4 self-start " +
                  "text-[90%] basis-1/2  font-bold tracking-tight flex flex-row gap-2 items-center"
                }
              >
                <img src={CheckSuccess} alt="Check success" />
                این ماشین با شماره هوشمند <span>{smart_number}</span> مورد تایید
                سازمان حمل و نقل کشور برای فعالیت میباشد
              </div>
            )}
            {smartNumberStatus === 2 && (
              <div
                className={
                  "bg-[#c1121f] rounded-xl p-4 self-start " +
                  "text-[90%] basis-1/2 text-white  font-bold tracking-tight flex flex-row gap-2 items-center"
                }
              >
                <IoMdInformationCircleOutline
                  className={"w-8 h-8 fill-white"}
                />
                این ماشین با شماره هوشمند <span>{smart_number}</span> ناوگان از
                طرف سازمان حمل و نقل کشور غیر فعال میباشد
              </div>
            )}
          </Stack>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <ArrowSwapHorizontal size="24" className="text-primary" />
            <h3 className="font-semibold text-lg">نتیجه استعلام</h3>
          </div>

          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4">
            {isMobile && (
              <SkeletonCondition
                loading={
                  getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
                }
                variant="rounded-sm"
              >
                <TextField
                  id="outlined-required"
                  error={!!errors.smart_number}
                  helperText={errors.smart_number?.message.toString() ?? ""}
                  {...register("smart_number", {
                    validate: (data: any) => {
                      if (data?.length < 7) {
                        return (
                          data?.length === 7 ||
                          "طول شماره هوشمند ماشین ۷ رقمی است"
                        );
                      }
                    },
                  })}
                  value={watch("smart_number") ?? ""}
                  label="هوشمند ماشین"
                  fullWidth
                  type="text"
                  dir="ltr"
                  slotProps={{
                    htmlInput: { maxLength: "7", autoComplete: "off" },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={() => handleSmartNumberInquiry()}
                            loading={smartNumberInquiryResult.isLoading}
                            className="bg-primary rounded-lg w-8 h-8"
                          >
                            <ArrowSwapHorizontal size="20" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </SkeletonCondition>
            )}

            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <PlateTextField
                control={control}
                watch={watch}
                error={
                  !!(
                    errors.first_number ||
                    errors.third_character ||
                    errors.second_number ||
                    errors.fourth_number
                  )
                }
                helperText={errors.first_number?.message.toString() ?? ""}
                rules={{ required: "فیلد پلاک ماشین الزامی است" }}
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <SelectCustom
                control={control}
                label="کاربری"
                name="usage"
                error={!!errors.usage}
                helperText={errors.usage?.message.toString() ?? ""}
                rules={{ required: "فیلد کاربری الزامی است" }}
                fullWidth
                items={[
                  { title: "مسافری", value: "passenger" },
                  { title: "باری", value: "freighter" },
                ]}
                className="font-medium"
                disabled={mode === "EDIT"}
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                slotProps={{
                  htmlInput: {
                    maxLength: 4,
                    dir: "ltr",
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: !!date_made,
                  },
                }}
                error={!!errors.date_made}
                helperText={errors.date_made?.message.toString() ?? ""}
                {...register("date_made", {
                  required: "سال ساخت الزامی است .",
                  valueAsNumber: true,
                })}
                fullWidth
                label="سال ساخت"
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
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
                searchName="loadingTypeSearch"
                label={loaderLabel}
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
              className="col-start-1"
            >
              <TextField
                slotProps={{
                  htmlInput: {
                    maxLength: 6,
                    dir: "ltr",
                    autoComplete: "off",
                  },
                  input: {
                    endAdornment: <span className="ms-2">{capacityUnit}</span>,
                  },
                  inputLabel: {
                    shrink: true,
                  },
                }}
                className="col-start-1"
                error={!!errors.capacity}
                helperText={errors.capacity?.message.toString() ?? ""}
                {...register("capacity", { maxLength: 5 })}
                onChange={(event: React.SyntheticEvent) => {
                  let value = (event.target as HTMLInputElement).value;
                  value = value.replace(/\D/g, "");
                  if (value.length > 5) value = value.slice(0, 5);
                  (event.target as HTMLInputElement).value = value;
                }}
                type="number"
                fullWidth
                label="ظرفیت طبق کارت"
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <DatePickerComponent
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                name="Insurance_validity"
                label="تاریخ اعتبار بیمه"
                control={control}
                disablePast={true}
                rules={{ required: "فیلد تاریخ اعتبار بیمه الزامی است" }}
                error={!!errors.Insurance_validity}
                helperText={errors.Insurance_validity?.message.toString() ?? ""}
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <SelectCustom
                control={control}
                label="گواهی نامه مجاز"
                name="allowed_certificate"
                error={!!errors.allowed_certificate}
                helperText={
                  errors.allowed_certificate?.message.toString() ?? ""
                }
                rules={{ required: "فیلد گواهی نامه مجاز الزامی است" }}
                fullWidth
                items={[
                  { title: "پایه یک", value: 1 },
                  { title: "پایه دو", value: 2 },
                  { title: "پایه دو تبصره 99", value: 3 },
                ]}
                className="font-medium"
                readOnly={
                  initialData?.usage === "freighter" &&
                  mode !== "ADD_WITHOUT_INQUIRY"
                }
              />
            </SkeletonCondition>
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <DatePickerComponent
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                name="validity_technical_examination"
                label="اعتبار معاینه فنی"
                control={control}
                disablePast
                rules={{ required: "فیلد اعتبار معاینه فنی الزامی است" }}
                error={!!errors.validity_technical_examination}
                helperText={
                  errors.validity_technical_examination?.message.toString() ??
                  ""
                }
                className="col-start-1"
              />
            </SkeletonCondition>
            {/* <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                slotProps={{
                  htmlInput: {
                    maxLength: 11,
                    dir: "ltr",
                    autoComplete: "off",
                  },
                  inputLabel: {
                    shrink: !!watch("owner_phone_number"),
                  },
                }}
                error={!!errors.owner_phone_number}
                helperText={errors.owner_phone_number?.message.toString() ?? ""}
                {...register("owner_phone_number", {
                  onChange: (event) => {
                    const value = (event.target as HTMLInputElement).value;
                    let newValue = "";
                    for (let i = 0; i < value.length; i++)
                      if (/^[0-9]/g.test(value[i])) newValue += value[i];
                    (event.target as HTMLInputElement).value = newValue;
                  },
                  pattern: {
                    value: /^09[0-9]{9}$/,
                    message: "شماره همراه باید با 09 شروع شود و 11 رقم باشد",
                  },
                })}
                fullWidth
                label="همراه مالک"
              />
            </SkeletonCondition> */}
            <SkeletonCondition
              loading={
                getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
              }
              variant="rounded-sm"
            >
              <TextField
                slotProps={{
                  htmlInput: { autoComplete: "off" },
                  inputLabel: { shrink: true },
                }}
                error={!!errors.description}
                helperText={errors.description?.message.toString() ?? ""}
                {...register("description")}
                fullWidth
                label="توضیحات"
                className="col-span-3"
              />
            </SkeletonCondition>

            <Divider variant="fullWidth" className="my-2 col-span-full" />

            <div className="flex gap-4 col-start-4">
              <SkeletonCondition
                loading={
                  getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
                }
                variant="rounded-sm"
              >
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => {
                    onCancel ? onCancel() : navigate(-1);
                  }}
                  endIcon={<IoClose />}
                  variant="outlined"
                  fullWidth
                >
                  انصراف
                </Button>
              </SkeletonCondition>
              <SkeletonCondition
                loading={
                  getDataDriverTruck.isLoading || getDataDriverTruck.isFetching
                }
                variant="rounded-sm"
              >
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<FaLongArrowAltLeft />}
                  loading={addEditFleetResult.isLoading}
                  fullWidth
                >
                  ثبت
                </Button>
              </SkeletonCondition>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
