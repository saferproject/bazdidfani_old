import driver from "../../../assets/images/driver.png";
import technicalManager from "../../../assets/images/technicalManager.png";
import company from "../../../assets/images/company.png";

const ROLES = [
	{
		id: 'driver',
		name: "راننده",
		description:
			"در صورتی که راننده هستید و می خواهید بازدید فنی کامیون خود را شخصا انجام دهید از طریق دکمه زیر همین الان اقدام فرمایید . در ادامه اطلاعات شما از سازمان راهداری استعلام می شود و در صورت صحت اطلاعات نقش راننده برای شما فعال خواهد شد.",
		icon: driver,
	},
	{
		id: 'technicalManager',
		name: "مدیر فنی",
		description:
			"اگر میخواهید در سامانه بازدید فنی به عنوان مدیر فنی فعال باشید از طریق دکمه زیر ثبت نام کنید . بعد از بررسی و تایید پشتیبانی شما میتوانید اقدام به عقد قرارداد با شرکت های حمل و نقل نمایید.",
		icon: technicalManager,
	},
	{
		id: 'company',
		name: "شرکت حمل و نقل",
		description:
			"اگر مدیر شرکت حمل و نقل باری یا مسافری هستید و میخواهید بازدیدهای فنی خود را در سامانه بازدید فنی مدیریت نمایید از طریق دکمه زیر اقدام به ثبت اطلاعات شرکت خود نمایید . شرکت شما بعد از استعلام از سازمان حمل و نقل فعال خواهد شد.",
		icon: company,
	},
];

export default ROLES;
