import { useLoginOrSendNewPasswordDataMutation } from "../../api/Auth/Login";
import LockIcon from "../../assets/images/LockIcon.png";
import { useAppDispatch, useAppSelector } from "../../Stores/hooks";
import { clear, removeOtp, removeOTPSent, removePhone, removeStep, removeToken } from "../../Stores/slices/user";
import { LoginDataOrChangePasswordType, PropsType } from "../../types/AuthType";
import { ToEnglishNumber } from "../shared/Functions/ChangeNumLang";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";







































const hasTwoAuthentication = (value: unknown) =>
  value === true || value === 1 || value === "1" || value === "true";

export default function LoginUsernamePassword(props: PropsType) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [forgot, setForgot] = useState(false);
  const phone = useAppSelector((state) => state.user.phone);
  const token = useAppSelector((state) => state.user.token);
  const otp = useAppSelector((state) => state.user.otp);

  const [loginOrSendNewPasswordDataFn, loginOrSendNewPasswordDataResult] =
    useLoginOrSendNewPasswordDataMutation();

  const {
    watch,
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LoginDataOrChangePasswordType>();

  // ? پس از ورود موفقیت امیز
  useEffect(() => {
    if (loginOrSendNewPasswordDataResult.isSuccess) {
      const requiresTwoAuthentication = hasTwoAuthentication(
        loginOrSendNewPasswordDataResult.data?.data?.two_authentication,
      );
      SweetAlertToast.fire({
        icon: "success",
        title: loginOrSendNewPasswordDataResult.data.message,
      });

      if (requiresTwoAuthentication) {
        props.handleChangePage(2);
      } else if (forgot) {
        reset();
        dispatch(removeOTPSent());
        dispatch(removeOtp());
        dispatch(removePhone());
        dispatch(removeStep());
        dispatch(removeToken());
        window.location.href = "/auth";
      } else if (searchParams.get("next") && searchParams.get("next") !== "")
        navigate(searchParams.get("next"));
      else navigate("/dashboard");
    }
  }, [loginOrSendNewPasswordDataResult.isSuccess]);

  // ? فقط اجازه می دهد شماره تلفن به عنوان نام کاربری وارد شود
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    value = value.replace(/[^0-9]/g, "");
    setValue("username", value);
  };

  useEffect(() => {
    if (props.activePage !== 0) reset();
  }, [searchParams, props.activePage, reset]);

  // ? ارسال اطلاعات ورود یا رمز جدید
  async function onSubmit() {
    const validation = await trigger();
    if (validation) {
      const persistedOtp = localStorage.getItem("otp");
      const persistedToken = localStorage.getItem("token");
      const forgotPasswordToken =
        otp || persistedOtp || token || persistedToken;
      if (forgot && !forgotPasswordToken) {
        SweetAlertToast.fire({
          icon: "error",
          title:
            "کد تایید برای بازیابی رمز عبور پیدا نشد. لطفا دوباره درخواست کد بدهید.",
        });
        return;
      }
      loginOrSendNewPasswordDataFn({
        data: phone!,
        token: forgot ? forgotPasswordToken! : "",
        forgot,
        password: watch("password")!,
        password_confirmation: watch("confirmPassword")!,
        username: ToEnglishNumber(watch("username") as string),
      });
    } else {
      SweetAlertToast.fire({
        html: Object.values(errors)
          .map((error) => error?.message)
          .join("<br>"),
        icon: "error",
      });
    }
  }

  // ? اگر در آدرس فراموشی رمز عبور باشد
  useEffect(() => {
    const value = searchParams.get("forgot");
    if (value === "true") setForgot(true);
    else setForgot(false);
  }, [searchParams]);

  // ? در والد این کامپوننت صفحه و مرحله لوگین را تغییر می دهد
  const makeNewAccount = () => {
    dispatch(clear());
    props.handleChangePage(1);
  };

  return (
    <div className="lg:mt-[3vh] flex flex-row items-center">
      <div>
        {/** className={"sm:ms-16"} for this container when the glass box exists. */}
        {/* <div className="max-w-[154px] w-[30vw] lg:w-[8vw] text-center flex items-center justify-center h-[50px] lg:h-[55px] bg-primary-light rounded-t-[29px] mr-[33px]">
					<h1 className="font-[rokh] hidden sm:block mt-2 font-black text-[3vw] lg:text-[1.5vw]">ورود</h1>
					<h1
						onClick={makeNewAccount}
						className="font-[rokh] cursor-pointer select-none block sm:hidden mt-2 font-black text-[3vw] lg:text-[1.5vw]"
					>
						ایجاد حساب جدید
					</h1>
				</div> */}
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between w-[85vw] md:w-[50vw] lg:w-[40vw] xl:w-[28vw] max-w-[490px] bg-white max-h-[540px] 2xl:h-[70vh] px-[4vw] md:px-[2vw] pt-[4vh] shadow-[0_40px_80px_0_#9ea4aa] shadowo-opacity-24 rounded-[38px]"
        >
          {forgot && (
            <div
              onClick={() => {
                reset();
                dispatch(removeOTPSent());
                dispatch(removePhone());
                dispatch(removeStep());
                dispatch(removeOtp());
                dispatch(removeToken());
                navigate("/auth");
              }}
              className={
                "flex  font-medium flex-row cursor-pointer select-none items-center justify-end gap-2 2xl:-mb-10 mb-2"
              }
            >
              بازگشت
              <FaChevronLeft className={"fill-font-color w-4 h-4"} />
            </div>
          )}
          <div
            onClick={makeNewAccount}
            className={
              "relative w-full mb-[3.5vh] desktop:mb-0 rounded-xl " +
              "hidden sm:block p-3 select-none bg-primary shadow transition-all duration-200 delay-75 ease-out cursor-pointer " +
              (forgot && "mt-8")
            }
          >
            {/* Background Blur Layer */}
            <div className="absolute backdrop-blur-[2px]! rounded-xl z-0"></div>

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-row items-center gap-4">
              <FiUser className="w-6 h-6" />
              <div className="flex flex-row items-center gap-1">
                <span className="text-font-color font-extrabold">
                  سامانه بازدید فنی
                </span>
                {/* <span className="text-font-color font-extrabold">جدید</span> */}
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col items-center justify-center space-y-[30px] mb-[5vh]">
              <TextField
                id="outlined-required"
                dir="ltr"
                label={!forgot ? "شماره همراه" : "رمز عبور"}
                autoFocus
                inputMode="numeric"
                placeholder={
                  !forgot ? "_  _  _  _  _  _  _  _  _  _  _" : "******"
                }
                autoComplete="off"
                fullWidth
                {...register(forgot ? "password" : "username", {
                  onChange: forgot ? undefined : handleChange,
                  required: forgot
                    ? "رمز عبور الزامی است."
                    : "فیلد شماره همراه الزامی است .",
                  validate: (value) => {
                    if (!forgot) {
                      if (!+ToEnglishNumber(value as string))
                        return "فرمت شماره ورودی اشتباه است";
                      if (value?.length !== 11)
                        return "تعداد ارقام شماره ورودی اشتباه است";
                    } else if (value?.length! < 4)
                      return "رمز عبور حداقل باید ۴ کارکتر باشد.";
                  },
                })}
                error={forgot ? !!errors.password : !!errors.username}
                helperText={
                  forgot ? errors.password?.message : errors.username?.message
                }
                type={!forgot ? "text" : "password"}
                inputProps={{
                  maxLength: "11",
                  inputMode: !forgot ? "numeric" : undefined,
                }}
                InputProps={{
                  sx: {
                    borderRadius: "8px",
                    color: "theme.palette.secondary.main",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "theme.palette.secondary.main",
                    marginRight: "100px",
                  },
                }}
              />
              <TextField
                id="outlined-required"
                label={!forgot ? "رمز عبور" : "تکرار رمز عبور"}
                dir="ltr"
                placeholder="******"
                fullWidth
                {...register(forgot ? "confirmPassword" : "password", {
                  required: forgot
                    ? "فیلد تکرار رمز عبور الزامی است"
                    : "فیلد رمز عبور الزامی است",
                  validate: (value) => {
                    if (value?.length! < 4) {
                      return "رمز عبور حداقل ۴ کارکتر باید باشد";
                    }
                    if (forgot && watch("password") !== value) {
                      return "پسوورد ها یکسان نیستند";
                    }
                  },
                })}
                error={forgot ? !!errors.confirmPassword : !!errors.password}
                helperText={
                  forgot
                    ? errors.confirmPassword?.message
                    : errors.password?.message
                }
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: "8px",
                      fontWeight: "bold",
                    },
                  },
                }}
                type="password"
              />
            </div>
            {!forgot && (
              <div className="flex justify-between items-center tracking-tight w-full text-sm mr-1">
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={LockIcon}
                    className="w-[15px] md:w-[19px]"
                    width={100}
                    height={100}
                    alt="fingerPrintIcon"
                  />
                  <span className="font-bold text-nowrap">
                    رمز عبور خود را فراموش کرده‌اید؟
                  </span>
                </div>
                <button
                  onClick={() => {
                    dispatch(removeOTPSent());
                    dispatch(removePhone());
                    dispatch(removeStep());
                    dispatch(removeOtp());
                    dispatch(removeToken());
                    navigate(location.pathname + "?forgot=true");
                    props.handleChangePage(1);
                  }}
                  className="text-primary-dark text-nowrap font-bold text-sm md:text-base md:cursor-pointer underline"
                  type="button"
                >
                  بازیابی رمز عبور
                </button>
              </div>
            )}
            <p className="mt-5 font-bold text-sm md:text-base">
              اگر تا کنون ثبت نام نکرده اید میتوانید از
              <button
                className="px-2 text-primary-dark md:cursor-pointer text-lg font-bold underline"
                onClick={makeNewAccount}
                type="button"
              >
                اینجا
              </button>
              ثبت نام کنید
            </p>
          </div>
          <div className="mt-15 mb-4 bg-red-10 flex items-end justify-end py-5">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="m-auto rounded-[13px] flex justify-between pl-[20px] py-[5px] font-black text-[14px] md:text-[17pt]"
              loading={loginOrSendNewPasswordDataResult.isLoading}
            >
              <span className="m-0 p-0">ورود</span>
              <IoIosArrowRoundBack size={40} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
