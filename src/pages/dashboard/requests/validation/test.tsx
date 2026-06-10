function test() {
  return (
		<div className="grid grid-cols-3 gap-3">
			{/* لغو شده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#DC2626] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">لغو شده</p>
				<p>سفارش لغو شده</p>
			</div>

			{/* تکمیل و ثبت شده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#2563EB] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">تکمیل و ثبت شده</p>
				<p>سفارش توسط مشتری/اپراتور تکمیل و ثبت است</p>
			</div>

			{/* آماده ارسال برای رانندگان */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#06B6D4] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">آماده ارسال برای رانندگان</p>
				<p>سفارش تسویه و ثبت نهایی شده و آماده ارسال است</p>
			</div>

			{/* ارسال شده برای رانندگان */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#4F46E5] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">ارسال شده برای رانندگان</p>
				<p>در انتظار پذیرش توسط راننده مناسب است</p>
			</div>

			{/* ماشین تخصیص داده شده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#059669] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">ماشین تخصیص داده شده</p>
				<p>ماشین به سفارش تخصیص داده شده است</p>
			</div>

			{/* شروع سفارش توسط راننده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#65A30D] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">شروع سفارش توسط راننده</p>
				<p>راننده فرایند انجام سفارش را شروع کرده است</p>
			</div>

			{/* دریافت اقلام فروشگاهی سفارش */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#9333EA] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">دریافت اقلام فروشگاهی سفارش</p>
				<p>اقلام از فروشگاه دریافت شده است</p>
			</div>

			{/* در مبدا */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#6D28D9] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">در مبدا</p>
				<p>راننده/کارگر به مبدا رسیده است</p>
			</div>

			{/* شروع کار در مبدا */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#EAB308] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">شروع کار در مبدا</p>
				<p>آغاز انجام سفارش در مبدا</p>
			</div>

			{/* اتمام کار در مبدا */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#CA8A04] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">اتمام کار در مبدا</p>
				K
				<p>اتمام انجام سفارش در مبدا</p>
			</div>

			{/* توقف در مسیر */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#C026D3] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">توقف در مسیر</p>
				<p>راننده به درخواست مشتری متوقف شده</p>
			</div>

			{/* در مقصد */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#DB2777] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">در مقصد</p>
				<p>راننده به مقصد رسیده است</p>
			</div>

			{/* سفارش انجام شده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#16A34A] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">سفارش انجام شده</p>
				<p>سفارش به پایان رسیده است</p>
			</div>

			{/* توقف یافتن راننده */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#EA580C] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">توقف یافتن راننده</p>
				<p>فرایند یافتن راننده متوقف شده است</p>
			</div>

			{/* لینک پیش پرداخت پیامک شد */}
			<div className="border-dashed border-[1px] border-zinc-300 rounded-[15px] p-4 flex gap-3 text-[110%] items-center ">
				<span className="bg-[#0369A1] w-4 h-4 rounded-full"></span>
				<p className="font-[Peyda-ult-bold] text-[110%]">لینک پیش پرداخت پیامک شد</p>
				<p>لینک پرداخت برای پیش سفارش پیامک شده است</p>
			</div>
		</div>
	);

}