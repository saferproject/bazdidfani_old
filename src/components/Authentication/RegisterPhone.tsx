import { useSendOTPCodeOrSendEmailOrPhoneMutation } from "../../api/Auth/OTP";
import KeyIcon from "../../assets/images/key.png";
import PhoneHandIcon from "../../assets/images/phoneHand.png";
import { removeOTPSent, setOTPSent } from "../../Stores/slices/user";
import { RootState } from "../../Stores/store";
import { PropsType } from "../../types/AuthType";
import CustomeDialog, {
  CustomDialogProps,
  EmptyCustomDialoProps,
} from "../shared/Dialog/CustomeDialog";
import { ToEnglishNumber } from "../shared/Functions/ChangeNumLang";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { Button, Checkbox, TextField } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronLeft, FaLongArrowAltDown } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

/*
*
                کاربر بازدید فنی (ما) به عنوان مالک و مدیر اپلیکیشن بازدید فنی منعقد می شود.
                مشخصات تماس کاربر موظف است شماره موبایل صحیح خود را در اپلیکیشن بازدید فنی وارد کند این شماره موبایل به منظور ثبت نام و شناسایی کاربر توسط ما استفاده میشود ما متعهد میشویم اطلاعات شخصی شما را محفوظ نگه داشته و با رعایت قوانین حریم خصوصی و مقررات مربوطه از این اطلاعات استفاده کنیم ۲
                حفظ اطلاعات راننده ما تضمین میکنیم که اطلاعات رانندگان که توسط آنها در فرآیند ثبت نام و استفاده از اپلیکیشن بازدید فنی ارائه میشود به صورت محرمانه و محفوظ نگهداری میشود. این اطلاعات شامل اسم شماره تماس آدرس و سایر اطلاعات مربوط به راننده ها میباشد. مسئولیت کاربر کاربر موظف است اطلاعات شخصی خود را به صراحت و به درستی در اپلیکیشن بازدید فنی وارد کند کاربر مسئولیت کاملی در قبال صحت و صحیت اطلاعات خود وارد شده در اپلیکیشن میپذیرد. هرگونه اطلاعات نادرست ناقص یا تقلبی ممکن است منجر به عواقب قانونی شود. ۴
                . مسئولیت ما ما تلاش خواهیم کرد تا امنیت اطلاعات شخصی شما را حفظ کنیم در صورت وقوع هر گونه نقض ،امنیتی ما تلاش میکنیم تا به سرعت آن را بررسی و اصلاح کنیم ۵ تغییرات در توافق نامه ما حق داریم تا در هر زمان توافق نامه را تغییر دهیم در صورت ایجاد تغییرات مهم در توافق نامه ما شما را از طریق ایمیل یا اعلان در اپلیکیشن مطلع خواهیم کرد با ادامه استفاده از اپلیکیشن بازدید فنی پس از ارسال این اطلاعیه شما می پذیرید که تغییرات اعمال شده در توافق نامه را قبول کرده اید
                .۶ قوانین و مقررات محلی شما موظفید از استفاده قانونی از اپلیکیشن بازدید فنی اطمینان حاصل کنید و همه قوانین و مقررات محلی مربوطه را رعایت کنید شما مسئولیت کاملی در قبال همه عملکردها، تراکنش ها و استفاده های خود از اپلیکیشن بازدید فنی دارید
                .۷ قرارداد مستقل این توافق نامه قرارداد مستقلی است و هیچ گونه رابطه ای از نوع مشتری فروشنده یا کارفرما کارمند بین شما و ما ایجاد نمیکند . احراز هویت در اعلام بارهای پایانه های فیزیکی (الف) کاربر موافقت میکند که در صورت تمایل به شرکت در فرآیند اعلام بارهای پایانه های فیزیکی باید احراز هویت کند. برای احراز هویت کاربر موظف است تصاویر کارت ملی و کارت هوشمند خود را به ما ارسال کند. (ب) کاربر تأیید میکند که تصاویر ارسالی کارت ملی و کارت هوشمند صحیح و معتبر هستند و به طور قانونی به او تعلق دارند همچنین کاربر موافق است که ما مجاز به استفاده از این تصاویر جهت احراز هویت و تأیید هویت او باشیم. (ج) ما تضمین میکنیم که از تصاویر ارسالی کاربر به منظور احراز هویت استفاده خواهیم کرد و این تصاویر را به صورت محرمانه و محفوظ نگه خواهیم داشت. ما اطلاعات شخصی شما را با رعایت قوانین حریم خصوصی و مقررات مربوطه محافظت خواهیم کرد (د هرگونه تقلب یا ارائه اطلاعات نادرست در فرآیند احراز هویت میتواند منجر به تعلیق یا لغو حساب کاربری شود. کاربر مسئولیت کاملی در قبال صحت و صحیت اطلاعات ارائه شده در فرآیند احراز هویت دارد. کاربر و بازدید فنی (ما) به عنوان مالک و مدیر اپلیکیسن بازدید فنی منعقد می شود. ا مشخصات تماس کاربر موظف است شماره موبایل صحیح خود را در اپلیکیشن بازدید فنی وارد کند این شماره موبایل به منظور ثبت نام و شناسایی کاربر توسط ما استفاده میشود ما متعهد میشویم اطلاعات شخصی شما را محفوظ نگه داشته و با رعایت قوانین حریم خصوصی و مقررات مربوطه از این اطلاعات استفاده کنیم ۲ حفظ اطلاعات راننده ما تضمین میکنیم که اطلاعات رانندگان که توسط آنها در فرآیند ثبت نام و استفاده از اپلیکیشن بازدید فنی ارائه میشود به صورت محرمانه و محفوظ نگهداری میشود. این اطلاعات شامل اسم شماره تماس آدرس و سایر اطلاعات مربوط به راننده ها میباشد. مسئولیت کاربر کاربر موظف است اطلاعات شخصی خود را به صراحت و به درستی در اپلیکیشن بازدید فنی وارد کند کاربر مسئولیت کاملی در قبال صحت و صحیت اطلاعات خود وارد شده در اپلیکیشن میپذیرد. هرگونه اطلاعات نادرست ناقص یا تقلبی ممکن است منجر به عواقب قانونی شود. ۴. مسئولیت ما ما تلاش خواهیم کرد تا امنیت اطلاعات شخصی شما را حفظ کنیم در صورت وقوع هر گونه نقض ،امنیتی ما تلاش میکنیم تا به سرعت آن را بررسی و اصلاح کنیم ۵ تغییرات در توافق نامه ما حق داریم تا در هر زمان توافق نامه را تغییر دهیم در صورت ایجاد تغییرات مهم در توافق نامه ما شما را از طریق ایمیل یا اعلان در اپلیکیشن مطلع خواهیم کرد با ادامه استفاده از اپلیکیشن بازدید فنی پس از ارسال این اطلاعیه شما می پذیرید که تغییرات اعمال شده در توافق نامه را قبول کرده اید .۶ قوانین و مقررات محلی شما موظفید از استفاده قانونی از اپلیکیشن بازدید فنی اطمینان حاصل کنید و همه قوانین و مقررات محلی مربوطه را رعایت کنید شما مسئولیت کاملی در قبال همه عملکردها، تراکنش ها و استفاده های خود از اپلیکیشن بازدید فنی دارید .۷ قرارداد مستقل این توافق نامه قرارداد مستقلی است و هیچ گونه رابطه ای از نوع مشتری فروشنده یا کارفرما کارمند بین شما و ما ایجاد نمیکند . احراز هویت در اعلام بارهای پایانه های فیزیکی (الف) کاربر موافقت میکند که در صورت تمایل به شرکت در فرآیند اعلام بارهای پایانه های فیزیکی باید احراز هویت کند. برای احراز هویت کاربر موظف است تصاویر کارت ملی و کارت هوشمند خود را به ما ارسال کند. (ب) کاربر تأیید میکند که تصاویر ارسالی کارت ملی و کارت هوشمند صحیح و معتبر هستند و به طور قانونی به او تعلق دارند همچنین کاربر موافق است که ما مجاز به استفاده از این تصاویر جهت احراز هویت و تأیید هویت او باشیم. (ج) ما تضمین میکنیم که از تصاویر ارسالی کاربر به منظور احراز هویت استفاده خواهیم کرد و این تصاویر را به صورت محرمانه و محفوظ نگه خواهیم داشت. ما اطلاعات شخصی شما را با رعایت قوانین حریم خصوصی و مقررات مربوطه محافظت خواهیم کرد (د هرگونه تقلب یا ارائه اطلاعات نادرست در فرآیند احراز هویت میتواند منجر به تعلیق یا لغو حساب کاربری شود. کاربر مسئولیت کاملی در قبال صحت و صحیت اطلاعات ارائه شده در فرآیند احراز هویت دارد.
* */

const Rules = [
  {
    id: 1,
    title: "عنوان قانون 1",
    description: "لورم لورم لورم لورم لورم لورم لورم لورم لورملورم",
    type: "driver",
  },
  {
    id: 2,
    title: "عنوان قانون 2",
    description: "لورم لورم لورم لورم لورم لورم لورم لورم لورملورم",
    type: "driver",
  },
  {
    id: 3,
    title: "عنوان قانون 3",
    description: "لورم لورم لورم لورم لورم لورم لورم لورم لورملورم",
    type: "admin",
  },
  {
    id: 4,
    title: "عنوان قانون 4",
    description: "لورم لورم لورم لورم لورم لورم لورم لورم لورملورم",
    type: "driver",
  },
  {
    id: 5,
    title: "عنوان قانون 5",
    description: "لورم لورم لورم لورم لورم لورم لورم لورم لورملورم",
    type: "driver",
  },
];

export default function RegisterPhone(props: PropsType) {
  const { handleChangePage, activePage } = props;

  const OTPSent = useSelector((state: RootState) => state.user.OTPSent);
  const dispatch = useDispatch();

  const [forgot, setForgot] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [disableSendOTP, setDisableSendOTP] = useState(true);
  const [timer, setTimer] = useState(0);

  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const [mutationFn, mutationResult] =
    useSendOTPCodeOrSendEmailOrPhoneMutation();

  // ? پس از تایید کد صفحه را عوض می کند
  useEffect(() => {
    if (OTPSent) return;
    if (mutationResult.isSuccess) {
      setDisableSendOTP(true);
      dispatch(setOTPSent(new Date().toString()));
      SweetAlertToast.fire({
        icon: "success",
        title: mutationResult.data?.message,
      });
      handleChangePage(2);
    } else if (mutationResult.isError) {
      const error = mutationResult.error as any;

      if (error?.response?.data?.data?.username) {
        setError("phone", {
          type: "serverError",
          message:
            error?.response?.data?.data?.username ||
            error?.response?.data?.message ||
            "",
        });
      } else {
        clearErrors("phone");
      }
    }
  }, [mutationResult, handleChangePage, clearErrors, setError, dispatch]);

  //// برای جلوگیری از ارسال مجدد درخواست کد که پس از 120 ثانیه دوباره کاربر میتواند درخواست دهد
  // ? برای کنترل نمایش عدد ثانیه شماره ارسال درخواست مجدد
  useEffect(() => {
    if (OTPSent && disableSendOTP) {
      const timedelta = Date.now() - Date.parse(OTPSent);
      if (timedelta / 1000 < 120) {
        setTimer(Math.floor(120 - timedelta / 1000));
        const timeInterval = setInterval(() => {
          setTimer((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timeInterval);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }
  }, [disableSendOTP, OTPSent]);

  // ? فقط اجازه می دهد عدد در شماره تلفن وارد شود
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let newValue = "";
    for (const c of value) if (/^[0-9]/g.test(c)) newValue += c;
    newValue = newValue.slice(0, 11);
    setValue("phone", newValue);
  };

  // ? برای ارسال درخواست otp چه در صورت فراموشی رمز عبور و چه در صورت ایجاد حساب شماره تلفن را می فرستد
  const handleSubmit = async () => {
    const validation = await trigger();
    if (validation) {
      if (forgot || watch("confirmTerms")) {
        mutationFn({
          type: forgot ? "phone" : "otp",
          phone: watch("phone"),
          check: 1,
          two_authentication: false,
        });
      } else {
        await SweetAlertToast.fire({
          icon: "error",
          title: "برای ادامه ثبت نام باید قوانین را تایید کنید .",
        });
      }
    }
  };

  // ? برای جلوگیری از ارسال درخواست مجدد تا 120 ثانیه
  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (activePage !== 1) return;
      if (OTPSent) {
        const timedelta = Date.now() - Date.parse(OTPSent);
        if (timedelta / 1000 > 120) {
          dispatch(removeOTPSent());
          setDisableSendOTP(false);
        } else {
          setDisableSendOTP(true);
        }
      } else {
        setDisableSendOTP(false);
      }
    }, 100);

    return () => clearInterval(timeInterval);
  }, [activePage, OTPSent, dispatch]);

  const [customDialogProps, setCustomDialogProps] = useState<CustomDialogProps>(
    { ...EmptyCustomDialoProps },
  );

  // ? برای نمایش قوانین شرکت
  const handleShowRols = () => {
    setCustomDialogProps({
      children: (
        <div className={"flex flex-col gap-2 items-start px-4"}>
          <h1 className={" font-bold text-[120%]"}>قوانین و مقررات</h1>
          <h2 className={" font-extrabold text-primary-dark text-[90%]"}>
            ما برازنده برند و هویت شما هستیم
          </h2>
          <p className={" font-medium text-[70%]"}>
            سامانه بازدید فنی از اعتبارات عالی سازمان حمل و نقل است . در همین
            راستا پیروی از قوانین و مقررات بازدید فنی امری ضروریست
          </p>
          <div className={"my-4 text-[120%] w-full"}>
            {Rules?.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  <div
                    className={
                      "flex flex-row items-center gap-4 " +
                      (item.id % 2 === 0 ? "tablet:ps-9" : "")
                    }
                  >
                    <div className={"relative text-[250%]"}>
                      <div
                        className={
                          "gradient-text text-center text-[150%] relative "
                        }
                      >
                        {item.id}
                        <div
                          className={
                            "absolute w-full h-[50%] " +
                            "bg-linear-to-b from-transparent to-white to-65% z-10 bottom-5 right-0 left-0"
                          }
                        ></div>
                      </div>
                      <div
                        className={
                          "w-3 h-3 absolute bottom-4 z-20 " +
                          (item.id === 1
                            ? "right-[calc(50%-0.5rem)] "
                            : "right-1/2 ") +
                          "rounded-full border border-primary/50 " +
                          "bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary to-75% to-white"
                        }
                      ></div>
                    </div>
                    <div className={"flex flex-col items-start gap-2"}>
                      <h1
                        className={
                          " flex flex-row items-center gap-4 text-primary-dark font-extrabold text-[80%]"
                        }
                      >
                        {item.title}
                        {item.type === "admin" && (
                          <div
                            className={
                              "flex flex-row items-center " +
                              "justify-center bg-[#ffc43c] text-font-color " +
                              "rounded-xl p-2  font-extrabold"
                            }
                          >
                            مخصوص مدیران فنی
                          </div>
                        )}
                      </h1>
                      <p className={" font-medium text-[70%]"}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.id === 2 && (
                    <div
                      className={
                        "bg-[url('../assets/images/RulesBackground.png')] " +
                        "self-stretch bg-contain h-[180px] bg-no-repeat " +
                        "tablet:flex flex-row justify-between hidden"
                      }
                    >
                      <div
                        className={
                          "flex flex-col justify-center items-start px-12"
                        }
                      >
                        <div
                          className={
                            "tracking-wide  font-black text-[110%] " +
                            "gradient-text-primary text-[120%] text-primary relative"
                          }
                        >
                          مرسی از حمایتتون
                          <div
                            className={
                              "absolute bottom-1 left-0 right-0 h-[50%] w-full " +
                              "bg-linear-to-b from-transparent to-60% to-[#30eca5] z-10"
                            }
                          ></div>
                        </div>
                        <span className={" font-black -mt-2"}>
                          تا اینجای کار شما در تیم بازدید فنی هستید
                        </span>
                      </div>
                      <Button
                        className={
                          "border border-dashed border-[#298d71] " +
                          "rounded-xl text-font-color p-2 self-center flex me-44 flex-row items-center gap-2 justify-between"
                        }
                      >
                        <span>مشاهده بیشتر قوانین</span>
                        <FaLongArrowAltDown
                          className={"w-4 h-4 fill-font-color"}
                        />
                      </Button>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ),
      hasOnClose: false,
      onClose: () => {
        setCustomDialogProps({ ...EmptyCustomDialoProps });
      },
      show: true,
      maxWidth: "lg",
      fullWidth: true,
      dialogActions: (
        <Button
          onClick={() => setCustomDialogProps({ ...EmptyCustomDialoProps })}
          className={
            "mb-4 bg-white text-font-color border p-2 rounded-2xl " +
            "border-black  font-bold w-full min-h-full rounded-2xl"
          }
        >
          تایید
        </Button>
      ),
    });
  };

  // ? اگه صفحه در حالت فراموشی رمز عبور است استیت صفحه را تنظیم کند
  useEffect(() => {
    const value = searchParams.get("forgot");
    if (value === "true") setForgot(true);
    else setForgot(false);
  }, [searchParams]);

  // ? برای بررسی لود شدن کامل صفحه
  // ! دلیل منطقی برای این کارش پیدا نکردم
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="lg:mt-[3vh] mt-[60px]">
      <CustomeDialog {...customDialogProps} />
      {/* <div className="max-w-[154px] hidden sm:flex w-[30vw] md:w-[20vw] 2xl:w-[8vw] text-center items-center justify-center h-[50px] lg:h-[55px] bg-primary-light rounded-t-[29px] mr-[33px]">
				<h1 className="font-[rokh] font-black lg:text-[1.5vw]">بازدید فنی</h1>
			</div> */}
      <div
        onClick={() => {
          navigate("/auth");
          handleChangePage(1);
        }}
        className="max-w-[154px] select-none cursor-pointer w-[30vw] 
                md:w-[20vw] 2xl:w-[8vw] text-center sm:hidden flex items-center 
                justify-center h-[50px] lg:h-[55px] bg-primary-light rounded-t-[29px] mr-[33px]"
      >
        <h1 className="font-[rokh] font-black lg:text-[1.5vw]">
          ایجاد حساب جدید
        </h1>
      </div>
      <div className="flex flex-col justify-between w-[85vw] md:w-[50vw] lg:w-[40vw] xl:w-[28vw] max-w-[490px] bg-white max-h-[540px] 2xl:h-[70vh] px-[4vw] md:px-[2vw] pt-[4vh] shadow-[0_40px_80px_0_#9ea4aa] shadowo-apacity-24 rounded-[38px]">
        <div
          onClick={() => {
            navigate("/auth");
            handleChangePage(0);
          }}
          className={
            "justify-end cursor-pointer select-none items-center flex flex-row gap-2  font-medium"
          }
        >
          بازگشت
          <FaChevronLeft className={"w-4 h-4 fill-font-color"} />
        </div>
        {forgot && (
          <div
            onClick={() => {
              navigate("/auth");
              handleChangePage(1);
            }}
            className="relative w-full my-2 rounded-4xl bg-primary/30 hover:bg-primary transition-all duration-200 
                            delay-75 ease-out hidden sm:block p-3 select-none cursor-pointer"
          >
            {/* Background Blur Layer */}
            <div className="absolute inset-0 bg-transparent backdrop-blur-[2px]! glass-effect rounded-4xl z-0"></div>

            {/* Foreground Content */}
            <div className="relative z-10 flex flex-row items-center gap-4">
              <FiUser className="w-6 h-6" />
              <div className="flex flex-row items-center gap-1 font-bold">
                بازیابی رمز عبور
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="flex justify-between mb-[1vh]"></div>
          <div className="border border-dashed px-[37px] border-secondary-light border-spacing-14 rounded-[16px] h-[98.28px] mb-[26px] flex items-center justify-center gap-x-[31px]">
            <img
              src={PhoneHandIcon}
              className="w-[37px] h-[50px]"
              width={100}
              height={100}
              alt="fingerPrintIcon"
            />
            <p className="font-medium text-xs md:text-sm text-secondary-light">
              شماره تماسی که به نام خودتان باشد را جهت احراز هویت وارد کنید -
              ارسال کد تایید به شماره ای که به نام خودتان باشد امکان پذیر است
            </p>
          </div>
          <div className="flex flex-col items-center justify-center relative space-y-[30px] mb-[5vh]">
            <TextField
              id="outlined-required"
              label={"شماره همراه"}
              autoFocus
              error={!!errors.phone}
              helperText={errors?.phone?.message?.toString()}
              fullWidth
              inputMode="numeric"
              type="text"
              onKeyDown={async (event) => {
                if (event.key === "Enter") await handleSubmit();
              }}
              className={""}
              {...register("phone", {
                onChange: handleChange,
                required: "فیلد شماره همراه الزامی است",
                validate: (value) => {
                  if (!+ToEnglishNumber(value)) {
                    return "فرمت شماره ورودی اشتباه است";
                  }
                  if (value.length !== 11) {
                    return "تعداد ارقام شماره ورودی اشتباه است";
                  }
                },
              })}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
              }}
              InputProps={{
                sx: {
                  borderRadius: "8px",
                  color: "theme.palette.secondary.main",
                  paddingInline: "0.2rem",
                },
                // startAdornment: <InputAdornment position="start">۰</InputAdornment>,
              }}
              InputLabelProps={{
                sx: {
                  color: "theme.palette.secondary.main",
                  marginRight: "100px",
                },
              }}
            />
          </div>
          <div className="flex justify-around items-end gap-12 mb-[38px] tracking-tight">
            {!forgot && (
              <>
                <div
                  className={`flex items-center justify-between ${errors.confirmTerms ? "text-red-600!" : ""}`}
                >
                  <Checkbox
                    {...register("confirmTerms", {
                      required:
                        "برای ادامه ثبت نام باید قوانین بازدید فنی را بپذیرید",
                    })}
                    icon={
                      <div
                        className={
                          "w-5 h-5 rounded-md border border-font-color"
                        }
                      ></div>
                    }
                    id="confirmTerms"
                    checkedIcon={
                      <div
                        className={
                          "w-5 h-5 rounded-md border border-font-color " +
                          "flex flex-row items-center justify-center"
                        }
                      >
                        <div
                          className={"w-[14px] h-[14px] rounded-sm bg-primary"}
                        ></div>
                      </div>
                    }
                  />
                  <label
                    className="font-bold text-sm flex flex-col gap-2 items-start"
                    htmlFor="confirmTerms"
                  >
                    قوانین بازدید فنی را پذیرا هستم
                    <span
                      className={
                        "text-[80%]  font-medium " +
                        (errors?.confirmTerms ? "block" : "hidden")
                      }
                    >
                      {errors?.confirmTerms?.message?.toString()}
                    </span>
                  </label>
                </div>
                <button
                  onClick={handleShowRols}
                  className="flex flex-col justify-center items-center gap-y-[10px]"
                >
                  <img
                    src={KeyIcon}
                    className="w-[20px] md:w-[27px] h-[20px] md:h-[27px]"
                    width={100}
                    height={100}
                    alt="fingerPrintIcon"
                  />
                  <p className="text-primary-dark cursor-pointer font-bold text-[9pt] md:text-[11pt]">
                    قوانین
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
        <Button
          loading={mutationResult.isLoading}
          disabled={disableSendOTP}
          disableRipple={disableSendOTP}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          className={
            "mb-14 rounded-[13px] flex justify-between px-[30px] py-[5px] font-black  md:text-[1.5vw] xl:text-[1vw]"
          }
        >
          <p className={"m-0 p-0 " + (disableSendOTP ? "" : "")}>
            {disableSendOTP
              ? `${Math.floor(timer / 60)}:${
                  timer - 60 * Math.floor(timer / 60) < 10
                    ? `0${timer - 60 * Math.floor(timer / 60)}`
                    : timer - 60 * Math.floor(timer / 60)
                }`
              : "درخواست کد"}
          </p>
          <IoIosArrowRoundBack size={40} />
        </Button>
      </div>
    </div>
  );
}
