import { useState, MouseEvent } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import BackgroundHeader from "../../assets/images/BackgroundHeaderLanding.png";
import { GiHamburgerMenu } from "react-icons/gi";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  );
  const [openMenu, setOpenMenu] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate()

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={
          "flex flex-row items-center justify-between w-[80%] mx-auto p-2 tablet:p-0"
        }
      >
        <div
          className={
            "desktop:text-[80%] tablet:text-[73%] tablet:flex hidden flex-row gap-4 text-font-color"
          }
        >
          <Link to={"/"} className={" font-bold select-none"}>
            صفحه اصلی
          </Link>
          <a href={"#footer"} className={" font-bold select-none"}>
            تماس با ما
          </a>
          <a href={"#footer"} className={" font-bold select-none"}>
            درباره ما
          </a>
          <Button
            id="basic-button"
            className={
              "p-0 text-font-color text-[90%] flex flex-row items-center gap-1 font-bold"
            }
            aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            ref={anchorEl}
          >
            دانلود اپلیکیشن ها
            <div
              className={
                "w-5 h-5 bg-[#09bc8a] rounded-full flex flex-row items-center justify-center rounded-tr-none"
              }
            >
              <FaChevronDown className={"fill-black text-[90%]"} />
            </div>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "20px",
                shadowColor: "#000000",
                shadowSize: "5px",
                marginTop: "10px",
                marginLeft: "5px",
              },
            }}
          >
            <MenuItem
              onClick={handleClose}
              className={
                "text-[80%]  font-normal text-font-color relative after:content-[''] after:absolute " +
                "after:left-6 after:right-6 after:bottom-0 after:h-0.5 " +
                "after:bg-[#eceff3] hover:text-[#09bc8a] transition-all duration-150 ease-in"
              }
            >
              اپلیکیشن راننده
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              className={
                "text-[80%]  font-normal text-font-color relative after:absolute after:content-[''] after:h-0.5 " +
                "after:bottom-0 after:left-6 transition-all duration-150 ease-in " +
                "after:right-6 after:bg-[#eceff3] hover:text-[#09bc8a]"
              }
            >
              اپلیکیشن مدیر فنی
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              className={
                "text-[80%]  font-normal text-font-color hover:text-[#09bc8a] transition-all duration-150 ease-in"
              }
            >
              اپلیکیشن شرکت حمل و نقل
            </MenuItem>
          </Menu>
        </div>
        <GiHamburgerMenu
          className={
            "fill-font-color w-8 h-8 " + "block tablet:hidden cursor-pointer"
          }
          onClick={() => setOpenMenu(true)}
        />
        <h1
          className={
            "block tablet:hidden text-[150%] text-center pt-2  font-black self-end"
          }
        >
          بازدید فنی
        </h1>
        <Drawer
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          className={"text-[130%]"}
          sx={{
            "& .MuiPaper-root": {
              padding: "1rem",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "stretch",
            },
          }}
        >
          <IoClose
            className={"cursor-pointer w-8 h-8 fill-font-color"}
            onClick={() => setOpenMenu(false)}
          />
          <Link
            onClick={() => setOpenMenu(false)}
            to={!!localStorage.getItem("token") ? "/dashboard" : "/auth"}
            className={
              " font-bold select-none after:content-[''] " +
              "after:-bottom-2 after:right-0 after:absolute relative after:left-20 after:bg-[#eceff3] " +
              "after:h-0.5 hover:text-[#09bc8a] hover:after:bg-[#09bc8a] transition-all duration-200 " +
              "ease-in after:transition-all after:duration-200 after:ease-in"
            }
          >
            ورود به {!!localStorage.getItem("token") ? "داشبورد" : "سامانه"}
          </Link>
          <Link
            onClick={() => setOpenMenu(false)}
            to={"/"}
            className={
              " font-bold select-none after:content-[''] " +
              "after:-bottom-2 after:right-0 after:absolute relative after:left-20 after:bg-[#eceff3] " +
              "after:h-0.5 hover:text-[#09bc8a] hover:after:bg-[#09bc8a] transition-all duration-200 " +
              "ease-in after:transition-all after:duration-200 after:ease-in"
            }
          >
            صفحه اصلی
          </Link>
          <a
            onClick={() => setOpenMenu(false)}
            href={"#footer"}
            className={
              " font-bold select-none after:content-[''] " +
              "after:-bottom-2 after:right-0 after:absolute relative after:left-20 after:bg-[#eceff3] " +
              "after:h-0.5 hover:text-[#09bc8a] hover:after:bg-[#09bc8a] transition-all duration-200 " +
              "ease-in after:transition-all after:duration-200 after:ease-in"
            }
          >
            تماس با ما
          </a>
          <a
            onClick={() => setOpenMenu(false)}
            href={"#footer"}
            className={
              " font-bold select-none after:content-[''] " +
              "after:-bottom-2 after:right-0 after:absolute relative after:left-20 after:bg-[#eceff3] " +
              "after:h-0.5 hover:text-[#09bc8a] hover:after:bg-[#09bc8a] transition-all duration-200 " +
              "ease-in after:transition-all after:duration-200 after:ease-in"
            }
          >
            درباره ما
          </a>
          <Accordion className={"shadow-none p-0 m-0"}>
            <AccordionSummary
              expandIcon={
                <div
                  className={
                    "w-8 h-8 bg-[#09bc8a] rounded-full flex flex-row items-center justify-center rounded-tr-none"
                  }
                >
                  <FaChevronDown className={"fill-black text-[120%]"} />
                </div>
              }
              aria-controls={"navbar-content"}
              id={"navbar-header"}
              className={
                "p-0 m-0 flex flex-row justify-start items-center gap-2 min-h-4"
              }
            >
              <Typography
                className={"p-0 text-font-color text-[90%] " + " font-bold"}
              >
                دانلود اپلیکیشن ها
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={"flex flex-col gap-3 p-0 m-0 w-full"}>
              <span
                className={
                  " font-normal " +
                  "text-font-color cursor-pointer relative after:content-[''] after:absolute " +
                  "after:left-6 after:right-0 after:-bottom-1 after:h-0.5 " +
                  "after:bg-[#eceff3] hover:text-[#09bc8a] transition-all duration-150 ease-in"
                }
              >
                اپلیکیشن راننده
              </span>
              <span
                className={
                  " font-normal " +
                  "text-font-color cursor-pointer relative after:absolute after:content-[''] after:h-0.5 " +
                  "after:-bottom-1 after:left-6 transition-all duration-150 ease-in " +
                  "after:right-0 after:bg-[#eceff3] hover:text-[#09bc8a]"
                }
              >
                اپلیکیشن مدیر فنی
              </span>
              <span
                className={
                  " font-normal " +
                  "text-font-color cursor-pointer hover:text-[#09bc8a] transition-all duration-150 ease-in"
                }
              >
                اپلیکیشن شرکت حمل و نقل
              </span>
            </AccordionDetails>
          </Accordion>
        </Drawer>
        <div
          className={
            "desktop:text-[80%] tablet:text-[75%] tablet:flex hidden flex-row items-center gap-3"
          }
        >
          {
            !!localStorage.getItem("token") ? (
              <Button
                variant="outlined"
                className={"text-[#09bc8a] border-[#09bc8a] bg-white self-start font-medium p-3"}
                onClick={() => navigate("/dashboard")}
              >
                ورود به داشبورد
              </Button>
            ) : (
              <Button
                className={"text-white bg-[#09bc8a] self-start  font-medium p-3"}
                onClick={() => navigate("/auth")}
              >
                ورود به سامانه
              </Button>
            )
          }
          <div className={"flex flex-col gap-1  text-[#7396a8]"}>
            <span className={"font-bold tracking-normal"}>
              پشتیبانی در ۷ روز هفته
            </span>
            <a
              href="tel:03191081075"
              className={
                "flex flex-row-reverse select-none cursor-pointer font-medium items-center gap-2 desktop:text-[0.85rem] tablet:text-[0.75rem]"
              }
            >
              ۰۳۱
              <span
                className={
                  "text-[#09bc8a] desktop:text-[1.15rem] tablet:text-[1.1rem] font-extrabold"
                }
              >
                ۹۱۰۸۱۰۷۵
              </span>
            </a>
          </div>
        </div>
        <TfiHeadphoneAlt
          className={
            "fill-font-color w-8 h-8 " + "block tablet:hidden cursor-pointer"
          }
        />
      </div>
      <div
        className={
          "justify-between tablet:flex flex-row  items-end " +
          "gap-2 h-[100px] relative w-[80%] mx-auto hidden"
        }
        style={{
          backgroundImage: `url('${BackgroundHeader}')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          className={
            "flex flex-col tablet:text-[80%] desktop:text-[100%] items-start gap-2"
          }
        >
          <span className={" text-[110%] font-extrabold tracking-wide"}>
            جدیدترین های بازدید فنی
          </span>
          <span className={"font-bold "}>
            اضافه شدن امکان دریافت و صدور کد سباف به برنامه 
            <Badge className={"bg-[#09bc8a] select-none cursor-pointer font-black p-1 text-lg rounded-xl"}>
              مدیران فنی
            </Badge>
          </span>
        </div>
        <h1
          className={
            "self-start desktop:text-[250%] tablet:text-[170%] font-black mb-10 pe-16"
          }
        >
          بازدید فنی
        </h1>
        <div
          className={
            "flex flex-col tablet:text-[80%] desktop:text-[100%] items-end gap-2"
          }
        >
          <a
            href="#training"
            className={
              "text-font-color select-none cursor-pointer text-[110%] p-2 bg-[#09bc8a] rounded-xl font-extrabold"
            }
          >
            آموزش های سامانه
          </a>
          <a href="#training" className={"font-bold select-none cursor-pointer"}>
            آموزش ثبت نام شرکت های حمل و نقل در بازدید فنی
          </a>
        </div>
      </div>
    </>
  );
}
