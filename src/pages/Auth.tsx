import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Stores/store";
import { removeOTPSent, setStep } from "../Stores/slices/user";
import { useEffect } from "react";
import LoginUsernamePassword from "../components/Authentication/LoginUsernamePassword";
import RegisterPhone from "../components/Authentication/RegisterPhone";
import ValidatePhone from "../components/Authentication/ValidatePhone";
import AuthenticationFooter from "../components/Authentication/AuthenticationFooter";
import { useNavigate } from "react-router-dom";

const activeStyle = "block z-30";
const prevStyle = "absolute z-20 translate-y-8 scale-95 hidden 2xl:block";
const prePrevStyle = "absolute z-10 translate-y-14 scale-90 hidden 2xl:block";
const activeCardStyle = "translate-y-0";

export default function Auth() {
	const dispatch = useDispatch();
	const step = useSelector((state: RootState) => state.user.step) || 0;

	const navigate = useNavigate();

	useEffect(() => {
		if (!!localStorage.getItem("token")) navigate("/dashboard");
	}, []);

	const setStepFn = (number: 0 | 1 | 2) => {
		dispatch(setStep(number));
	};

	useEffect(() => {
		return () => {
			dispatch(removeOTPSent());
		};
	}, [dispatch]);

	return (
		<div
			id="authentication"
			className="flex flex-col items-center justify-center h-screen relative"
		>
			<div className="flex flex-col items-center gap-0 space-y-0 scale-[85%]">
				<div className={`${step === 0 ? activeStyle : step === 1 ? prevStyle : prePrevStyle}  ${activeCardStyle}`}>
					{/* بخش ورود کاربر */}
					<LoginUsernamePassword
						handleChangePage={setStepFn}
						activePage={step}
					/>
				</div>
				<div className={`${step === 1 ? activeStyle : step === 2 ? prevStyle : prePrevStyle}  ${activeCardStyle}`}>
					{/* بخش ایجاد حساب قسمت ورود شماره تلفن و ارسال درخواست otp */}
					<RegisterPhone
						handleChangePage={setStepFn}
						activePage={step}
					/>
				</div>
				<div className={`${step === 2 ? activeStyle : step === 0 ? prevStyle : prePrevStyle}  ${activeCardStyle}`}>
					{/* بخش ورود کد otp */}
					<ValidatePhone
						handleChangePage={setStepFn}
						activePage={step}
					/>
				</div>
			</div>
			<AuthenticationFooter className={"hidden md:flex"} />
		</div>
	);
}
