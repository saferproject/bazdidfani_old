// تایپ اسکریپت به دادن وریبل سی اس اس داخل استایل گیر میده که منطقیم هست. داخل این کامپوننت همه مقدار دهیارو از چک کردن ایگنور کردم.
import { useEffect, useRef, useState } from "react";
import TruckHome from "../../assets/images/TruckHome.png";
import CheckYellow from "../../assets/images/CheckYellow.png";
import TruckLogoHome from "../../assets/images/TruckLogoHome.png";
import TrucktorHome from "../../assets/images/TrucktorHome.png";
import CloudHome from "../../assets/images/CloudHome.png";
import TruckLogoNoBackHome from "../../assets/images/TruckLogoNoBackHome.png";
import RectangleBlueHome from "../../assets/images/RectangleBlueHome.png";
import KhodEzhari from "../../assets/images/KhodEzhariIcon.png";
import HamlCo from "../../assets/images/HamlCoIcon.png";
import ExamineAdmin from "../../assets/images/ExamineAdminIcon.png";
import ExportCode from "../../assets/images/ExportCodeIcon.png";
import Bars from "../../assets/images/BarsHome.png";
import Phone from "../../assets/images/PhoneHome.png";
import Video from "../../assets/images/VideoHome.png";
import Tuka from "../../assets/images/TukaHome.png";
import Hamedanian from "../../assets/images/HamedanianHome.png";
import Fajr from "../../assets/images/FajrJahadHome.png";
import Etemad from "../../assets/images/EtemadHome.png";
import Hamgaman from "../../assets/images/HamgamanTosee.png";
import { Badge, Box, Button, Slider, styled, Typography } from "@mui/material";
import { FaPlay } from "react-icons/fa";
import { FaArrowDownLong, FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Driver from "../../assets/images/driver.gif";
import University from "../../assets/images/university.gif";
import TopFile from "../../assets/images/top-file.gif";
import TruckLeftIcon from "../../assets/images/TruckLeftIcon.png";
import TruckBottomLeftIcon from "../../assets/images/TruckBottonLeftIcon.png";
import TruckRightIcon from "../../assets/images/TruckRightIcon.png";
import TruckTopRightIcon from "../../assets/images/TruckTopRightIcon.png";
import ShabahangAzin from "../../assets/images/ShabahangAzinHome.png";
import CustomSwiper from "../UI/SwipeScroll";
import DraggableScroll from "../UI/DraggableScroll";
import { Link, Login } from "iconsax-reactjs";
import { useNavigate } from "react-router-dom";

const TinyText = styled(Typography)({
	fontSize: "0.75rem",
	fontWeight: 700,
	letterSpacing: 0.2,
});

export default function Body() {
	const [currentState, setCurrentState] = useState(2);
	const [isAnimating, setIsAnimating] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	const [amountPlayed, setAmountPlayed] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [rotation, setRotation] = useState(0);
	const startTimeRef = useRef<number | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	function formatDuration(value: number) {
		const minute = Math.floor(value / 60);
		const secondLeft = Math.floor(value - minute * 60);
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	}

	const slideItems = [
		{
			id: 1,
			content: (
				<>
					<img
						src={CheckYellow}
						alt={"Check yellow"}
						width={45}
						height={45}
					/>
					<div className={"flex flex-col items-start font-bold ms-2"}>
						<Badge className={"font-extrabold desktop:text-[100%] tablet:text-[70%]  p-1 bg-[#09bc8a] text-white rounded-xl font-Yekan-Bakh"}>راننده</Badge>
						<span className={"font-extrabold  desktop:text-[100%] tablet:text-[70%] font-Yekan-Bakh"}>خوداظهاری برای ناوگان انجام شد</span>
					</div>
				</>
			),
		},
		{
			id: 2,
			content: (
				<>
					<img
						src={CheckYellow}
						alt={"Check yellow"}
						width={45}
						height={45}
					/>
					<div className={"flex flex-col items-start font-bold ms-2"}>
						<Badge className={"font-extrabold  p-1 bg-[#09bc8a] text-white rounded-xl desktop:text-[100%] tablet:text-[70%] font-Yekan-Bakh"}>
							مدیر فنی
						</Badge>
						<span className={"font-extrabold  desktop:text-[100%] tablet:text-[70%] font-Yekan-Bakh"}>بخش کد سباف اپتیمایز شد</span>
					</div>
				</>
			),
		},
		{
			id: 3,
			content: (
				<>
					<img
						src={CheckYellow}
						alt={"Check yellow"}
						width={45}
						height={45}
					/>
					<div className={"flex flex-col items-start ms-2"}>
						<Badge className={"font-extrabold  p-1 bg-[#09bc8a] text-white rounded-xl desktop:text-[100%] tablet:text-[70%]"}>کل</Badge>
						<span className={"font-extrabold  desktop:text-[100%] tablet:text-[70%] font-Yekan-Bakh"}>اخبار جدید در راه است!</span>
					</div>
				</>
			),
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setIsAnimating(true);

			setTimeout(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % slideItems.length);
				setIsAnimating(false);
			}, 1000);
		}, 3000);

		return () => clearInterval(timer);
	}, []);

	// useEffect(() => {
	// 	const voice = new Audio();
	// 	voice.src = Voice;
	// 	voice.style.visibility = "hidden";
	// 	voice.style.position = "absolute";

	// 	setAudio(voice);
	// }, []);

	useEffect(() => {
		if (audio) {
			setInterval(() => {
				setAmountPlayed(audio?.currentTime === undefined ? 0 : audio?.currentTime);
			}, 1000);
		}
	}, [audio]);

	useEffect(() => {
		const updatePosition = (timestamp: number) => {
			if (!startTimeRef.current) startTimeRef.current = timestamp;
			const progress = timestamp - startTimeRef.current!;

			const newRotation = ((progress / (audio?.duration! * 1000)) * 360) % 360;
			setRotation(newRotation);

			if (playing) {
				animationFrameRef!.current = requestAnimationFrame(updatePosition);
			}
		};

		if (playing) {
			animationFrameRef!.current = requestAnimationFrame(updatePosition);
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [playing]);

	const navigate = useNavigate();

	const handleLoginOrSignUp = () => {
		navigate("/auth");
	};

	return (
		<div className={"flex flex-col items-stretch tablet:gap-40 gap-20 tablet:mt-28 mt-4 w-full"}>
			<div className={"flex tablet:flex-row flex-col items-center tablet:gap-40 gap-4 w-[80%] mx-auto"}>
				<div
					className={
						"relative flex flex-row items-center justify-center" + " grow basis-1/2 tablet:self-start desktop:h-[500px] tablet:h-[350px]"
					}
				>
					<img
						src={TruckHome}
						alt="Truck"
						className={"pointer-events-none tablet:w-full w-[45%] -scale-x-100"}
					/>
					<img
						src={TruckLeftIcon}
						alt={"Left Icon"}
						className={"absolute" + " tablet:-left-[30%] hidden tablet:block desktop:-left-[20%] top-[15%] animate-rotate-top-small"}
					/>
					<img
						src={TruckBottomLeftIcon}
						alt={"Bottom Left Icon"}
						className={"absolute" + " tablet:-left-[30%] hidden tablet:block desktop:-left-[20%] bottom-[15%] animate-rotate-top-small"}
					/>
					<img
						src={TruckRightIcon}
						alt={"Right Icon"}
						className={"absolute" + " tablet:-right-[20%] hidden tablet:block desktop:-right-[7%] top-1/2 animate-rotate-bottom-small"}
					/>
					<img
						src={TruckTopRightIcon}
						alt={"Top Right Icon"}
						className={"absolute" + " tablet:-right-[25%] hidden tablet:block desktop:-right-[12%] -top-[20%] animate-rotate-bottom-small"}
					/>
				</div>
				<Button
					variant="contained"
					className="lg:hidden my-4"
					startIcon={<Login />}
					onClick={handleLoginOrSignUp}
				>
					ورود یا ثبت نام
				</Button>
				<div className={"flex flex-col tablet:items-stretch items-center " + "gap-4 w-full shrink desktop:h-[500px] tablet:h-[350px]"}>
					<div className={"flex tablet:flex-row flex-col gap-4 tablet:gap-0 items-stretch justify-between"}>
						<div
							className="relative basis-[29%] bg-[#f4f2f2] min-h-24 overflow-hidden
                        rounded-lg flex flex-row items-center justify-between gap-2 custom-dash-sm
                        tablet:me-5 tablet:ms-0 tablet:my-0 mx-3 my-4 tablet:hidden"
						>
							{slideItems.map((item, index) => (
								<div
									key={item.id}
									className={`absolute top-0 left-[6%] tablet:left-[3%] desktop:left-4 w-full h-full flex items-center justify-center p-6 pe-0
                                                    transition-all duration-1000 ease-in-out transform
                                                    ${
																											index === currentIndex
																												? "opacity-100 translate-x-0"
																												: index < currentIndex || (currentIndex === 0 && index === slideItems.length - 1)
																												? "opacity-0 -translate-x-full"
																												: "opacity-0 translate-x-full"
																										}
                                                    ${isAnimating && index === currentIndex ? "opacity-0 -translate-x-full" : ""}
                                                  `}
								>
									{item.content}
								</div>
							))}
						</div>
						<div className={"flex flex-col items-center tablet:items-start gap-2"}>
							<span className={" font-bold desktop:text-[110%] font-Yekan-Bakh" + "tablet:text-[80%] text-[#8d99ae]"}>بازدید فنی ضرورت ایمن جاده ها</span>
							<span className={" font-black desktop:text-[140%] font-Yekan-Bakh " + "text-[105%] tablet:text-[110%] text-[#09bc8a]"}>
								جاده ها شریان های اصلی و حیاتی کشورند
							</span>
						</div>
						<div
							className="relative basis-[29%] bg-[#f4f2f2] min-h-24 overflow-hidden
                        rounded-lg tablet:flex flex-row items-center justify-between gap-2 custom-dash-sm
                        tablet:me-5 desktop:me-3 tablet:mx-0 tablet:ms-0 tablet:my-0 mx-3 my-4 hidden"
						>
							{slideItems.map((item, index) => (
								<div
									key={item.id}
									className={`absolute top-0 left-[calc(50%-125px)] tablet:left-5 desktop:left-4 w-full h-full flex items-center justify-center p-6 pe-0
                                                    transition-all duration-1000 ease-in-out transform
                                                    ${
																											index === currentIndex
																												? "opacity-100 translate-x-0"
																												: index < currentIndex || (currentIndex === 0 && index === slideItems.length - 1)
																												? "opacity-0 -translate-x-full"
																												: "opacity-0 translate-x-full"
																										}
                                                    ${isAnimating && index === currentIndex ? "opacity-0 -translate-x-full" : ""}
                                                  `}
								>
									{item.content}
								</div>
							))}
						</div>
					</div>
					<span
						className={
							"font-Yekan-Bakh text-center tablet:text-start " + "tablet:font-semibold font-medium leading-9 tablet:text-[75%] desktop:text-[96%]"
						}
					>
						ما به سرعت ، دقت و راحتی فکر کردیم ، ابزاری را طراحی کردیم که بتوانید بدون دغدغه بازدید فنی را انجام و کد رهگیری سباف را دریافت
						کنید. ما همیشه همراه شما هستیم.
					</span>
					<div className={"mt-auto tablet:flex flex-row gap-4 items-center justify-between me-4 hidden"}>
						<div className={"flex flex-col items-center gap-1 tablet:text-[90%] desktop:text-[120%]"}>
							<img
								src={TruckLogoHome}
								alt={"Truck logo"}
								className={"pointer-events-none"}
							/>
							<span className={"font-Yekan-Bakh font-black"}>سلامت حمل و نقل</span>
						</div>
						<div className={"flex flex-col items-center gap-1 tablet:text-[90%] desktop:text-[120%]"}>
							<img
								src={TrucktorHome}
								alt={"Truck logo"}
								className={"pointer-events-none"}
							/>
							<span className={"font-Yekan-Bakh font-black"}>سلامت خودرو ها</span>
						</div>
						<div className={"flex flex-col items-center gap-1 tablet:text-[90%] desktop:text-[120%]"}>
							<img
								src={CloudHome}
								alt={"Truck logo"}
								className={"pointer-events-none"}
							/>
							<span className={"font-Yekan-Bakh font-black"}>استفاده از هوای پاک</span>
						</div>
						<div className={"flex flex-col items-center gap-1 tablet:text-[90%] desktop:text-[120%]"}>
							<img
								src={TruckLogoNoBackHome}
								alt={"Truck logo"}
								className={"pointer-events-none"}
							/>
							<span className={"font-Yekan-Bakh font-black"}>امنیت جاده ها</span>
						</div>
					</div>
				</div>
			</div>
			<div className={"flex flex-col tablet:items-start items-center " + "desktop:gap-1 relative w-[90%] ms-0 ps-[10%]"}>
				<img
					src={RectangleBlueHome}
					alt={"Rectangle"}
					className={"absolute pointer-events-none -right-14 w-[80%] h-[90%] tablet:w-[48%] tablet:h-[110%] -z-10"}
				/>
				<h2 className={" hidden tablet:block font-black tracking-wide text-white p-4 pt-8 tablet:text-[120%] desktop:text-[160%] font-Yekan-Bakh"}>
					خدمات سامانه بازدید فنی
				</h2>
				<div
					className={"self-stretch flex flex-row items-center tablet:items-stretch " + "justify-center tablet:justify-between gap-8 w-full"}
				>
					<div className={"hidden tablet:flex flex-col items-start gap-2 basis-[62%] self-center"}>
						<span className={"text-white desktop:text-[120%] tablet:text-[100%]  font-extrabold tracking-wide mb-2 font-Yekan-Bakh"}>
							بی دغدغه بازدید فنی را انتخاب کنید
						</span>
						<p className={"desktop:text-[80%] tablet:text-[60%] text-justify font-bold leading-6 pe-5 font-Yekan-Bakh"}>
							بازدید فنی ارائه دهنده کامل ترین خدمات حمل و نقل و ارتباط همه جانبه بین راننده، مدیران فنی و شرکت های حمل و نقل
						</p>
					</div>
					<div
						className={
							"tablet:flex hidden shadow-2xl flex-col desktop:basis-[44%] tablet:basis-[35%] items-center gap-4 p-4 bg-white rounded-3xl grow"
						}
					>
						<img
							src={KhodEzhari}
							onMouseOver={(event) => {
								event.preventDefault();
								event.currentTarget.src = Driver;
							}}
							onMouseOut={(event) => {
								event.preventDefault();
								event.currentTarget.src = KhodEzhari;
							}}
							alt={"Khod ezhari"}
							className={"desktop:w-[107px] desktop:h-[107px] tablet:w-[70px] tablet:h-[70px]"}
							draggable={false}
						/>
						<h1 className={"font-black desktop:text-[100%] tablet:text-[80%] font-Yekan-Bakh"}>ثبت خوداظهاری توسط راننده</h1>
						<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%] font-Yekan-Bakh font-bold"}>
							از راه دور بدون دغدغه فقط با چند عکس از خودرو
						</p>
						<div className={"self-end flex flex-row items-center gap-2"}>
							<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
								<span className={" font-semibold"}>مشاهده فیلم آموزشی</span>
								<div className={"self-stretch flex flex-row items-center justify-between"}>
									<span className={" font-semibold"}>۲:۰۶</span>
									<FaPlay className={"self-start"} />
								</div>
							</div>
							<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
								<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
							</div>
						</div>
					</div>
					<div
						className={
							"tablet:flex hidden shadow-2xl flex-col desktop:basis-[44%] tablet:basis-[35%] items-center gap-4 p-4 bg-white rounded-3xl grow"
						}
					>
						<img
							src={HamlCo}
							onMouseOver={(event) => {
								event.preventDefault();
								event.currentTarget.src = University;
							}}
							onMouseOut={(event) => {
								event.preventDefault();
								event.currentTarget.src = HamlCo;
							}}
							draggable={false}
							alt={"Haml co Haml co"}
							className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
						/>
						<h1 className={"font-black desktop:text-[100%] tablet:text-[80%] font-Yekan-Bakh"}>ثبت درخواست شرکت حمل و نقل</h1>
						<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%] font-Yekan-Bakh font-bold"}>
							ارسال سریع خود اظهاری راننده به مدیران فنی جهت بازدید
						</p>
						<div className={"self-end flex flex-row items-center gap-2"}>
							<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
								<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
								<div className={"self-stretch flex flex-row items-center justify-between"}>
									<span className={" font-semibold"}>۲:۰۶</span>
									<FaPlay className={"self-start"} />
								</div>
							</div>
							<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
								<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
							</div>
						</div>
					</div>
					<div
						className={
							"tablet:flex shadow-2xl hidden flex-col desktop:basis-[44%] tablet:basis-[35%] items-center gap-4 p-4 bg-white rounded-3xl grow"
						}
					>
						<img
							src={ExamineAdmin}
							className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
							draggable={false}
							alt={"Examin Admin"}
						/>
						<h1 className={"font-black desktop:text-[100%] font-Yekan-Bakh tablet:text-[80%] "}>بررسی و تایید مدیر فنی</h1>
						<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%] font-Yekan-Bakh font-bold"}>
							بازبینی و مشاهده خوداظهاری و اعلام نتیجه شرکت به راننده
						</p>
						<div className={"self-end flex flex-row items-center gap-2"}>
							<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
								<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
								<div className={"self-stretch flex flex-row items-center justify-between"}>
									<span className={" font-semibold"}>۲:۰۶</span>
									<FaPlay className={"self-start"} />
								</div>
							</div>
							<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
								<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
							</div>
						</div>
					</div>
					<div
						className={
							"tablet:flex hidden shadow-2xl flex-col desktop:basis-[44%] tablet:basis-[35%] items-center gap-4 p-4 bg-white rounded-3xl grow"
						}
					>
						<img
							src={ExportCode}
							onMouseOver={(event) => {
								event.preventDefault();
								event.currentTarget.src = TopFile;
							}}
							onMouseOut={(event) => {
								event.preventDefault();
								event.currentTarget.src = ExportCode;
							}}
							draggable={false}
							alt={"Export code"}
							className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
						/>
						<h1 className={"font-black desktop:text-[100%] tablet:text-[80%] font-Yekan-Bakh"}>صدور آن تایم کد سباف</h1>
						<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%] font-Yekan-Bakh font-bold"}>
							صدور کد سباف از واحد مربوطه و تقدیم به راننده
						</p>
						<div className={"self-end flex flex-row items-center gap-2"}>
							<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
								<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
								<div className={"self-stretch flex flex-row items-center justify-between"}>
									<span className={" font-semibold"}>۲:۰۶</span>
									<FaPlay className={"self-start"} />
								</div>
							</div>
							<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
								<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
							</div>
						</div>
					</div>
					<CustomSwiper className={"tablet:hidden shadow-2xl px-4 self-center flex flex-row mt-12 items-center justify-center"}>
						<div className={"flex   flex-col w-4/5 items-center gap-4 p-4 bg-white rounded-2xl grow"}>
							<img
								src={KhodEzhari}
								onMouseOver={(event) => {
									event.preventDefault();
									event.currentTarget.src = Driver;
								}}
								onMouseOut={(event) => {
									event.preventDefault();
									event.currentTarget.src = KhodEzhari;
								}}
								alt={"Khod ezhari"}
								className={"desktop:w-[107px] desktop:h-[107px] tablet:w-[70px] tablet:h-[70px]"}
								draggable={false}
							/>
							<h1 className={"font-black desktop:text-[100%] tablet:text-[80%] font-Yekan-Bakh"}>ثبت خوداظهاری توسط راننده</h1>
							<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%]  font-bold font-Yekan-Bakh"}>
								از راه دور بدون دغدغه فقط با چند عکس از خودرو
							</p>
							<div className={"self-end flex flex-row items-center gap-2"}>
								<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
									<span className={" font-semibold font-Yekan-Bakh"}>مشاهده فیلم آموزشی</span>
									<div className={"self-stretch flex flex-row items-center justify-between"}>
										<span className={" font-semibold"}>۲:۰۶</span>
										<FaPlay className={"self-start"} />
									</div>
								</div>
								<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
									<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
								</div>
							</div>
						</div>
						<div className={"flex  flex-col w-4/5 items-center gap-4 p-4 bg-white rounded-2xl grow"}>
							<img
								src={HamlCo}
								onMouseOver={(event) => {
									event.preventDefault();
									event.currentTarget.src = University;
								}}
								onMouseOut={(event) => {
									event.preventDefault();
									event.currentTarget.src = HamlCo;
								}}
								draggable={false}
								alt={"Haml co Haml co"}
								className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
							/>
							<h1 className={"font-black desktop:text-[100%] tablet:text-[80%] font-Yekan-Bakh"}>ثبت درخواست شرکت حمل و نقل</h1>
							<p className={"text-[#798dae] desktop:text-[90%] tablet:text-[60%] font-Yekan-Bakh font-bold"}>
								ارسال سریع خود اظهاری راننده به مدیران فنی جهت بازدید
							</p>
							<div className={"self-end flex flex-row items-center gap-2"}>
								<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
									<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
									<div className={"self-stretch flex flex-row items-center justify-between"}>
										<span className={" font-semibold"}>۲:۰۶</span>
										<FaPlay className={"self-start"} />
									</div>
								</div>
								<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
									<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
								</div>
							</div>
						</div>
						<div className={"flex flex-col w-4/5 items-center gap-4 p-4 bg-white rounded-2xl grow"}>
							<img
								src={ExamineAdmin}
								className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
								draggable={false}
								alt={"Examin Admin"}
							/>
							<h1 className={"font-black desktop:text-[100%] font-Yekan-Bakh tablet:text-[80%] "}>بررسی و تایید مدیر فنی</h1>
							<p className={"text-[#798dae] font-Yekan-Bakh desktop:text-[90%] tablet:text-[60%]  font-bold"}>
								بازبینی و مشاهده خوداظهاری و اعلام نتیجه شرکت به راننده
							</p>
							<div className={"self-end flex flex-row items-center gap-2"}>
								<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
									<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
									<div className={"self-stretch flex flex-row items-center justify-between"}>
										<span className={" font-semibold"}>۲:۰۶</span>
										<FaPlay className={"self-start"} />
									</div>
								</div>
								<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
									<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
								</div>
							</div>
						</div>
						<div className={"flex flex-col w-4/5 items-center gap-4 p-4 bg-white rounded-2xl grow"}>
							<img
								src={ExportCode}
								onMouseOver={(event) => {
									event.preventDefault();
									event.currentTarget.src = TopFile;
								}}
								onMouseOut={(event) => {
									event.preventDefault();
									event.currentTarget.src = ExportCode;
								}}
								draggable={false}
								alt={"Export code"}
								className={"desktop:w-[105px] desktop:h-[105px] tablet:w-[70px] tablet:h-[70px]"}
							/>
							<h1 className={"font-black font-Yekan-Bakh desktop:text-[100%] tablet:text-[80%] "}>صدور آن تایم کد سباف</h1>
							<p className={"text-[#798dae] font-Yekan-Bakh desktop:text-[90%] tablet:text-[60%]  font-bold"}>
								صدور کد سباف از واحد مربوطه و تقدیم به راننده
							</p>
							<div className={"self-end flex flex-row items-center gap-2"}>
								<div className={"flex flex-col items-center gap-2 desktop:text-[70%] tablet:text-[50%] text-black/60"}>
									<span className={"font-Yekan-Bakh font-semibold"}>مشاهده فیلم آموزشی</span>
									<div className={"self-stretch flex flex-row items-center justify-between"}>
										<span className={" font-semibold"}>۲:۰۶</span>
										<FaPlay className={"self-start"} />
									</div>
								</div>
								<div className={"bg-[#dae524] p-2 rounded-full rounded-tr-none"}>
									<FaArrowLeftLong className={"fill-black/70 w-4 h-4"} />
								</div>
							</div>
						</div>
					</CustomSwiper>
				</div>
				<div className={"self-stretch tablet:flex flex-row gap-2 justify-center items-center hidden mt-4"}>
					<div className={"me-36 hidden tablet:block"}></div>
					<img
						src={Bars}
						alt={"Bars"}
						className={"pointer-events-none tablet:self-start desktop:self-center tablet:block hidden"}
					/>
					<Button
						className={
							"bg-white text-[#868e96]  py-4 font-Yekan-Bakh desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center ms-24"
						}
						style={{
							boxShadow: "0 0 1px #666666",
						}}
					>
						ثبت نام و دریافت اپلیکیشن ها
						<FaArrowDownLong className={"fill-black w-3 h-3"} />
					</Button>
					<Button
						className={
							"bg-white py-4 font-Yekan-Bakh text-[#868e96] desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center"
						}
						style={{
							boxShadow: "0 0 1px #666666",
						}}
					>
						درخواست مشاوره از تیم بازدید فنی
						<FaArrowDownLong className={"fill-black w-3 h-3"} />
					</Button>
					<Button
						className={
							"bg-white text-[#868e96] py-4 px-4 gap-12 font-Yekan-Bakh desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center"
						}
						style={{
							boxShadow: "0 0 1px #666666",
						}}
					>
						مشاهده خدمات ما
						<FaArrowDownLong className={"fill-black w-3 h-3"} />
					</Button>
				</div>
				<div className={"tablet:hidden mt-12 overflow-visible"}>
					<DraggableScroll
						gap={8}
						className={"w-[107%]"}
					>
						<Button
							className={
								"bg-white shrink-0 font-Yekan-Bakh desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center"
							}
							style={{
								boxShadow: "0 0 1px #666666",
							}}
						>
							ثبت نام و دریافت اپلیکیشن ها
							<FaArrowDownLong className={"fill-black w-3 h-3"} />
						</Button>
						<Button
							className={
								"bg-white font-Yekan-Bakh shrink-0 desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center"
							}
							style={{
								boxShadow: "0 0 1px #666666",
							}}
						>
							درخواست مشاوره از تیم بازدید فنی
							<FaArrowDownLong className={"fill-black w-3 h-3"} />
						</Button>
						<Button
							className={
								"bg-white shrink-0 font-Yekan-Bakh desktop:text-[100%] tablet:text-[75%]  font-medium text-font-color/60 flex flex-row gap-3 items-center"
							}
							style={{
								boxShadow: "0 0 1px #666666",
							}}
						>
							مشاهده خدمات ما
							<FaArrowDownLong className={"fill-black w-3 h-3"} />
						</Button>
					</DraggableScroll>
				</div>
			</div>
			<div className={"flex flex-row gap-2 items-center w-[80%] mx-auto"}>
				<div className={"flex flex-col tablet:items-start items-center gap-2 grow"}>
					<h1
						className={"tablet:text-[650%] font-Yekan-Bakh hidden tablet:block desktop:text-[1040%] font-black  text-[#f4f2f2] self-center select-none"}
						style={{
							textShadow: "0 0 2px #aaaaaa",
						}}
					>
						بازدید فنی
					</h1>
					<div className={"flex flex-col gap-2 tablet:gap-0 tablet:items-start items-center tablet:text-[120%] text-[135%]"}>
						<span className={" desktop:text-[100%] tablet:text-[80%] font-black"}>
							با
							<span className={"text-[#5fe9c2] font-Yekan-Bakh  font-black"}>هزاران فکر و ایده بکر</span>
							بازدید فنی
						</span>
						<span className={" desktop:text-[100%] font-Yekan-Bakh tablet:text-[80%] font-black"}>را پیاده سازی کردیم</span>
					</div>
					<p
						className={
							" my-2 desktop:text-[100%] tablet:text-[80%] " +
							"tablet:font-semibold font-medium font-Yekan-Bakh tablet:text-justify leading-8 tablet:me-16 text-center"
						}
					>
						دغدغه همه رانندگان در کنار کسب درآمد، خواهان تردد خودرو هایی است که از سلامت حمل و نقل جاده ای برخوردار باشند. در دنیای امروز،
						ایمنی جاده ها و حفظ محیط زیست بیش از هر زمان دیگری اهمیت دارد. ما در بازدید فنی با ارائه خدمات حرفه ای و دقیق بازدید فنی خودرو
						ها، نه تنها به ایمنی و سلامت خودرو ها اهمیت میدهیم، بلکه به سهم خود در کاهش آلاینده های جوی و حفاظت از محیط زیست نیز متعهد
						هستیم.
					</p>
					<h1 className={"font-Yekan-Bakh my-1 mt-4 font-black text-[#5fe9c2] desktop:text-[130%] tablet:text-[105%] text-[150%] tracking-wide"}>
						شعار بازدید فنی
					</h1>
					<span className={"font-Yekan-Bakh my-1 desktop:text-[100%] tablet:text-[80%] tablet:font-semibold font-bold"}>
						ایمنی در جاده ها، هوای پاک در آسمان ها
					</span>
				</div>
				<img
					src={Phone}
					alt={"Phone"}
					className={"pointer-events-none hidden tablet:block desktop:w-[700px] tablet:w-[500px]"}
				/>
			</div>
			<div className={"flex flex-col tablet:items-start items-center gap-2"}>
				<div className={"flex tablet:flex-row flex-col items-center gap-4 tablet:gap-2 w-[90%] tablet:w-[80%] mx-auto"}>
					<div className={"flex flex-col tablet:items-start items-center -mt-8 tablet:my-0 gap-2 tablet:gap-1 tablet:me-10 tablet:ps-4"}>
						<span className={"font-Yekan-Bakh desktop:text-[120%] tablet:text-[100%]  font-black"}>نظرات مشتریان بازدید فنی</span>
						<span className={"text-font-color/70 desktop:text-[90%] tablet:text-[70%] font-Yekan-Bakh font-extrabold"}>اعتماد شما اعتبار رسمی ماست</span>
					</div>
					<div className={"flex flex-row items-center gap-4 tablet:gap-2"}>
				
						<Button
							className={
								"border border-[#dee2e6] py-3 px-6 desktop:text-[100%] tablet:text-[80%] font-bold " +
								(currentState === 2 ? "bg-[#29e1ae] font-Yekan-Bakh text-white" : "text-black/70 bg-white")
							}
							onClick={() => setCurrentState(2)}
							style={{
								boxShadow: "0 0 1px #dee2e6",
							}}
						>
							ویدئوها
						</Button>
						<Button
							className={
								"border border-[#dee2e6] py-3 px-6 font-Yekan-Bakh desktop:text-[100%] tablet:text-[80%] font-bold " +
								(currentState === 3 ? "bg-[#29e1ae] text-white" : "text-black/70 bg-white")
							}
							onClick={() => setCurrentState(3)}
							style={{
								boxShadow: "0 0 1px #dee2e6",
							}}
						>
							وویس
						</Button>
						<Button
							className={
								"border border-[#dee2e6] py-3 px-6 font-Yekan-Bakh desktop:text-[100%] tablet:text-[80%] font-bold " +
								(currentState === 4 ? "bg-[#29e1ae] text-white" : "text-black/70 bg-white")
							}
							onClick={() => setCurrentState(4)}
							style={{
								boxShadow: "0 0 1px #dee2e6",
							}}
						>
							تصاویر
						</Button>
					</div>
				</div>
				{currentState === 2 && (
					<>
						<DraggableScroll
							gap={16}
							className={"mt-20 p-2 hidden tablet:flex"}
						>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] tablet:w-[340px] tablet:h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] tablet:w-[340px] tablet:h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] tablet:w-[340px] tablet:h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] tablet:w-[340px] tablet:h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] tablet:w-[340px] tablet:h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
						</DraggableScroll>
						<CustomSwiper className={"mt-12 p-2 px-8 md:px-64 flex tablet:hidden"}>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] w-[340px] h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] w-[340px] h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] w-[340px] h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] w-[340px] h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
							<img
								draggable={false}
								src={Video}
								alt={"Video"}
								className={
									"hover:opacity-60 desktop:w-[395px] desktop:h-[240px] w-[340px] h-[200px]" +
									" hover:cursor-pointer transition-all duration-150 ease-in video"
								}
							/>
						</CustomSwiper>
					</>
				)}{" "}
				{currentState === 3 && (
					<>
						<div className={"tablet:flex hidden flex-row self-center justify-center w-[80%] gap-8 items-center flex-wrap mt-20"}>
							<div className={"custom-dash-md tablet:basis-[45%] desktop:basis-1/3 p-4 " + "bg-white flex flex-row justify-between"}>
								<div
									className={
										"flex flex-col items-start gap-2 relative after:absolute " +
										"after:-left-4 after:content-[''] after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
									}
								>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
								</div>
								<div className={"flex flex-row-reverse gap-4 grow"}>
									{!playing ? (
										<div
											className={
												"w-12 h-12 rounded-full self-start bg-[#00ff9f] " + "flex flex-row items-center justify-center cursor-pointer"
											}
											onClick={async () => {
												startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
												setPlaying(true);
												await audio?.play();
											}}
										>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
										</div>
									) : (
										<div
											onClick={() => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
											}}
											className={
												"w-12 h-12 rounded-full self-start bg-white border border-[#00ff9f] " +
												"flex flex-row items-center justify-center cursor-pointer relative"
											}
										>
											<div
												className={
													"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
													"absolute rounded-full top-[calc(50%-0.375rem)] " +
													"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
												}
												style={{
													transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
													// @ts-ignore
													"--duration": `${audio?.duration}s`,
												}}
											></div>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
										</div>
									)}
									<div className={"flex flex-col items-stretch self-end grow ps-12"}>
										<Slider
											aria-label="time-indicator"
											size="small"
											value={amountPlayed}
											min={0}
											step={1}
											max={audio?.duration}
											onChange={(event: Event, value: number | number[]) => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
												const newValue = audio!.duration - (value as number);
												setAmountPlayed(newValue);
												const percent = newValue / audio!.duration;
												const newRotation = percent * 360;
												setRotation(newRotation);
												startTimeRef.current = performance.now() - newValue * 1000;
												audio!.currentTime = newValue;
											}}
											onChangeCommitted={() => {
												setPlaying(true);
												audio?.play();
											}}
											dir={"ltr"}
											sx={(t) => ({
												color: "rgba(0,0,0,0.87)",
												height: 4,
												transform: "scaleX(-1)",
												"& .MuiSlider-markLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-valueLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-root": {
													direction: "ltr",
												},
												"& .MuiSlider-thumb": {
													width: 12,
													height: 12,
													transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
													backgroundColor: "#fff",
													border: "1px solid #00eb93",
													"&::before": {
														boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
													},
													"&:hover, &.Mui-focusVisible": {
														boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
														...t.applyStyles("dark", {
															boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
														}),
													},
													"&.Mui-active": {
														width: 20,
														height: 20,
														backgroundColor: "#00eb93",
													},
												},
												"& .MuiSlider-rail": {
													opacity: 0.28,
													height: "3%",
												},
												"& .MuiSlider-track": {
													backgroundColor: "#00eb93",
												},
												...t.applyStyles("dark", {
													color: "#fff",
												}),
											})}
										/>
										<Box
											className={"mt-[0.05rem]"}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												mt: -2,
											}}
										>
											<TinyText className={" opacity-35"}>{formatDuration(audio?.duration as number)}-</TinyText>
											<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
										</Box>
									</div>
								</div>
							</div>
							<div className={"custom-dash-md tablet:basis-[45%] desktop:basis-1/3 p-4 " + "bg-white flex flex-row justify-between"}>
								<div
									className={
										"flex flex-col items-start gap-2 relative after:absolute " +
										"after:-left-4 after:content-[''] after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
									}
								>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
								</div>
								<div className={"flex flex-row-reverse gap-4 grow"}>
									{!playing ? (
										<div
											className={
												"w-12 h-12 rounded-full self-start bg-[#00ff9f] " + "flex flex-row items-center justify-center cursor-pointer"
											}
											onClick={async () => {
												startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
												setPlaying(true);
												await audio?.play();
											}}
										>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
										</div>
									) : (
										<div
											onClick={() => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
											}}
											className={
												"w-12 h-12 rounded-full self-start bg-white border border-[#00ff9f] " +
												"flex flex-row items-center justify-center cursor-pointer relative"
											}
										>
											<div
												className={
													"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
													"absolute rounded-full top-[calc(50%-0.375rem)] " +
													"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
												}
												style={{
													transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
													// @ts-ignore
													"--duration": `${audio?.duration}s`,
												}}
											></div>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
										</div>
									)}
									<div className={"flex flex-col items-stretch self-end grow ps-12"}>
										<Slider
											aria-label="time-indicator"
											size="small"
											value={amountPlayed}
											min={0}
											step={1}
											max={audio?.duration}
											onChange={(event: Event, value: number | number[]) => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
												const newValue = audio!.duration - (value as number);
												setAmountPlayed(newValue);
												const percent = newValue / audio!.duration;
												const newRotation = percent * 360;
												setRotation(newRotation);
												startTimeRef.current = performance.now() - newValue * 1000;
												audio!.currentTime = newValue;
											}}
											onChangeCommitted={() => {
												setPlaying(true);
												audio?.play();
											}}
											dir={"ltr"}
											sx={(t) => ({
												color: "rgba(0,0,0,0.87)",
												height: 4,
												transform: "scaleX(-1)",
												"& .MuiSlider-markLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-valueLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-root": {
													direction: "ltr",
												},
												"& .MuiSlider-thumb": {
													width: 12,
													height: 12,
													transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
													backgroundColor: "#fff",
													border: "1px solid #00eb93",
													"&::before": {
														boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
													},
													"&:hover, &.Mui-focusVisible": {
														boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
														...t.applyStyles("dark", {
															boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
														}),
													},
													"&.Mui-active": {
														width: 20,
														height: 20,
														backgroundColor: "#00eb93",
													},
												},
												"& .MuiSlider-rail": {
													opacity: 0.28,
													height: "3%",
												},
												"& .MuiSlider-track": {
													backgroundColor: "#00eb93",
												},
												...t.applyStyles("dark", {
													color: "#fff",
												}),
											})}
										/>
										<Box
											className={"mt-[0.05rem]"}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												mt: -2,
											}}
										>
											<TinyText className={" opacity-35"}>{formatDuration(audio?.duration as number)}-</TinyText>
											<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
										</Box>
									</div>
								</div>
							</div>
							<div className={"custom-dash-md tablet:basis-[45%] desktop:basis-1/3 p-4 " + "bg-white flex flex-row justify-between"}>
								<div
									className={
										"flex flex-col items-start gap-2 relative after:absolute " +
										"after:-left-4 after:content-[''] after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
									}
								>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
								</div>
								<div className={"flex flex-row-reverse gap-4 grow"}>
									{!playing ? (
										<div
											className={
												"w-12 h-12 rounded-full self-start bg-[#00ff9f] " + "flex flex-row items-center justify-center cursor-pointer"
											}
											onClick={async () => {
												startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
												setPlaying(true);
												await audio?.play();
											}}
										>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
										</div>
									) : (
										<div
											onClick={() => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
											}}
											className={
												"w-12 h-12 rounded-full self-start bg-white border border-[#00ff9f] " +
												"flex flex-row items-center justify-center cursor-pointer relative"
											}
										>
											<div
												className={
													"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
													"absolute rounded-full top-[calc(50%-0.375rem)] " +
													"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
												}
												style={{
													transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
													// @ts-ignore
													"--duration": `${audio?.duration}s`,
												}}
											></div>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
										</div>
									)}
									<div className={"flex flex-col items-stretch self-end grow ps-12"}>
										<Slider
											aria-label="time-indicator"
											size="small"
											value={amountPlayed}
											min={0}
											step={1}
											max={audio?.duration}
											onChange={(event: Event, value: number | number[]) => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
												const newValue = audio!.duration - (value as number);
												setAmountPlayed(newValue);
												const percent = newValue / audio!.duration;
												const newRotation = percent * 360;
												setRotation(newRotation);
												startTimeRef.current = performance.now() - newValue * 1000;
												audio!.currentTime = newValue;
											}}
											onChangeCommitted={(event) => {
												setPlaying(true);
												audio?.play();
											}}
											dir={"ltr"}
											sx={(t) => ({
												color: "rgba(0,0,0,0.87)",
												height: 4,
												transform: "scaleX(-1)",
												"& .MuiSlider-markLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-valueLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-root": {
													direction: "ltr",
												},
												"& .MuiSlider-thumb": {
													width: 12,
													height: 12,
													transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
													backgroundColor: "#fff",
													border: "1px solid #00eb93",
													"&::before": {
														boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
													},
													"&:hover, &.Mui-focusVisible": {
														boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
														...t.applyStyles("dark", {
															boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
														}),
													},
													"&.Mui-active": {
														width: 20,
														height: 20,
														backgroundColor: "#00eb93",
													},
												},
												"& .MuiSlider-rail": {
													opacity: 0.28,
													height: "3%",
												},
												"& .MuiSlider-track": {
													backgroundColor: "#00eb93",
												},
												...t.applyStyles("dark", {
													color: "#fff",
												}),
											})}
										/>
										<Box
											className={"mt-[0.05rem]"}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												mt: -2,
											}}
										>
											<TinyText className={" opacity-35"}>{formatDuration(audio?.duration as number)}-</TinyText>
											<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
										</Box>
									</div>
								</div>
							</div>
							<div className={"custom-dash-md tablet:basis-[45%] desktop:basis-1/3 p-4 " + "bg-white flex flex-row justify-between"}>
								<div
									className={
										"flex flex-col items-start gap-2 relative after:absolute " +
										"after:-left-4 after:content-[''] after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
									}
								>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
									<span className={" desktop:text-[100%] tablet:text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
								</div>
								<div className={"flex flex-row-reverse gap-4 grow"}>
									{!playing ? (
										<div
											className={
												"w-12 h-12 rounded-full self-start bg-[#00ff9f] " + "flex flex-row items-center justify-center cursor-pointer"
											}
											onClick={async () => {
												startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
												setPlaying(true);
												await audio?.play();
											}}
										>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
										</div>
									) : (
										<div
											onClick={() => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
											}}
											className={
												"w-12 h-12 rounded-full self-start bg-white border border-[#00ff9f] " +
												"flex flex-row items-center justify-center cursor-pointer relative"
											}
										>
											<div
												className={
													"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
													"absolute rounded-full top-[calc(50%-0.375rem)] " +
													"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
												}
												style={{
													transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
													// @ts-ignore
													"--duration": `${audio?.duration}s`,
												}}
											></div>
											<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
										</div>
									)}
									<div className={"flex flex-col items-stretch self-end grow ps-12"}>
										<Slider
											aria-label="time-indicator"
											size="small"
											value={amountPlayed}
											min={0}
											step={1}
											max={audio?.duration}
											onChange={(event: Event, value: number | number[]) => {
												cancelAnimationFrame(animationFrameRef.current!);
												setPlaying(false);
												audio?.pause();
												const newValue = audio!.duration - (value as number);
												setAmountPlayed(newValue);
												const percent = newValue / audio!.duration;
												const newRotation = percent * 360;
												setRotation(newRotation);
												startTimeRef.current = performance.now() - newValue * 1000;
												audio!.currentTime = newValue;
											}}
											onChangeCommitted={(event) => {
												setPlaying(true);
												audio?.play();
											}}
											dir={"ltr"}
											sx={(t) => ({
												color: "rgba(0,0,0,0.87)",
												height: 4,
												transform: "scaleX(-1)",
												"& .MuiSlider-markLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-valueLabel": {
													transform: "scaleX(-1)",
												},
												"& .MuiSlider-root": {
													direction: "ltr",
												},
												"& .MuiSlider-thumb": {
													width: 12,
													height: 12,
													transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
													backgroundColor: "#fff",
													border: "1px solid #00eb93",
													"&::before": {
														boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
													},
													"&:hover, &.Mui-focusVisible": {
														boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
														...t.applyStyles("dark", {
															boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
														}),
													},
													"&.Mui-active": {
														width: 20,
														height: 20,
														backgroundColor: "#00eb93",
													},
												},
												"& .MuiSlider-rail": {
													opacity: 0.28,
													height: "3%",
												},
												"& .MuiSlider-track": {
													backgroundColor: "#00eb93",
												},
												...t.applyStyles("dark", {
													color: "#fff",
												}),
											})}
										/>
										<Box
											className={"mt-[0.05rem]"}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												mt: -2,
											}}
										>
											<TinyText className={" opacity-35"}>{formatDuration(audio?.duration as number)}-</TinyText>
											<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
										</Box>
									</div>
								</div>
							</div>
						</div>
						<div className={"overflow-visible tablet:hidden w-[90%] mx-auto"}>
							<DraggableScroll
								gap={32}
								className={"mt-20"}
							>
								<div
									className={
										"custom-dash-md min-w-[90%] tablet:basis-[45%] desktop:basis-1/3 p-5 tablet:p-4 " +
										"bg-white flex tablet:flex-row flex-col tablet:justify-between"
									}
								>
									<div
										className={
											"flex tablet:flex-col flex-row items-start tablet:justify-start " +
											"justify-center tablet:gap-2 gap-20 relative after:absolute pb-4 tablet:pb-0  " +
											"tablet:after:-left-4 after:-left-2 ps-10 tablet:ps-0 after:content-[''] " +
											"tablet:after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
										}
									>
										<span className={" desktop:text-[100%] text-[80%] font-extrabold"}>مهندس مهدی فروتن جزی</span>
										<span className={" desktop:text-[100%] text-[80%] font-semibold"}>مدیر عامل شرکت فنی مهندسی سافر</span>
									</div>
									<div
										className={
											"flex flex-col justify-center tablet:justify-start " +
											"items-center tablet:items-stretch tablet:flex-row-reverse gap-4 grow"
										}
									>
										{!playing ? (
											<div
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer"
												}
												onClick={async () => {
													startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
													setPlaying(true);
													await audio?.play();
												}}
											>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
											</div>
										) : (
											<div
												onClick={() => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
												}}
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-white border border-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer relative"
												}
											>
												<div
													className={
														"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
														"absolute rounded-full top-[calc(50%-0.375rem)] " +
														"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
													}
													style={{
														transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
														// @ts-ignore
														"--duration": `${audio?.duration}s`,
													}}
												></div>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
											</div>
										)}
										<div className={"flex flex-col items-stretch tablet:self-end self-stretch " + "grow tablet:ps-12 px-6"}>
											<Slider
												aria-label="time-indicator"
												size="small"
												value={amountPlayed}
												min={0}
												step={1}
												max={audio?.duration}
												onChange={(event: Event, value: number | number[]) => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
													const newValue = audio!.duration - (value as number);
													setAmountPlayed(newValue);
													const percent = newValue / audio!.duration;
													const newRotation = percent * 360;
													setRotation(newRotation);
													startTimeRef.current = performance.now() - newValue * 1000;
													audio!.currentTime = newValue;
												}}
												onChangeCommitted={() => {
													setPlaying(true);
													audio?.play();
												}}
												dir={"ltr"}
												sx={(t) => ({
													color: "rgba(0,0,0,0.87)",
													height: 4,
													transform: "scaleX(-1)",
													"& .MuiSlider-markLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-valueLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-root": {
														direction: "ltr",
													},
													"& .MuiSlider-thumb": {
														width: 12,
														height: 12,
														transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
														backgroundColor: "#fff",
														border: "1px solid #00eb93",
														"&::before": {
															boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
														},
														"&:hover, &.Mui-focusVisible": {
															boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
															...t.applyStyles("dark", {
																boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
															}),
														},
														"&.Mui-active": {
															width: 20,
															height: 20,
															backgroundColor: "#00eb93",
														},
													},
													"& .MuiSlider-rail": {
														opacity: 0.28,
														height: "3%",
													},
													"& .MuiSlider-track": {
														backgroundColor: "#00eb93",
													},
													...t.applyStyles("dark", {
														color: "#fff",
													}),
												})}
											/>
											<Box
												className={"mt-[0.05rem]"}
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mt: -2,
												}}
											>
												<TinyText className={" opacity-35"}>{formatDuration((audio?.duration as number) - amountPlayed)}-</TinyText>
												<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
											</Box>
										</div>
									</div>
								</div>
								<div
									className={
										"custom-dash-md min-w-[90%] tablet:basis-[45%] desktop:basis-1/3 p-5 tablet:p-4 " +
										"bg-white flex tablet:flex-row flex-col tablet:justify-between"
									}
								>
									<div
										className={
											"flex tablet:flex-col flex-row items-start tablet:justify-start " +
											"justify-center tablet:gap-2 gap-20 relative after:absolute pb-4 tablet:pb-0  " +
											"tablet:after:-left-4 after:-left-2 ps-10 tablet:ps-0 after:content-[''] " +
											"tablet:after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
										}
									>
										<span className={" desktop:text-[100%] text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
										<span className={" desktop:text-[100%] text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
									</div>
									<div
										className={
											"flex flex-col justify-center tablet:justify-start " +
											"items-center tablet:items-stretch tablet:flex-row-reverse gap-4 grow"
										}
									>
										{!playing ? (
											<div
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer"
												}
												onClick={async () => {
													startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
													setPlaying(true);
													await audio?.play();
												}}
											>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
											</div>
										) : (
											<div
												onClick={() => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
												}}
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-white border border-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer relative"
												}
											>
												<div
													className={
														"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
														"absolute rounded-full top-[calc(50%-0.375rem)] " +
														"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
													}
													style={{
														transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
														// @ts-ignore
														"--duration": `${audio?.duration}s`,
													}}
												></div>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
											</div>
										)}
										<div className={"flex flex-col items-stretch tablet:self-end self-stretch " + "grow tablet:ps-12 px-6"}>
											<Slider
												aria-label="time-indicator"
												size="small"
												value={amountPlayed}
												min={0}
												step={1}
												max={audio?.duration}
												onChange={(event: Event, value: number | number[]) => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
													const newValue = audio!.duration - (value as number);
													setAmountPlayed(newValue);
													const percent = newValue / audio!.duration;
													const newRotation = percent * 360;
													setRotation(newRotation);
													startTimeRef.current = performance.now() - newValue * 1000;
													audio!.currentTime = newValue;
												}}
												onChangeCommitted={(event) => {
													setPlaying(true);
													audio?.play();
												}}
												dir={"ltr"}
												sx={(t) => ({
													color: "rgba(0,0,0,0.87)",
													height: 4,
													transform: "scaleX(-1)",
													"& .MuiSlider-markLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-valueLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-root": {
														direction: "ltr",
													},
													"& .MuiSlider-thumb": {
														width: 12,
														height: 12,
														transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
														backgroundColor: "#fff",
														border: "1px solid #00eb93",
														"&::before": {
															boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
														},
														"&:hover, &.Mui-focusVisible": {
															boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
															...t.applyStyles("dark", {
																boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
															}),
														},
														"&.Mui-active": {
															width: 20,
															height: 20,
															backgroundColor: "#00eb93",
														},
													},
													"& .MuiSlider-rail": {
														opacity: 0.28,
														height: "3%",
													},
													"& .MuiSlider-track": {
														backgroundColor: "#00eb93",
													},
													...t.applyStyles("dark", {
														color: "#fff",
													}),
												})}
											/>
											<Box
												className={"mt-[0.05rem]"}
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mt: -2,
												}}
											>
												<TinyText className={" opacity-35"}>{formatDuration((audio?.duration as number) - amountPlayed)}-</TinyText>
												<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
											</Box>
										</div>
									</div>
								</div>
								<div
									className={
										"custom-dash-md min-w-[90%] tablet:basis-[45%] desktop:basis-1/3 p-5 tablet:p-4 " +
										"bg-white flex tablet:flex-row flex-col tablet:justify-between"
									}
								>
									<div
										className={
											"flex tablet:flex-col flex-row items-start tablet:justify-start " +
											"justify-center tablet:gap-2 gap-20 relative after:absolute pb-4 tablet:pb-0  " +
											"tablet:after:-left-4 after:-left-2 ps-10 tablet:ps-0 after:content-[''] " +
											"tablet:after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
										}
									>
										<span className={" desktop:text-[100%] text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
										<span className={" desktop:text-[100%] text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
									</div>
									<div
										className={
											"flex flex-col justify-center tablet:justify-start " +
											"items-center tablet:items-stretch tablet:flex-row-reverse gap-4 grow"
										}
									>
										{!playing ? (
											<div
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer"
												}
												onClick={async () => {
													startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
													setPlaying(true);
													await audio?.play();
												}}
											>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
											</div>
										) : (
											<div
												onClick={() => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
												}}
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-white border border-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer relative"
												}
											>
												<div
													className={
														"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
														"absolute rounded-full top-[calc(50%-0.375rem)] " +
														"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
													}
													style={{
														transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
														// @ts-ignore
														"--duration": `${audio?.duration}s`,
													}}
												></div>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
											</div>
										)}
										<div className={"flex flex-col items-stretch tablet:self-end self-stretch " + "grow tablet:ps-12 px-6"}>
											<Slider
												aria-label="time-indicator"
												size="small"
												value={amountPlayed}
												min={0}
												step={1}
												max={audio?.duration}
												onChange={(event: Event, value: number | number[], activeThumb: number) => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
													const newValue = audio!.duration - (value as number);
													setAmountPlayed(newValue);
													const percent = newValue / audio!.duration;
													const newRotation = percent * 360;
													setRotation(newRotation);
													startTimeRef.current = performance.now() - newValue * 1000;
													audio!.currentTime = newValue;
												}}
												onChangeCommitted={(event) => {
													setPlaying(true);
													audio?.play();
												}}
												dir={"ltr"}
												sx={(t) => ({
													color: "rgba(0,0,0,0.87)",
													height: 4,
													transform: "scaleX(-1)",
													"& .MuiSlider-markLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-valueLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-root": {
														direction: "ltr",
													},
													"& .MuiSlider-thumb": {
														width: 12,
														height: 12,
														transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
														backgroundColor: "#fff",
														border: "1px solid #00eb93",
														"&::before": {
															boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
														},
														"&:hover, &.Mui-focusVisible": {
															boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
															...t.applyStyles("dark", {
																boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
															}),
														},
														"&.Mui-active": {
															width: 20,
															height: 20,
															backgroundColor: "#00eb93",
														},
													},
													"& .MuiSlider-rail": {
														opacity: 0.28,
														height: "3%",
													},
													"& .MuiSlider-track": {
														backgroundColor: "#00eb93",
													},
													...t.applyStyles("dark", {
														color: "#fff",
													}),
												})}
											/>
											<Box
												className={"mt-[0.05rem]"}
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mt: -2,
												}}
											>
												<TinyText className={" opacity-35"}>{formatDuration((audio?.duration as number) - amountPlayed)}-</TinyText>
												<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
											</Box>
										</div>
									</div>
								</div>
								<div
									className={
										"custom-dash-md min-w-[90%] tablet:basis-[45%] desktop:basis-1/3 p-5 tablet:p-4 " +
										"bg-white flex tablet:flex-row flex-col tablet:justify-between"
									}
								>
									<div
										className={
											"flex tablet:flex-col flex-row items-start tablet:justify-start " +
											"justify-center tablet:gap-2 gap-20 relative after:absolute pb-4 tablet:pb-0  " +
											"tablet:after:-left-4 after:-left-2 ps-10 tablet:ps-0 after:content-[''] " +
											"tablet:after:w-0.5 after:top-1 after:bottom-1 after:bg-[#bbbbbb]"
										}
									>
										<span className={" desktop:text-[100%] text-[80%] font-extrabold font-Yekan-Bakh"}>مهندس مهدی فروتن جزی</span>
										<span className={" desktop:text-[100%] text-[80%] font-semibold font-Yekan-Bakh"}>مدیر عامل شرکت فنی مهندسی سافر</span>
									</div>
									<div
										className={
											"flex flex-col justify-center tablet:justify-start " +
											"items-center tablet:items-stretch tablet:flex-row-reverse gap-4 grow"
										}
									>
										{!playing ? (
											<div
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer"
												}
												onClick={async () => {
													startTimeRef.current! = performance.now() - (rotation * (audio?.duration! * 1000)) / 360;
													setPlaying(true);
													await audio?.play();
												}}
											>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-white"} />
											</div>
										) : (
											<div
												onClick={() => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
												}}
												className={
													"w-12 h-12 rounded-full tablet:self-start bg-white border border-[#00ff9f] " +
													"flex flex-row items-center justify-center cursor-pointer relative"
												}
											>
												<div
													className={
														"w-3 h-3 bg-white border-2 border-[#00ff9f] " +
														"absolute rounded-full top-[calc(50%-0.375rem)] " +
														"right-[calc(50%-0.375rem)] transition-opacity custom-duration"
													}
													style={{
														transform: `rotate(${rotation}deg) translateX(1.5rem) rotate(-${rotation}deg)`,
														// @ts-ignore
														"--duration": `${audio?.duration}s`,
													}}
												></div>
												<FaPlay className={"desktop:text-[120%] tablet:text-[100%] fill-[#00ff9f]"} />
											</div>
										)}
										<div className={"flex flex-col items-stretch tablet:self-end self-stretch " + "grow tablet:ps-12 px-6"}>
											<Slider
												aria-label="time-indicator"
												size="small"
												value={amountPlayed}
												min={0}
												step={1}
												max={audio?.duration}
												onChange={(event: Event, value: number | number[]) => {
													cancelAnimationFrame(animationFrameRef.current!);
													setPlaying(false);
													audio?.pause();
													const newValue = audio!.duration - (value as number);
													setAmountPlayed(newValue);
													const percent = newValue / audio!.duration;
													const newRotation = percent * 360;
													setRotation(newRotation);
													startTimeRef.current = performance.now() - newValue * 1000;
													audio!.currentTime = newValue;
												}}
												onChangeCommitted={() => {
													setPlaying(true);
													audio?.play();
												}}
												dir={"ltr"}
												sx={(t) => ({
													color: "rgba(0,0,0,0.87)",
													height: 4,
													transform: "scaleX(-1)",
													"& .MuiSlider-markLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-valueLabel": {
														transform: "scaleX(-1)",
													},
													"& .MuiSlider-root": {
														direction: "ltr",
													},
													"& .MuiSlider-thumb": {
														width: 12,
														height: 12,
														transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
														backgroundColor: "#fff",
														border: "1px solid #00eb93",
														"&::before": {
															boxShadow: "0 2px 12px 0 rgba(100,0,0,0.4)",
														},
														"&:hover, &.Mui-focusVisible": {
															boxShadow: `0px 0px 0px 8px ${"rgb(0 235 147 / 32%)"}`,
															...t.applyStyles("dark", {
																boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
															}),
														},
														"&.Mui-active": {
															width: 20,
															height: 20,
															backgroundColor: "#00eb93",
														},
													},
													"& .MuiSlider-rail": {
														opacity: 0.28,
														height: "3%",
													},
													"& .MuiSlider-track": {
														backgroundColor: "#00eb93",
													},
													...t.applyStyles("dark", {
														color: "#fff",
													}),
												})}
											/>
											<Box
												className={"mt-[0.05rem]"}
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mt: -2,
												}}
											>
												<TinyText className={" opacity-35"}>{formatDuration((audio?.duration as number) - amountPlayed)}-</TinyText>
												<TinyText className={""}>{formatDuration(amountPlayed)}</TinyText>
											</Box>
										</div>
									</div>
								</div>
							</DraggableScroll>
						</div>
					</>
				)}
			</div>
			<div className={"flex flex-col gap-1 items-stretch"}>
				<div
					className={
						"flex flex-row tablet:justify-between justify-center items-center " +
						"gap-2 tablet:ps-4 tablet:pe-40 w-[80%] mx-auto tablet:mb-9 mb-2"
					}
				>
					<h1
						className={
							"desktop:text-[130%] tablet:text-[105%] " + "text-[150%] tracking-tight tablet:tracking-normal font-Yekan-Bakh font-black text-font-color/80"
						}
					>
						مشتریان ما
					</h1>
					<h2 className={" desktop:text-[100%] " + "tablet:text-[80%] tablet:block hidden font-Yekan-Bakh font-semibold"}>
						پیوستن به سامانه بزرگ بازدید فنی
					</h2>
				</div>
				<DraggableScroll className={"tablet:p-2 tablet:gap-3 pb-4 tablet:pb-0"}>
					<img
						draggable={false}
						onClick={() => open("https://tukatrans.com")}
						src={Tuka}
						alt={"Tuka"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://hamedaniantco.ir/TCO/")}
						src={Hamedanian}
						alt={"Hamdeanian"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://fajr-jahad.com")}
						src={Fajr}
						alt={"Fajr"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://hamgaman.net")}
						src={Hamgaman}
						alt={"Hamgaman"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://etemadtarabar.com")}
						src={Etemad}
						alt={"Etemad"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://fajr-jahad.com")}
						src={ShabahangAzin}
						alt={"Fajr"}
						className={
							"hover:opacity-60 scale-[85%] rounded-[1.25rem] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"
						}
					/>
					<img
						draggable={false}
						onClick={() => open("https://fajr-jahad.com")}
						src={Fajr}
						alt={"Fajr"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
					<img
						draggable={false}
						onClick={() => open("https://fajr-jahad.com")}
						src={Tuka}
						alt={"Fajr"}
						className={"hover:opacity-60 scale-[85%] tablet:scale-100 cursor-pointer transition-all duration-150 ease-in companions"}
					/>
				</DraggableScroll>
				<div className={"self-end tablet:flex hidden fle-row gap-2 items-center desktop:pe-88 tablet:pe-68 pb-4 mt-6"}>
					<FaArrowRightLong className={"w-4 h-4"} />
					<FaArrowLeftLong className={"w-4 h-4"} />
				</div>
			</div>
		</div>
	);
}
