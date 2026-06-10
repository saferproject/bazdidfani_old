import DashboardBanner from "../../assets/images/DashboardBanner_.png";

const DashboardHomePage = () => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <img
          className="lg:w-[1100px] w-[500px] h-[125px] lg:h-[223px]"
          src={DashboardBanner}
          alt="dashboardbanner"
          width={99433}
          height={66243}
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
