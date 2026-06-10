import {
  useCheckOTPMutation,
  useSendOTPCodeOrSendEmailOrPhoneMutation,
} from "../../api/Auth/OTP";
import ClockIcon from "../../assets/images/Clock.png";
import LockIcon from "../../assets/images/LockIcon.png";
import { useAppSelector } from "../../Stores/hooks";
import {
  removeOtp,
  removeOTPSent,
  removePhone,
  removeStep,
  setOTP,
  setOTPSent,
  setToken,
  setTwoAuthentication,
} from "../../Stores/slices/user";
import { RootState } from "../../Stores/store";
import { ValidatePhonePropsType } from "../../types/AuthType";
import {
  ToEnglishNumber,
  ToPersianNumber,
} from "../shared/Functions/ChangeNumLang";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaChevronLeft } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ValidatePhone(props: ValidatePhonePropsType) {
  const { activePage, handleChangePage } = props;
  const dispatch = useDispatch();
  const OTPSent = useAppSelector((state: RootState) => state.user.OTPSent);
  const twoAuthentication = useAppSelector(
    (state: RootState) => state.user.twoAuthentication,
  );
  const navigate = useNavigate();
  const [timer, setTimer] = useState<number>(0);
  const [timerSat, setTimerSat] = useState(false);
  const [searchParams] = useSearchParams();
  const [persianPhone, setPersianPhonePhone] = useState<string>("");
  const forgot = searchParams.get("forgot") === "true";

  const phone = useSelector((state: RootState) => state.user.phone) || "";

  const { watch, setValue, trigger, control } = useForm();

  const { token } = useWatch({ control });

  const [sendOTPCodeFn, sendOTPCodeResult] =
    useSendOTPCodeOrSendEmailOrPhoneMutation();

  // ? شروع تایمر برای ارسال مجدد کد به مدت 120 ثانیه
  useEffect(() => {
    if (sendOTPCodeResult.isSuccess) {
      dispatch(setOTPSent(new Date().toString()));
      SweetAlertToast.fire({
        icon: "success",
        title: sendOTPCodeResult.data?.message,
      });
      if (timerSat) return;
      setTimerSat(true);
      setTimer(120);
      const timeInterval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            setTimerSat(false);
            clearInterval(timeInterval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [sendOTPCodeResult, dispatch]);

  const [checkOtpFn, checkOtpresult] = useCheckOTPMutation();

  // ? اگر کد تایید درست بود و درخواست فراموشی رمز عبور نبود، به صفحه پروفایل هدایت می‌کند
  // ? اگر درخواست فراموشی رمز عبور بود، توکن را در رداکس ذخیره می‌کند و به صفحه لاگین هدایت می‌کند
  useEffect(() => {
    if (checkOtpresult.isSuccess) {
      if (twoAuthentication) {
        dispatch(setToken(checkOtpresult.data?.data.token));
        dispatch(removeOTPSent());
        dispatch(removeStep());
        dispatch(setTwoAuthentication(false));
        navigate("/dashboard");
      } else if (!forgot) {
        if (checkOtpresult.data?.data?.token)
          dispatch(setToken(checkOtpresult.data.data.token));
        dispatch(removeOTPSent());
        dispatch(removeStep());
        SweetAlertToast.fire({
          icon: "success",
          title: checkOtpresult.data?.message,
        });
        navigate("/dashboard/profile?register=true");
      } else {
        const verifiedOtp = ToEnglishNumber(watch("token") || "");
        if (verifiedOtp) {
          localStorage.setItem("otp", verifiedOtp);
          localStorage.setItem("token", verifiedOtp);
          dispatch(setOTP(verifiedOtp));
          dispatch(setToken(verifiedOtp));
        }
        dispatch(removeOTPSent());
        dispatch(removeStep());
        SweetAlertToast.fire({
          icon: "success",
          title: checkOtpresult.data?.message,
        });
        setValue("token", "");
        handleChangePage(0);
      }
    }
  }, [
    checkOtpresult.isSuccess,
    checkOtpresult.data,
    dispatch,
    forgot,
    handleChangePage,
    navigate,
    setValue,
    twoAuthentication,
  ]);

  // ? ارسال مجدد کد تایید
  const handleResendOTP = () => {
    if (!phone || phone === "") return;
    sendOTPCodeFn({
      phone: ToEnglishNumber(phone),
      type: forgot ? "phone" : "otp",
      check: 1,
      two_authentication: twoAuthentication,
    });
  };

  // ? اگر 120 ثانیه از زمان ارسال کد گذشته بود دوباره اجازه ارسال کد به کاربر بدهد
  useEffect(() => {
    if (activePage !== 2) return;
    if (OTPSent) {
      const timedelta = Date.now() - Date.parse(OTPSent);
      if (timedelta / 1000 > 120) {
        dispatch(removeOTPSent());
        setTimer(0);
        setTimerSat(false);
      } else {
        if (timerSat) return;
        setTimerSat(true);
        setTimer(Math.floor(120 - timedelta / 1000));
        const timeInterval = setInterval(() => {
          setTimer((prevTime) => {
            if (prevTime <= 1) {
              setTimerSat(false);
              clearInterval(timeInterval);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    } else if (!phone) {
      handleChangePage(1);
    }
  }, [activePage, forgot, handleResendOTP, phone, OTPSent, dispatch]);

  // ? تغییر کد از اعداد انگلیسی به فارسی
  const handleChange = async (otp: string) => {
    const persianOtp = ToPersianNumber(otp);
    setValue("token", persianOtp);
  };

  // ? اگر شماره تلفن خالی بود به صفحه قبل برگردد
  useEffect(() => {
    if (phone === "" && activePage === 2) handleChangePage(1);
    else setPersianPhonePhone(ToPersianNumber(phone));
  }, [phone, activePage, handleChangePage]);

  // ? اگر کد وارد شده بود و 4 رفم بود کد به سرور ارسال شود
  const handleSubmit = async () => {
    const validate = await trigger("token");

    if (validate) {
      const englishToken = ToEnglishNumber(watch("token"));
      checkOtpFn({
        token: +englishToken,
        data: ToEnglishNumber(phone),
        "forget-pass": forgot || false,
        forgot: forgot || false,
        two_authentication: twoAuthentication,
      });
    }
  };

  // ? اگر کد وارد شده بود و 4 رقم بود به صورت خودکار ارسال شود
  useEffect(() => {
    if (!token) return;
    if (activePage !== 2) return;
    if (token?.length === 4) handleSubmit();
  }, [token, activePage]);

  return (
    <div className="lg:mt-[3vh] mt-[60px]">
      <div>
        {/* <div className="max-w-[154px] w-[30vw] md:w-[20vw] lg:w-[8vw] text-center hidden sm:flex items-center justify-center h-[50px] lg:h-[55px] bg-primary-light rounded-t-[29px] mr-[33px]">
					<h1 className="font-[rokh] font-black lg:text-[1.5vw]">بازدید فنی</h1>
				</div>
				<div className="max-w-[154px] select-none cursor-pointer w-[30vw] md:w-[20vw] lg:w-[8vw] text-center flex sm:hidden items-center justify-center h-[50px] lg:h-[55px] bg-primary-light rounded-t-[29px] mr-[33px]">
					<h1 className="font-[rokh] font-black lg:text-[1.5vw]">ایجاد حساب جدید</h1>
				</div> */}
        <div className="flex flex-col justify-between w-[85vw] md:w-[50vw] lg:w-[40vw] xl:w-[28vw] max-w-[490px] bg-white max-h-[540px] 2xl:h-[70vh] px-[4vw] md:px-[2vw] pt-[4vh] shadow-[0_40px_80px_0_#9ea4aa] shadowo-apacity-24 rounded-[38px]">
          <div>
            <div
              onClick={() => {
                if (forgot) {
                  dispatch(removeOTPSent());
                  dispatch(removePhone());
                  dispatch(removeStep());
                  dispatch(removeOtp());
                  setValue("token", "");
                }
                navigate("/auth", { replace: true });
                handleChangePage(forgot ? 0 : 1);
              }}
              className="flex select-none cursor-pointer flex-row items-center justify-end gap-2  font-medium"
            >
              بازگشت
              <FaChevronLeft className={"w-4 h-4 fill-font-color"} />
            </div>
            <div
              onClick={() => {
                navigate("/auth");
                handleChangePage(1);
              }}
              className="relative my-4 w-full rounded-4xl bg-primary/30 hover:bg-primary transition-all duration-200 delay-75 ease-out hidden sm:block p-3 select-none cursor-pointer"
            >
              {/* Background Blur Layer */}
              <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]! glass-effect rounded-4xl z-0"></div>

              {/* Foreground Content */}
              <div className="relative z-10 flex flex-row items-center gap-4">
                <FiUser className="w-6 h-6" />
                <div className="flex flex-row items-center gap-1">
                  <span className=" text-font-color font-extrabold">
                    اصلاح شماره و ایجاد حساب
                  </span>
                  <span className=" text-font-color font-extrabold">جدید</span>
                </div>
              </div>
            </div>
            <div className="border border-dashed px-2 border-secondary-light border-spacing-14 rounded-[16px] h-[98.28px] mb-[26px] flex items-center justify-center gap-[12px] md:gap-[31px]">
              <img
                src={LockIcon}
                className="w-[20px] md:w-[28px] h-[19px] md:h-[27px]"
                width={100}
                height={100}
                alt="LockIcon"
              />
              <div className="flex flex-col w-[300px] h-[65px] leading-6 text-[1.5vw] md:text-[1.15vw] lg:text-[0.85vw] 2xl:text-[0.6vw] ">
                <div className="font-medium text-secondary-light max-w-full">
                  <p className="max-w-full">
                    ما یک رمز عبور موقت به شماره
                    <span className="text-primary-dark font-bold mx-1 text-[2vw] md:text-[1.6vw] lg:text-[0.9vw] 2xl:text-[0.8vw]">
                      {persianPhone}
                    </span>
                    ارسال کردیم . آن را وارد کرده تا احراز هویت شوید.
                  </p>
                </div>
                <p className="flex items-center justify-between w-full font-medium text-secondary-light">
                  شماره شما نیست ؟
                  <span
                    className="flex select-none cursor-pointer items-center jsutify-center text-black float-left"
                    onClick={() => {
                      if (forgot) {
                        dispatch(removeOTPSent());
                        dispatch(removePhone());
                        dispatch(removeStep());
                        dispatch(removeOtp());
                        setValue("token", "");
                      }
                      handleChangePage(1);
                    }}
                  >
                    ویرایش شماره
                    <IoIosArrowRoundBack size={25} />
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center self-stretch justify-center space-y-[30px] mb-[5vh]">
              <OtpInput
                onChange={handleChange}
                value={watch("token") || ""}
                numInputs={4}
                shouldAutoFocus={activePage === 2}
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
            </div>
            <div className="flex justify-around mb-[58px] tracking-tight text-secondary-light">
              <div className="flex items-center justify-center gap-x-[12px] md:gap-x-[15px]">
                <img
                  src={ClockIcon}
                  width={100}
                  height={100}
                  alt="clock"
                  className="w-[19px] md:w-[22px] h-[19px] md:h-[22px]"
                />
                <p className="font-bold text-[7pt] md:text-[9.36pt]">
                  کدی دریافت نکردید؟
                </p>
              </div>
              <div className="flex flex-col justify-center items-center gap-y-[10px]">
                {timer === 0 ? (
                  <button
                    onClick={handleResendOTP}
                    className="underline font-medium  text-[8pt] md:text-[11pt]"
                  >
                    درخواست مجدد کد
                  </button>
                ) : (
                  <p className="font-medium  text-[8pt] md:text-[11pt]">
                    ارسال مجدد کد بعد از {ToPersianNumber(timer.toString())}{" "}
                    ثانیه
                  </p>
                )}
              </div>
            </div>
            <div className=" bg-red-10 flex flex-col items-end justify-end">
              <Button
                loading={checkOtpresult.isLoading}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                className="mb-[54px] rounded-[13px] flex justify-between pl-[20px] py-[5px] font-black text-[14pt] md:text-[17pt]"
              >
                <div className="text-[10pt] md:text-[12.8pt] font-bold">
                  {forgot ? (
                    "درخواست تعویض رمز"
                  ) : (
                    <div
                      className={
                        " font-black text-[120%] flex flex-row items-center gap-3"
                      }
                    >
                      ورود
                      <span className={" font-medium text-[80%]"}>
                        به سامانه بازدید فنی
                      </span>
                    </div>
                  )}
                </div>
                <IoIosArrowRoundBack size={40} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
