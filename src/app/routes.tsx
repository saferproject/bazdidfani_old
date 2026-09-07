import { lazy } from "react";
import { createRoutesFromElements, Route } from "react-router-dom";

const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const Auth = lazy(() => import("../pages/Auth"));
const AdminCompanies = lazy(() => import("../pages/dashboard/admin/AdminCompanies"));
const AdminCompanyUsers = lazy(() => import("../pages/dashboard/admin/AdminCompanyUsers"));
const AdminDrivers = lazy(() => import("../pages/dashboard/admin/AdminDrivers"));
const AdminFleet = lazy(() => import("../pages/dashboard/admin/AdminFleet"));
const AdminInspections = lazy(() => import("../pages/dashboard/admin/AdminInspections"));
const AdminLogs = lazy(() => import("../pages/dashboard/admin/AdminLogs"));
const AdminSettings = lazy(() => import("../pages/dashboard/admin/AdminSettings"));
const AdminTechnicalManagers = lazy(() => import("../pages/dashboard/admin/AdminTechnicalManagers"));
const AdminUsers = lazy(() => import("../pages/dashboard/admin/AdminUsers"));
const AdminWebserviceClients = lazy(() => import("../pages/dashboard/admin/AdminWebserviceClients"));
const AddEditCompanyFleet = lazy(() => import("../pages/dashboard/companyFleet/AddEditCompanyFleet"));
const CompanyFleetList = lazy(() => import("../pages/dashboard/companyFleet/CompanyFleetList"));
const DashboardHomePage = lazy(() => import("../pages/dashboard/DashboardHomePage"));
const DoTechnicalVisit = lazy(() => import("../pages/dashboard/do-technical-visit/DoTechnicalVisit"));
const TechnicalManagerCheckList = lazy(() => import("../pages/dashboard/do-technical-visit/TechnicalManagerCheckList"));
const AddEditDriverFleet = lazy(() => import("../pages/dashboard/driverFleet/AddEditDriverFleet"));
const DriverFleetList = lazy(() => import("../pages/dashboard/driverFleet/DriverFleetList"));
const AddDriver = lazy(() => import("../pages/dashboard/drivers/AddDriver"));
const Drivers = lazy(() => import("../pages/dashboard/drivers/Drivers"));
const Profile = lazy(() => import("../pages/dashboard/profile/Profile"));
const Reports = lazy(() => import("../pages/dashboard/reports/Reports"));
const TechnicalInspectionPrintForm = lazy(() => import("../pages/dashboard/requests/components/TechnicalInspectionPrintForm"));
const Request = lazy(() => import("../pages/dashboard/requests/Request"));
const SelfStatementCheckList = lazy(() => import("../pages/dashboard/self-statement/checklist/SelfStatementCheckList"));
const DriverData = lazy(() => import("../pages/dashboard/self-statement/DriverData"));
const SelfStatement = lazy(() => import("../pages/dashboard/self-statement/SelfStatement"));
const AddTechnicalmanager = lazy(() => import("../pages/dashboard/technicalmanagers/AddTechnicalmanager"));
const CompleteTechnicalManagerProfile = lazy(() => import("../pages/dashboard/technicalmanagers/CompleteTechnicalManagerProfile"));
const RegisterTechnicalManager = lazy(() => import("../pages/dashboard/technicalmanagers/RegisterTechnicalManager"));
const TechnicalManager = lazy(() => import("../pages/dashboard/technicalmanagers/TechnicalManager"));
const Users = lazy(() => import("../pages/dashboard/Users"));
const Wallet = lazy(() => import("../pages/dashboard/wallet/Wallet"));
const HomePage = lazy(() => import("../pages/HomePage"));
const InspectionDetails = lazy(() => import("../pages/InspectionDetails/InspectionDetails"));
const NotFound = lazy(() => import("../pages/NotFound"));
const RoleAssignment = lazy(() => import("../pages/RoleAssignment/RoleAssignment"));

export const routes = createRoutesFromElements(
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
        <Route path="admin/webservice-clients" element={<AdminWebserviceClients />} />
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
        <Route
          path="technicalmanagers/complete-profile"
          element={<CompleteTechnicalManagerProfile />}
        />
        <Route
          path="technicalmanagers/inquery-technical-manager"
          element={<RegisterTechnicalManager />}
        />
        <Route path="users" element={<Users />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>
    </>,
  );
