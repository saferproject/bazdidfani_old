"use client";
import {
  useAddTechnicalManagerMutation,
  useGetTechnicalManagersMutation,
} from "../../../api/TechnicalManager/TechnicalManager";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { STORAGE_URL } from "../../../Stores/api-urls";
import {
  Avatar,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InfoCircle } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface IDivider {
  text?: string;
}

const TextDivider = (props: IDivider) => {
  const { text } = props;
  return (
    <Stack direction="row" alignItems="center" spacing={10}>
      <Typography variant="subtitle2" className="font-extrabold">
        {text}
      </Typography>
      <Divider className="flex-1" />
    </Stack>
  );
};

export default function AddTechnicalmanager() {
  const {
    control,
    trigger,
    register,
    watch,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { national_code } = useWatch({ control });

  const [inquiried, setInquiried] = useState(false);

  const navigate = useNavigate();

  const [addTechnicalManager, addTechnicalManagerResult] =
    useAddTechnicalManagerMutation();

  useEffect(() => {
    if (addTechnicalManagerResult.isSuccess) {
      SweetAlertToast.fire({
        title: addTechnicalManagerResult.data?.message,
        icon: "success",
      });
      navigate("/dashboard/technicalmanagers");
    } else if (addTechnicalManagerResult.isError) {
      const error = addTechnicalManagerResult.error as any;

      if (error?.response?.data?.data?.start_cooperate) {
        setError("start_cooperate", {
          type: "serverError",
          message: error?.response?.data?.data?.start_cooperate[0] || "",
        });
      } else {
        clearErrors("start_cooperate");
      }
      if (error?.response?.data?.data?.end_cooperate) {
        setError("end_cooperate", {
          type: "serverError",
          message: error?.response?.data?.data?.end_cooperate[0] || "",
        });
      } else {
        clearErrors("end_cooperate");
      }
    }
  }, [addTechnicalManagerResult, clearErrors, navigate, setError]);

  const [getTechnicalManangerFn, getTechnicalManangerResult] =
    useGetTechnicalManagersMutation();
  useEffect(() => {
    if (getTechnicalManangerResult.isSuccess) {
      if (getTechnicalManangerResult.data.success === false) {
        SweetAlertToast.fire({
          icon: "error",
          text: getTechnicalManangerResult.data.message,
        });
      } else {
        const data = getTechnicalManangerResult.data[0];
        reset({
          user: data?.user?.id,
          type: data?.type,
          full_name: data?.user?.personal?.full_name,
          national_code: data?.user?.personal?.national_code,
          father_name: data?.user?.personal?.father_name,
          capacity: data?.capacity,
          // freighter_capacity: data?.freighter_capacity,
          // passenger_capacity: data?.passenger_capacity,
          birthdate: data?.user?.personal?.birthdate,
          adress: data?.user?.personal?.address,
          image: data?.user?.images,
        });
        setInquiried(true);
      }
    }
  }, [getTechnicalManangerResult, reset]);

  const handleInquery = async () => {
    const validate = await trigger("national_code");
    if (validate) {
      getTechnicalManangerFn(`?national_code=${national_code}`);
    }
  };

  return (
    <Stack direction="column" spacing={5}>
      {!inquiried ? (
        <>
          <Typography variant="body2" className="font-extrabold">
            افزودن مدیر فنی جدید
          </Typography>
          <div className="p-4 flex items-center gap-4 border border-dashed  bg-[#f2f3f5] text-[#6B7379] rounded-xl">
            <InfoCircle size={32} />
            <Typography variant="subtitle2" className="font-extrabold text-lg">
              ابتدا مدیرفنی در سامانه بازدید فنی باید ثبت نام کند و سپس احراز
              هویت شود. سپس کد ملی مدیرفنی را وارد کنید و از همین سامانه بازدید
              فنی استعلام بگیرید.
            </Typography>
          </div>
          <div className="flex items-center justify-start gap-x-7">
            <div>
              <TextField
                dir="ltr"
                type="text"
                className="translate-y-3"
                inputProps={{ maxLength: "10" }}
                error={errors.national_code ? true : false}
                helperText={errors.national_code?.message?.toString() || " "}
                {...register("national_code", {
                  required: "فیلد کد ملی الزامی است",
                  validate: (data: string) =>
                    data.length === 10 || "تعداد ارقام وارد شده صحیح نیست",
                })}
                label="کد ملی مدیرفنی"
              />
            </div>
            <div className="flex items-center justify-start">
              <Button
                variant="contained"
                onClick={handleInquery}
                fullWidth
                className="px-10 py-3"
                loading={getTechnicalManangerResult.isLoading}
              >
                استعلام از سامانه بازدید فنی
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="font-semibold">
            اطلاعات مدیرفنی <b>{watch("full_name")}</b> با شماره ملی{" "}
            <b>{watch("national_code")}</b>
          </p>
          <Avatar
            sx={{
              width: 150,
              height: 150,
            }}
            src={`${STORAGE_URL}${watch("image").find((ele: any) => ele.image_type === "profile")?.url}`}
          />
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-6">
            <TextField
              {...register("full_name")}
              fullWidth
              label="نام و نام خانوادگی"
              slotProps={{
                input: {
                  readOnly: true,
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              {...register("national_code")}
              fullWidth
              label="کد ملی"
              dir="ltr"
              slotProps={{
                input: {
                  readOnly: true,
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              {...register("father_name")}
              fullWidth
              label="فرزند"
              slotProps={{
                input: {
                  readOnly: true,
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              {...register("capacity")}
              fullWidth
              label="تعداد کل بازدید"
              slotProps={{
                htmlInput: {
                  dir: "ltr",
                },
                input: {
                  readOnly: true,
                  startAdornment: "روزانه",
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
                name="birthdate"
                label="تاریخ تولد"
                control={control}
              />
            </div>
            <TextField
              {...register("adress")}
              fullWidth
              label="آدرس محل سکونت"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              multiline
            />
          </div>
          <TextDivider
            text={`برای همکاری با ${watch("full_name")} تاریخ شروع و پایان قرارداد را تنظیم کنید`}
          />
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-6">
            <div>
              <DatePickerComponent
                control={control}
                label="تاریخ شروع"
                name="start_cooperate"
                error={errors.start_cooperate ? true : false}
                helperText={errors.start_cooperate?.message?.toString()}
              />
            </div>
            <div>
              <DatePickerComponent
                control={control}
                label="تاریخ پایان"
                name="end_cooperate"
                error={errors.end_cooperate ? true : false}
                helperText={errors.end_cooperate?.message?.toString()}
              />
            </div>
          </div>
          <div className="grid grid-cols-6">
            <Button
              loading={addTechnicalManagerResult.isLoading}
              variant="contained"
              onClick={handleSubmit(addTechnicalManager)}
              endIcon={<FaLongArrowAltLeft />}
              className="flex justify-between col-start-6"
            >
              ثبت
            </Button>
          </div>
        </>
      )}
    </Stack>
  );
}
