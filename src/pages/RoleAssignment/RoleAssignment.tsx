import useHavePermission from "../../components/shared/Functions/CostumeHooks/CheckPermissions";
import FormStates from "../../shared/types/form-states.type";
import useIsPhone from "../../utilities/custom-hooks/use-is-phone";
import { useCompanyRoleDataQuery } from "./api/role-assignment.api";
import CompanyForm from "./CompanyRoleForm";
import ROLES from "./constants/roles";
import DriverForm from "./DriverRoleForm";
import TechnicalManagerForm from "./TechnicalManagerRoleForm";
import { Button } from "@mui/material";
import { ArrowLeft, InfoCircle } from "iconsax-reactjs";
import { FC, useState } from "react";
import { BsInfoLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";




















const RoleAssignment: FC = () => {
	const navigate = useNavigate();
	const isPhone = useIsPhone();

	const [selectedRole, setSelectedRole] = useState<(typeof ROLES)[0]>(ROLES[0]);
	const [showForm, setShowForm] = useState(false);
	const [formState, setFormState] = useState<FormStates | null>(null);

	const isDriver = useHavePermission("driver");
	const isCompanyAdmin = useHavePermission("company");
	const isTechnicalManager = useHavePermission("technicalManager");

	const companyRoleData = useCompanyRoleDataQuery(undefined, { skip: !isCompanyAdmin || selectedRole.id !== "company" });

	const handleGetRole = () => {
		setFormState("ADD");
		setShowForm(true);
	};

	const handleEditRole = () => {
		if (selectedRole.id === "driver" && isDriver) {
			navigate("/dashboard/profile?edit=true");
			return;
		}

		setFormState("EDIT");
		setShowForm(true);
	};

	const handleTabChange = (id: string, name: string, description: string, icon: string) => {
		setFormState(null);
		setShowForm(false);
		setSelectedRole({ id, name, description, icon });
	};

	const isSelectedRoleActive =
		(selectedRole.id === "driver" && isDriver) ||
		(selectedRole.id === "technicalManager" && isTechnicalManager) ||
		(selectedRole.id === "company" && isCompanyAdmin);

	const roleForm =
		selectedRole.id === "driver" ? (
			<DriverForm />
		) : selectedRole.id === "technicalManager" ? (
			<TechnicalManagerForm formState={formState} />
		) : selectedRole.id === "company" ? (
			<CompanyForm formState={formState} />
		) : (
			<></>
		);

	return (
    <div className="w-full h-full">
      <div className="relative flex items-center justify-evenly z-0 mb-8">
        {/* Tabs */}
        <div className="absolute w-9/12 left-1/2 bottom-12 -translate-x-1/2 border -z-10 lg:hidden"></div>
        {ROLES.map(({ id, name, description, icon }) => (
          // Tab
          <div
            className="flex flex-col items-center gap-2 cursor-pointer basis-1/3 lg:basis-auto"
            onClick={() => handleTabChange(id, name, description, icon)}
          >
            <div
              className={
                "w-12 h-12 flex justify-center items-center overflow-hidden rounded-xl " +
                (selectedRole.id === id ? "bg-primary-light" : "bg-gray-200")
              }
            >
              <img src={icon} alt={"عکس" + name} />
            </div>
            <h3 className="font-Yekan-Bakh font-semibold text-sm">{name}</h3>
          </div>
        ))}
      </div>
			<div className="flex items-center gap-2 mb-4 text-sm md:text-base">
				<InfoCircle size={24} className="text-blue-500" />
        <p>شما می‌توانید یک یا چند نقش فعال داشته باشید</p>
      </div>
      {/* Description */}
      <div className="flex flex-col items-center gap-8 p-4 border-4 border-dashed rounded-2xl lg:flex-row lg:gap-32">
        {((!showForm && !isPhone) || isPhone) && (
          <div className="relative flex flex-col gap-4 items-center">
            <div className="w-16 h-16 flex justify-center items-center overflow-hidden rounded-xl">
              <img
                className="scale-150"
                src={selectedRole.icon}
                alt={selectedRole.name}
              />
            </div>
            <h3 className="font-bold text-lg">{selectedRole.name}</h3>
            {selectedRole.id !== "company" ? (
              <p
                className={
                  "text-sm lg:text-nowrap " +
                  (isSelectedRoleActive ? "text-primary-dark" : "text-gray-500")
                }
              >
                این نقش برای شما فعال{" "}
                <span>{isSelectedRoleActive ? "شده" : "نشده"}</span> است
              </p>
            ) : companyRoleData.isSuccess ? (
              <p className="text-sm lg:text-nowrap text-primary-dark">
                این نقش برای{" "}
                <span>
                  {isSelectedRoleActive
                    ? `شرکت ${companyRoleData.data.data.name} فعال شده`
                    : " شما فعال نشده"}
                </span>{" "}
                است
              </p>
            ) : (
              <p className="text-sm lg:text-nowrap text-gray-500">
                این نقش برای شما فعال نشده است
              </p>
            )}
            <div className="absolute right-10 rounded-full w-10 h-10 flex items-center justify-center bg-gray-200">
              <div className="w-4/5 h-4/5 flex items-center justify-center rounded-full bg-primary-light">
                <BsInfoLg size="28" />
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col items-center gap-4 lg:items-start">
          <h3 className="font-Rokh font-bold">تـوضـیـحـات</h3>
          <p className="indent-2">{selectedRole.description}</p>
          {isSelectedRoleActive && !showForm ? (
            <Button
              sx={{ display: "flex", justifyContent: "space-between" }}
              variant="outlined"
              size="large"
              endIcon={<ArrowLeft size="16" />}
              onClick={handleEditRole}
              fullWidth={isPhone}
            >
              ویرایش {selectedRole.name}
            </Button>
          ) : showForm ? (
            roleForm
          ) : (
            <Button
              sx={{ display: "flex", justifyContent: "space-between" }}
              variant="outlined"
              size="large"
              endIcon={<ArrowLeft size="16" />}
              onClick={handleGetRole}
              fullWidth={isPhone}
            >
              احراز هویت {selectedRole.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleAssignment;
