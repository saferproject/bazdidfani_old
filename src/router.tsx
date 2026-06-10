import RemoveAuthStep from "./components/shared/BackgroundLogics/RemoveAuthStep/RemoveAuthStep";
import DashboardLayout from "./layouts/DashboardLayout";
import Auth from "./pages/Auth";
import AdminCompanies from "./pages/dashboard/admin/AdminCompanies";
import AdminCompanyUsers from "./pages/dashboard/admin/AdminCompanyUsers";
import AdminDrivers from "./pages/dashboard/admin/AdminDrivers";
import AdminFleet from "./pages/dashboard/admin/AdminFleet";
import AdminInspections from "./pages/dashboard/admin/AdminInspections";
import AdminLogs from "./pages/dashboard/admin/AdminLogs";
import AdminSettings from "./pages/dashboard/admin/AdminSettings";
import AdminTechnicalManagers from "./pages/dashboard/admin/AdminTechnicalManagers";
import AdminUsers from "./pages/dashboard/admin/AdminUsers";
import AddEditCompanyFleet from "./pages/dashboard/companyFleet/AddEditCompanyFleet";
import CompanyFleetList from "./pages/dashboard/companyFleet/CompanyFleetList";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import DoTechnicalVisit from "./pages/dashboard/do-technical-visit/DoTechnicalVisit";
import TechnicalManagerCheckList from "./pages/dashboard/do-technical-visit/TechnicalManagerCheckList";
import AddEditDriverFleet from "./pages/dashboard/driverFleet/AddEditDriverFleet";
import DriverFleetList from "./pages/dashboard/driverFleet/DriverFleetList";
import AddDriver from "./pages/dashboard/drivers/AddDriver";
import Drivers from "./pages/dashboard/drivers/Drivers";
import Profile from "./pages/dashboard/profile/Profile";
import Reports from "./pages/dashboard/reports/Reports";
import TechnicalInspectionPrintForm from "./pages/dashboard/requests/components/TechnicalInspectionPrintForm";
import Request from "./pages/dashboard/requests/Request";
import SelfStatementCheckList from "./pages/dashboard/self-statement/checklist/SelfStatementCheckList";
import DriverData from "./pages/dashboard/self-statement/DriverData";
import SelfStatement from "./pages/dashboard/self-statement/SelfStatement";
import AddTechnicalmanager from "./pages/dashboard/technicalmanagers/AddTechnicalmanager";
import TechnicalManager from "./pages/dashboard/technicalmanagers/TechnicalManager";
import Users from "./pages/dashboard/Users";
import Wallet from "./pages/dashboard/wallet/Wallet";
import HomePage from "./pages/HomePage";
// import HazardousShipmentInspection from "./pages/HazardousShipmentInspection/HazardousShipmentInspection";
import InspectionDetails from "./pages/InspectionDetails/InspectionDetails";
import NotFound from "./pages/NotFound";
import RoleAssignment from "./pages/RoleAssignment/RoleAssignment";
import { LinearProgress } from "@mui/material";
import { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/inspection" element={<InspectionDetails />} />
      <Route
        path="print-technical-inspection-form/:loaderType"
        element={<TechnicalInspectionPrintForm />}
      />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<DashboardHomePage />} />
        <Route path="admin/companies" element={<AdminCompanies />} />
        <Route path="admin/drivers" element={<AdminDrivers />} />
        <Route
          path="admin/technicalmanagers"
          element={<AdminTechnicalManagers />}
        />
        <Route path="admin/fleet" element={<AdminFleet />} />
        <Route path="admin/company-users" element={<AdminCompanyUsers />} />
        <Route path="admin/users" element={<AdminUsers />} />
        <Route path="admin/inspections" element={<AdminInspections />} />
        <Route path="admin/settings" element={<AdminSettings />} />
        <Route path="admin/logs" element={<AdminLogs />} />
        <Route
          path="do-technical-visit-freighter"
          element={<DoTechnicalVisit type={1} />}
        />
        <Route
          path="do-technical-visit-passenger"
          element={<DoTechnicalVisit type={2} />}
        />
        <Route
          path="do-technical-visit/checklist/:id"
          element={<TechnicalManagerCheckList />}
        />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/add-driver" element={<AddDriver />} />
        <Route path="companyFleet" element={<CompanyFleetList />} />
        <Route path="companyFleet/:id" element={<AddEditCompanyFleet />} />
        <Route path="driverFleet" element={<DriverFleetList />} />
        <Route path="driverFleet/:id" element={<AddEditDriverFleet />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<RoleAssignment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="requests" element={<Request />} />
        <Route path="self-statement" element={<SelfStatement />} />
        <Route path="self-statement/driverData" element={<DriverData />} />
        <Route
          path="self-statement/checklist/:id"
          element={<SelfStatementCheckList />}
        />
        <Route path="technicalmanagers" element={<TechnicalManager />} />
        <Route
          path="technicalmanagers/add-technicalmanager"
          element={<AddTechnicalmanager />}
        />
        <Route path="users" element={<Users />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>
    </>,
  ),
);

<RemoveAuthStep />;

const RouterHandler = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default RouterHandler;
