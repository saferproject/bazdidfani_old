import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import HomeIcon from "../../assets/images/Group 15.png";
import DownloadIcon from "../../assets/images/Group 16.png";

export default function AuthenticationFooter({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={
        "mt-[50px] justify-between font-medium text-[11pt] gap-x-[118px] " +
        className
      }
    >
      <div className="flex flex-col items-center space-y-[15px]">
        <img
          src={DownloadIcon}
          alt="homeLogo"
          className="w-[30px]"
          width={100}
          height={100}
        />
        <div className="hidden md:flex items-center justify-center">
          <p>دانلود اپلیکیشن بازدید فنی</p>
          <IoIosArrowRoundBack size={30} />
        </div>
      </div>
      <Link to="/">
        <div className="flex flex-col items-center space-y-[15px]">
          <img
            src={HomeIcon}
            alt="homeLogo"
            className="w-[30px]"
            width={100}
            height={100}
          />
          <div className="hidden md:flex items-center justify-center">
            <p>ورود به صفحه اصلی</p>
            <IoIosArrowRoundBack size={30} />
          </div>
        </div>
      </Link>
    </div>
  );
}
