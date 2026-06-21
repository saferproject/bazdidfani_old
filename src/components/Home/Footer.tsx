import { Button, TextField } from "@mui/material";
import { FaArrowLeftLong } from "react-icons/fa6";
import { BsDownload } from "react-icons/bs";
import { FaCode } from "react-icons/fa";

export default function Footer() {
  return (
    <div
      id="footer"
      className={
        "tablet:rounded-2xl bg-[#8d99ae] flex flex-col items-stretch " +
        "text-white tablet:my-4 tablet:w-[92%] tablet:mx-auto min-w-full"
      }
    >
      <div
        className={
          "flex tablet:flex-row flex-col items-start p-10 pb-0 px-6 tablet:p-6 gap-3 tablet:pb-10"
        }
      >
        <div className={"flex flex-col gap-2 items-start shrink"}>
          <div
            className={
              "flex flex-row items-center justify-between self-stretch"
            }
          >
            <div
              className={
                "flex flex-row items-center  font-black " +
                "text-[85%] font-Yekan-Bakh desktop:text-[120%] tablet:text-[100%] relative"
              }
            >
              بازدید فنی
              <span className={"relative text-[#2ae5b8] font-Yekan-Bakh font-black px-1"}>
                قلب تپنده
              </span>
              حمل و نقل
              <div
                className={
                  "border-b-4 border-primary rounded-full w-8 h-8 absolute " +
                  "-top-10 tablet:-top-8 mb-2 right-[calc(50%-1rem)]"
                }
              ></div>
            </div>
            <Button
              className={
                "bg-transparent desktop:text-[100%] " +
                "tablet:text-[80%] tablet:hidden text-[70%] flex flex-row " +
                "tablet:gap-2 gap-1 font-Yekan-Bakh font-black -me-3"
              }
            >
              پیوستن
              <div className={"tablet:p-2 p-1 bg-[#586781] rounded-e-3xl"}>
                <FaArrowLeftLong
                  className={"tablet:w-3 tablet:h-3  fill-primary"}
                />
              </div>
            </Button>
          </div>
          <p
            className={
              "desktop:w-[350px] tablet:w-[280px] text-xs " +
              "tracking-normal font-semibold text-justify font-Yekan-Bakh leading-7"
            }
          >
            ما یک تیم قدرمتند در حوزه حمل و نقل هستیم که با تکیه بر دانش و
            تجربیات چندین ساله خود به فعالیت حوزه حمل و نقل خدمات چشمگیر ارائه
            میکنیم. برای یک هدف خاص تلاش میکنیم و بر این باوریم یکه تاز این صنعت
            بزرگ هستیم.
          </p>
          <Button
            className={
              "bg-transparent desktop:text-[100%] " +
              "tablet:text-[80%] tablet:flex hidden flex-row gap-2 font-Yekan-Bakh font-black"
            }
          >
            پیوستن به سامانه بازدید فنی
            <div className={"p-2 bg-[#586781] rounded-e-3xl"}>
              <FaArrowLeftLong className={"w-3 h-3 fill-primary"} />
            </div>
          </Button>
        </div>
        <div
          className={"self-stretch border-b border-b-[#828da2] my-4 mx-2"}
        ></div>
        <div
          className={
            "basis-1/6 border border-[#2ae5b8] mt-3 relative after:content-[''] after:-right-12 " +
            "desktop:after:-top-[0.05rem] tablet:after:-top-[0.1rem] after:bottom-0 after:w-12 after:absolute after:bg-[#2ae5b8] " +
            "after:border after:border-[#2ae5b8] hidden tablet:block"
          }
        ></div>
        <div
          className={
            "tablet:flex hidden flex-col basis-1/4 items-center gap-2  grow"
          }
        >
          <h1
            className={"font-extrabold  desktop:text-[120%] font-Yekan-Bakh tablet:text-[100%]"}
          >
            دانلود
            <span className={"text-[#2ae5b8] font-Yekan-Bakh font-extrabold"}>
              اپلیکیشن های
            </span>{" "}
            بازدید فنی
          </h1>
          <div
            className={
              "border border-black/10 rounded-2xl p-2 flex flex-row items-center justify-between gap-8 self-stretch"
            }
          >
            <div
              className={
                "font-black flex flex-col items-center font-Yekan-Bakh desktop:text-[110%] tablet:text-[95%]"
              }
            >
              اپلیکیشن مدیر فنی
              <span
                className={
                  "desktop:text-[50%] tablet:text-[55%] font-Yekan-Bakh font-medium self-start"
                }
              >
                مخصوص مدیران فنی شرکت ها
              </span>
            </div>
            <div
              className={
                "flex flex-col  font-medium items-center desktop:text-[110%] tablet:text-[90%]"
              }
            >
              ۱۲
              <span
                className={
                  "desktop:text-[60%] tablet:text-[45%] text-font-color/70 font-Yekan-Bakh font-medium"
                }
              >
                مگابایت
              </span>
            </div>
            <div
              className={
                "flex flex-col  font-medium items-center " +
                "gap-2 text-[#2ae5b8] desktop:text-[85%] font-Yekan-Bakh tablet:text-[70%]"
              }
            >
              <div className={"p-1 bg-[#2ae5b8] rounded-lg"}>
                <BsDownload
                  className={
                    "fill-black desktop:w-5 tablet:w-4 desktop:h-5 tablet:h-4"
                  }
                />
              </div>
              Download
            </div>
          </div>
          <div
            className={
              "border border-black/10 rounded-2xl p-2 flex flex-row items-center justify-between gap-8 self-stretch"
            }
          >
            <div
              className={
                "font-black flex flex-col items-center font-Yekan-Bakh desktop:text-[110%] tablet:text-[100%]"
              }
            >
              اپلیکیشن راننده
              <span
                className={
                  "desktop:text-[50%] tablet:text-[55%] font-Yekan-Bakh font-medium self-start"
                }
              >
                مخصوص تمامی رانندگان
              </span>
            </div>
            <div
              className={
                "flex flex-col items-center  font-medium desktop:text-[110%] tablet:text-[100%] ps-5"
              }
            >
              ۱۲
              <span
                className={
                  "desktop:text-[60%] tablet:text-[50%] text-font-color/70 font-Yekan-Bakh font-medium"
                }
              >
                مگابایت
              </span>
            </div>
            <div
              className={
                "flex flex-col  font-medium items-center gap-2 " +
                "text-[#2ae5b8] desktop:text-[85%] font-Yekan-Bakh tablet:text-[70%]"
              }
            >
              <div className={"p-1 bg-[#2ae5b8] rounded-lg"}>
                <BsDownload
                  className={
                    "fill-black desktop:w-5 tablet:w-4 desktop:h-5 tablet:h-4"
                  }
                />
              </div>
              Download
            </div>
          </div>
        </div>
        <div
          className={
            "basis-1/6 border border-[#2ae5b8] mt-3 hidden tablet:block"
          }
        ></div>
        <div
          className={
            "flex flex-col tablet:items-start items-stretch self-stretch tablet:self-start gap-6 grow basis-1/4"
          }
        >
          <h1
            className={
              "desktop:text-[120%] " +
              "tablet:text-[100%] text-[80%] font-extrabold " +
              " tracking-wider font-Yekan-Bakh tablet:tracking-wide"
            }
          >
            نیاز به مشاوره بیشتر دارید؟
          </h1>
          <div className={"relative self-stretch"}>
            <TextField
              placeholder={"شماره تماس خود را وارد نمایید"}
              fullWidth={true}
              className={"bg-white rounded-2xl"}
              sx={{
                "& .MuiInputBase-input": {
                  fontWeight: "bold",
                },
              }}
            />
            <Button
              className={
                "bg-[#2ae5b8] text-white text-base font-extrabold rounded-xl " +
                "absolute top-[calc(50%-16px)] left-1 p-1"
              }
            >
              ثبت
            </Button>
          </div>
          <div
            className={
              "flex tablet:flex-row flex-col-reverse justify-around gap-2 tablet:items-start items-stretch self-stretch"
            }
          >
            <div
              className={
                "flex tablet:flex-col flex-row justify-between tablet:justify-start items-center gap-2"
              }
            >
              <h1
                className={
                  " text-[80%] font-Yekan-Bakh tablet:font-extrabold font-semibold desktop:text-[115%] tablet:text-[85%] tracking-wide"
                }
              >
                پشتیبانی ایمیل
              </h1>
              <span
                className={
                  " text-[85%] tracking-wider " +
                  "desktop:text-[100%] font-Yekan-Bakh tablet:text-[80%] font-normal"
                }
              >
                Bazdidfani@safer.ir
              </span>
            </div>
            <div
              className={
                "flex tablet:flex-col flex-row justify-between tablet:justify-start items-center gap-2"
              }
            >
              <h1
                className={
                  " text-[80%] font-Yekan-Bakh tablet:font-extrabold font-semibold block tablet:hidden desktop:text-[115%] tablet:text-[85%] tracking-wide"
                }
              >
                پشتیبانی بازدید فنی
              </h1>
              <h1
                className={
                  " tablet:font-extrabold font-Yekan-Bakh font-semibold hidden tablet:block desktop:text-[115%] tablet:text-[85%] tracking-wide"
                }
              >
                پشتیبانی بازدید فنی
              </h1>
              <span
                className={
                  " font-extrabold flex flex-row-reverse desktop:text-[105%] tablet:text-[95%] text-[85%] items-center gap-2 text-[#2ae5b8]"
                }
              >
                ۰۳۱{" "}
                <span
                  className={
                    "text-white font-Yekan-Bakh font-black desktop:text-[120%] tablet:text-[100%]"
                  }
                >
                  ۹۱۰۸۱۰۷۵
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          "tablet:flex flex-row justify-between items-center bg-[#838fa3] p-2 px-5 rounded-b-2xl hidden"
        }
      >
        <div className={"flex flex-row items-center gap-2"}>
          <div className={"border-2 border-black p-1 rounded-lg"}>
            <FaCode className={"w-3 h-3 fill-black"} />
          </div>
          <h1 className={" tracking-wide font-Yekan-Bakh font-semibold text-[80%]"}>
          طراحی و توسعه در شرکت دانش بنیان سافر 
          </h1>
        </div>
      </div>
      <div
        className={
          "tablet:hidden flex flex-col items-center justify-between gap-2 p-10"
        }
      >
        <span className={" font-normal font-Yekan-Bakh text-[100%] tracking-tight"}>
          طراحی و توسعه در شرکت دانش بنیان سافر
        </span>
      </div>
    </div>
  );
}
