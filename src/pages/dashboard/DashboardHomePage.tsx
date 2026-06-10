import useHavePermission from "../../components/shared/Functions/CostumeHooks/CheckPermissions";
import AdminDashboard from "./home/AdminDashboard";
import CompanyDashboard from "./home/CompanyDashboard";
import DefaultDashboard from "./home/DefaultDashboard";
import TechnicalManagerDashboard from "./home/TechnicalManagerDashboard";

/**
 * بر اساس نقش کاربر، داشبورد متناسب را نمایش می‌دهد.
 * اولویت: ادمین » مدیر فنی » شرکت » بنر پیش‌فرض.
 */
const DashboardHomePage = () => {
  const isAdmin = useHavePermission("admin");
  const isTechnicalManager = useHavePermission("technicalManager");
  const isCompany = useHavePermission("company");

  if (isAdmin) return <AdminDashboard />;
  if (isTechnicalManager) return <TechnicalManagerDashboard />;
  if (isCompany) return <CompanyDashboard />;
  return <DefaultDashboard />;
};

export default DashboardHomePage;
