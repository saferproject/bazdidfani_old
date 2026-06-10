import DashboardBanner from "../../../assets/images/DashboardBanner_.png";

/** بنر پیش‌فرض داشبورد برای کاربرانی که داشبورد اختصاصی ندارند. */
const DefaultDashboard = () => (
  <div>
    <div className="flex items-center justify-center">
      <img
        className="h-[125px] w-[500px] lg:h-[223px] lg:w-[1100px]"
        src={DashboardBanner}
        alt="dashboardbanner"
        width={99433}
        height={66243}
      />
    </div>
  </div>
);

export default DefaultDashboard;
