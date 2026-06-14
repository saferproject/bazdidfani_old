"use client";
import {
  useAddTechnicalManagerMutation,
  useGetTechnicalManagersMutation,
  useSendOTPToTechManagerMutation,
  useVerifyOTPForTechManagerMutation,
} from "../../../api/TechnicalManager/TechnicalManager";
import DatePickerComponent from "../../../components/shared/DatePicker/DatePickerComponent";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { STORAGE_URL } from "../../../Stores/api-urls";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InfoCircle } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaCode, FaLongArrowAltLeft, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/shared/Dialog/CustomeDialog";
import OTPInput from "react-otp-input";
import { ToPersianNumber } from "../../../components/shared/Functions/ChangeNumLang";
import { BsCode, BsXCircle } from "react-icons/bs";
import { CgPassword } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { setPhone as setPhoneStore, setStep } from "../../../Stores/slices/user";

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
  const [sendOtp, sendOtpResult] =
    useSendOTPToTechManagerMutation();
  const [verifyOtp, verifyOtpResult] =
    useVerifyOTPForTechManagerMutation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [otpStep, setOtpStep] = useState(0);
  const [isValidToSend, setIsValidToSend] = useState(true);
  const [minute, setMinute] = useState(1);
  const [seconds, setSeconds] = useState(59);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
    if (!sendOtpResult.isSuccess && !sendOtpResult.isLoading) {
          SweetAlertToast.fire({
            title: sendOtpResult.data?.message,
            icon: "error",
          });
        }
        else if (sendOtpResult.isSuccess) {
          setOtpStep(2);
          setIsValidToSend(false);
          setTimeout(() => {
            setIsValidToSend(true);
          }, 120000);
        }
  }, [sendOtpResult]);

  useEffect(() => {
if (!verifyOtpResult.isSuccess && !verifyOtpResult.isLoading) {
          SweetAlertToast.fire({
            title: verifyOtpResult.data?.message,
            icon: "error",
          });
        }
        else if (verifyOtpResult.isSuccess) {
          dispatch(setPhoneStore(phone));
          navigate("/dashboard/technicalmanagers/complete-profile");
        }
  }, [verifyOtpResult]);

  useEffect(() => {
    if (!isValidToSend) {
      setMinute(1);
      setSeconds(59);
      intervalRef.current = setInterval(() => {
        setSeconds(sec => sec - 1);
      }, 1000);
      setTimeout(() => {
        setMinute(0);
        setSeconds(60);
      }, 60000);
      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
      }, 120000);
    }
  }, [isValidToSend]);

  useEffect(() => {
    if (otpStep !== 2) {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      setIsValidToSend(true);
    }
  }, [otpStep]);

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
        setShowAddDialog(true);
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

  const handleChange = async (otp: string) => {
    const persianOtp = ToPersianNumber(otp);
    setToken(persianOtp);
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
      <CustomDialog
        show={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        hasOnClose
      >
        <Box className="flex flex-col gap-4">
          <Box className="flex flex-row justify-between items-center">
            <Box className="flex flex-row items-center gap-4">
              <div className="w-8 h-8 flex flex-row items-center justify-center rounded-full bg-primary">
                <FaUserPlus className="text-secondary" />
              </div>
              <h2 className="font-bold text-2xl">افزودن کاربر</h2>
              </Box>
            <BsXCircle className="text-rose-600 select-none cursor-pointer" onClick={() => setShowAddDialog(false)} />
          </Box>
          <p>
          مدیر فنی یافت نشد. آیا میخواهید مدیر فنی را خودتان اضافه کنید؟
        </p>
        <Box className="flex flex-row items-center gap-2">
          <Button onClick={() => {
            setShowAddDialog(false);
            setShowOTPDialog(true);
            setOtpStep(1);
          }} className="flex-grow" variant="contained" color="primary">بله</Button>
          <Button className="flex-grow" onClick={() => setShowAddDialog(false)} variant="contained" color="secondary">خیر</Button>
        </Box>
        </Box>
      </CustomDialog>
      <CustomDialog
        show={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        hasOnClose
      >
        <Box className="flex flex-col gap-4">
          <Box className="flex flex-row justify-between items-center">
            <Box className="flex flex-row items-center gap-4">
              <div className="w-8 h-8 flex flex-row items-center justify-center rounded-full bg-primary">
                <CgPassword className="text-secondary" />
              </div>
              <h2 className="font-bold text-2xl">دریافت کد تایید</h2>
              </Box>
            <BsXCircle className="text-rose-600 select-none cursor-pointer" onClick={() => setShowOTPDialog(false)} />
          </Box>
          {
          otpStep === 1 ? (
            <Box className="flex flex-col gap-2">
              <Box className="!text-black/70 text-sm">
                لطفا شماره همراه مدیر فنی را وارد نمایید.
              </Box>
              <Box className="self-stretch">
                <TextField name="phone" label="شماره همراه" onChange={(event) => setPhone(event.target.value)}></TextField>
              </Box>
            </Box>
          ) : (
            <Box className="flex flex-col gap-2">
              <Box className="!text-black/70">
                کد تایید پیامک شده را وارد نمایید.
              </Box>
              <Box className="flex flex-row gap-4">
                  <Button className="flex-grow" onClick={() => setOtpStep(1)}>تغییر شماره همراه</Button>
                  <Button disabled={!isValidToSend} className="flex-grow" onClick={() => sendOtp({ phone })}>{ isValidToSend ? "ارسال مجدد کد" : `${Intl.NumberFormat("fa-IR", {
                    minimumIntegerDigits: 2
                  }).format(minute)}:${Intl.NumberFormat("fa-IR", {
                    minimumIntegerDigits: 2
                  }).format(seconds)}` }</Button>
                </Box>
              <Box>
                <OTPInput
                  onChange={handleChange}
                  value={token}
                  numInputs={4}
                  renderInput={(props, index) => (
                    <input
                      {...props}
                      id={`otp-${index}`}
                      type="tel"
                      inputMode="numeric"
                      className={`border-b border-black text-[22.5pt]  w-[40px] md:w-[50px] h-[42px] md:h-[52px] outline-hidden focus:border-primary-dark text-center`}
                    />
                  )}
                  containerStyle="flex flex-row-reverse gap-x-5 justify-evenly items-start"
                />
              </Box>
            </Box>
          )
        }
        <Button className="self-stretch" loading={sendOtpResult.isLoading || verifyOtpResult.isLoading} onClick={() => {
            if (otpStep === 1)
              sendOtp({ phone });
            else 
              verifyOtp({ phone, token });
          }} variant="contained" color="primary">تایید</Button>
        </Box>
      </CustomDialog>
    </Stack>
  );
}
