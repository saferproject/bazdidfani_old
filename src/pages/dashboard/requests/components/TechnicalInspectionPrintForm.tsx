import { FaX } from "react-icons/fa6";
import { useGetTechnicalManagerInspectionItemsQuery } from "../../../../api/TechnicalManager/CheckList";
import Plate from "../../../../components/shared/DataGrid/Plate";
import { useAppSelector } from "../../../../Stores/hooks";
import { formatJalaliDate } from "../../../../utilities/DateTime";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TechnicalInspectionPrintForm() {
  const { loaderType } = useParams();

  const navigate  = useNavigate();

  const {
    company: { name: company },
    user_company: { full_name: operator },
    technical_manager: { name: inspector },
    truck: {
      first_number,
      second_number,
      third_character,
      fourth_number,
      loader_type,
      smart_number,
    },
  } = useAppSelector((state) => state.technicalInspectionPrintData);

  const {
    data: inspectionItems,
    isLoading: gettingInspectionItems,
    isSuccess,
  } = useGetTechnicalManagerInspectionItemsQuery({
    TrailerTypeCode: loaderType,
  });

  useEffect(() => {
    if (isSuccess) setTimeout(() => window.print(), 1000);
  }, [isSuccess]);

  return (
    <>
    <div className="w-full! flex flex-row gap-4 justify-start p-2">
      <FaX onClick={() => navigate(-1)} className="select-none cursor-pointer w-6 h-6 hover:bg-black/20 transiion-all text-rose-500 "/>
    </div>
    <div className="w-full h-full p-4 m-auto bg-white text-xs">
      <div className="grid grid-cols-3 grid-rows-2 gap-x-12 gap-y-1 border border-black px-4 rounded-lg mb-2">
        <div className="flex items-center gap-4">
          <p>شرکت:</p>
          <p className="font-bold">{company}</p>
        </div>
        <div className="flex items-center gap-4">
          <p>اپراتور:</p>
          <p className="font-bold">{operator}</p>
        </div>
        <div className="flex items-center gap-4">
          <p>مدیرفنی:</p>
          <p className="font-bold">{inspector}</p>
        </div>
        <div className="flex items-center gap-4 mb-1">
          <p>پلاک:</p>
          <Plate
            firstChar={first_number}
            secondChar={third_character}
            thirdChar={second_number}
            fourthChar={fourth_number}
          />
        </div>
        <div className="flex items-center gap-4">
          <p>هوشمند:</p>
          <p className="font-bold">{smart_number}</p>
        </div>
        <div className="flex items-center gap-4">
          <p>بارگیر:</p>
          <p className="font-bold">{loader_type}</p>
        </div>
      </div>
      {!gettingInspectionItems && isSuccess && (
        <div className="w-full border border-black rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 h-6">
                <th className="w-12"></th>
                <th className="text-right">عنوان</th>
                <th className="text-center min-w-32 border-x">توضیحات</th>
                <th className="text-center">سلامت</th>
              </tr>
            </thead>
            <tbody>
              {inspectionItems.data.map(
                ({ count, name, inspectorDescription }) => (
                  <tr className="border-y last:border-0 h-6">
                    <td className="text-center">{count}</td>
                    <td className="text-right">{name}</td>
                    <td className="text-center border-x">
                      {inspectorDescription}
                    </td>
                    <td className="text-center"></td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="w-full flex items-center gap-2 my-2">
        <div className="basis-1/2 border border-black rounded-lg p-2 h-24 flex flex-col justify-between">
          <p className="mb-2">
            اینجانب <b>{inspector}</b> تایید می کنم مطابقت موارد فوق با ضوابط
            قانونی مربوط به آن ، قابلیت وسیله نقلیه برای بارگیری و انجام سفر
            مورد تایید است.
          </p>
          <div className="flex justify-between">
            <p className="basis-1/2">تاریخ</p>
            <p className="basis-1/2">امضا مدیرفنی</p>
          </div>
        </div>
        <div className="basis-1/2 border border-black rounded-lg p-2 h-24 flex flex-col justify-between">
          <p>
            اینجانب <b>{inspector}</b> تعهد می دهم شرایط وسیله نقلیه جهت حمل
            مواد خطر ناک مطابق مفاد آیین نامه حمل و نقل مواد خطرناک کنترل گردید
            و مورد تایید است.
          </p>
          <div className="flex justify-between">
            <p className="basis-1/2">تاریخ</p>
            <p className="basis-1/2">امضا مدیرفنی</p>
          </div>
        </div>
      </div>
      <div className="border border-black rounded-lg p-2 h-20 flex flex-col justify-between">
        <p>
          وسیله نقلیه شماره پلاک
          <b dir="ltr" style={{ unicodeBidi: "isolate-override" }}>
            {first_number} {third_character} {second_number} - {fourth_number}
          </b>
          با شماره هوشمند <b>{smart_number}</b>
          توسط اینجانب <b>{inspector}</b> مدیرفنی شرکت <b>{company}</b> مورد
          بازدید قرار گرفت و سلامت فنی آن برای اعزام به سفر جاده ای مطابق فرم
          کنترل اجزاء فنی وسیله نقلیه عمومی قبل از انجام سفر تایید گردید.
        </p>
        <div className="flex justify-between">
          <p>تاریخ</p>
          <p className="ml-28">امضا مدیرفنی</p>
        </div>
      </div>
      <div className="border border-black rounded-lg p-2 h-20 flex flex-col items-end justify-between mt-2">
        <p className="w-full">
          در تاریخ <b>{formatJalaliDate(new Date())}</b> بازدیدهای فوق بعمل
          آورده شد و مورد تایید مدیر فنی قرار گرفت و هرگونه تغییر و اشکال
          احتمالی بعد از بازدید و بروز هر گونه حادثه جانی و مالی با مسئولیت
          مستقیم اینجانب می باشد و شرکت / موسسه حمل و نقل هیچگونه مسئولیتی
          نخواهد داشت.
        </p>
        <p className="ml-30">نام و نام خانوادگی و امضا راننده</p>
      </div>
    </div>
    </>
  );
}
