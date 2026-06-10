// این کامپوننت چک نشده، حتما بررسی کنیدش قبل از ارائه
// کامپوننت برای عوض کردن شماره داخل صفحه پروفایل
import { Box, Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import OTPInput from "react-otp-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToEnglishNumber, ToPersianNumber } from "../../../components/shared/Functions/ChangeNumLang";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Stores/store";
import { removeOTPSent, setOTPSent } from "../../../Stores/slices/user";
import { useSendOTPCodeOrSendEmailOrPhoneMutation } from "../../../api/Auth/OTP";
import { useEditPhoneNumberMutation } from "../../../api/Profile/Profile";

const schema = z.object({
	token: z.string({ invalid_type_error: "کد تایید فقط میتواند یک عدد چهار رقفمی باشد." }).min(1, "این فیلد الزامی است."),
	new_phone_number: z.preprocess(
		(value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
		z
			.number({ required_error: "این فیلد الزامی است.", invalid_type_error: "شماره همراه فقط باید عدد باشد." })
			.finite("شماره همراه فقط باید عدد باشد.")
			.refine((val) => String(val).length === 10, "باید 10 رقم باشد و بدون صفر آغاز شود.")
	),
});

interface IFormTypes {
	new_phone_number: number;
	token: string;
}

export default function EditNumber({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {
	const [timer, setTimer] = useState<number>(0);
	const [timerSat, setTimerSat] = useState(false);

	const OTPSent = useSelector((state: RootState) => state.user.OTPSent);
	const phone = useSelector((state: RootState) => state.user.personal.phone);

	const dispatch = useDispatch();

	const {
		watch,
		formState: { errors },
		setValue,
		register,
		handleSubmit,
	} = useForm({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const [sendOTPCodeFn, sendOTPCodeResult] = useSendOTPCodeOrSendEmailOrPhoneMutation();

	const [editPhoneNumberFn, editPhonenumberResult] = useEditPhoneNumberMutation();

	useEffect(() => {
		if (editPhonenumberResult.isSuccess) setOpen(false);
	}, [editPhonenumberResult]);

	useEffect(() => {
		if (sendOTPCodeResult.isSuccess) {
			dispatch(setOTPSent(new Date().toISOString()));
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

	const handleResendOTP = useCallback(() => {
		sendOTPCodeFn({
			phone: ToEnglishNumber(String(phone)),
			type: "otp",
			check: 0,
		});
	}, [watch(), sendOTPCodeFn]);

	useEffect(() => {
		if (OTPSent) {
			const timedelta = Date.now() - Date.parse(OTPSent);
			if (timedelta / 1000 > 120) {
				dispatch(removeOTPSent());
				handleResendOTP();
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
		} else {
			handleResendOTP();
		}
	}, [phone, OTPSent, dispatch]);

	const handleChange = async (otp: string) => {
		const persianOtp = ToEnglishNumber(otp);
		setValue("token", persianOtp);
	};

	const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		let newValue = "";
		for (const c of value) if (/^[0-9]/g.test(c)) newValue += c;
		newValue = newValue.slice(0, 10);
		setValue("new_phone_number", Number(newValue));
	};

	const onSubmit = (data: IFormTypes) => {
		editPhoneNumberFn({
			...data,
			new_phone_number: "0" + data.new_phone_number,
		});
	};

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
		>
			<Box className="flex flex-col p-4 gap-4">
				<IoClose
					onClick={() => setOpen(false)}
					className="w-6 h-6 -mt-2 -ms-2"
				/>
				<Typography
					component={"h1"}
					className="px-4"
				>
					برای تعویض شماره موبایل، کد تایید ارسال شده به شماره فعلی را وارد کنید:
				</Typography>
				<Stack
					direction={"column"}
					className="gap-4"
				>
					<OTPInput
						onChange={handleChange}
						value={watch("token") || ""}
						numInputs={4}
						shouldAutoFocus={true}
						renderInput={(props, index) => (
							<input
								{...props}
								id={`otp-${index}`}
								type="tel"
								className={`border-b border-black text-[22.5pt]  w-[40px] md:w-[50px] h-[42px] md:h-[52px] outline-hidden focus:border-primary-dark text-center`}
							/>
						)}
						containerStyle="flex flex-row-reverse gap-x-5 justify-evenly items-start"
					/>
					{errors?.token && <Typography className="text-red-600">{errors.token?.message}</Typography>}
					<div className="flex flex-col justify-center items-center gap-y-[10px]">
						{timer === 0 ? (
							<Button
								onClick={handleResendOTP}
								loading={sendOTPCodeResult.isLoading}
								className="underline font-medium  text-[8pt] md:text-[11pt]"
							>
								درخواست مجدد کد
							</Button>
						) : (
							<p className="font-medium  text-[8pt] md:text-[11pt]">ارسال مجدد کد بعد از {ToPersianNumber(timer.toString())} ثانیه</p>
						)}
					</div>
				</Stack>
				<Stack
					className="mt-10"
					direction={"column"}
				>
					<TextField
						id="outlined-required"
						label={"شماره همراه جدید"}
						autoFocus
						error={!!errors.new_phone_number}
						helperText={errors?.new_phone_number?.message?.toString() ?? "بدون صفر آغاز شود."}
						fullWidth
						type="text"
						className={""}
						{...register("new_phone_number", {
							onChange: handleChangeInput,
							required: "فیلد شماره همراه الزامی است",
							validate: (value) => {
								if (!+ToEnglishNumber(String(value))) {
									return "فرمت شماره ورودی اشتباه است";
								}
								if (String(value).length !== 11) {
									return "تعداد ارقام شماره ورودی اشتباه است";
								}
							},
						})}
						sx={{
							"& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
								display: "none",
							},
						}}
						InputProps={{
							sx: {
								borderRadius: "13px",
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
				</Stack>
				<Button
					onClick={() => handleSubmit(onSubmit)()}
					className="self-center"
					color="primary"
					variant="contained"
					loading={editPhonenumberResult.isLoading}
				>
					تایید و ارسال
				</Button>
			</Box>
		</Dialog>
	);
}
