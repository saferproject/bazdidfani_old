import { CircularProgress, Divider, Switch } from "@mui/material";
import { FC, useEffect } from "react";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { useChangeAdminCompanyUserStatusMutation } from "../../pages/dashboard/admin/api/admin-company-users.api";
import { GetShamsiDate } from "../../utilities/DateTime";

interface iprops {
	data: any;
}

const ACompanyUsersCard: FC<iprops> = ({ data }) => {
	const [changeStatusFn, changeStatusResult] = useChangeAdminCompanyUserStatusMutation();

	useEffect(() => {
		if (changeStatusResult.isSuccess)
			SweetAlertToast.fire({ icon: "success", text: changeStatusResult.data.message });
	}, [changeStatusResult.isSuccess, changeStatusResult.data]);

	const handleChangeStatus = (active: boolean, id: number) => {
		if (active) changeStatusFn({ status: 0, id, admin_description: "" });
		else changeStatusFn({ status: 1, id, admin_description: "" });
	};

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="w-full flex items-center justify-between">
				<p className="font-semibold">{data.user?.personal?.full_name ?? ""}</p>
				{changeStatusResult.isLoading && changeStatusResult.originalArgs?.id === data.id ? (
					<CircularProgress size={20} color="primary" />
				) : (
					<Switch
						size="small"
						checked={data.status === "active"}
						onChange={() => handleChangeStatus(data.status === "active", data.id)}
						className="rotate-180"
					/>
				)}
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{data.user?.personal?.national_code ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شرکت</p>
				<p className="text-gray-900">{data.company?.name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره همراه</p>
				<p className="text-gray-900">{data.user?.personal?.phone ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره ثابت</p>
				<p className="text-gray-900">{data.user?.personal?.telephone ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">تاریخ تولد</p>
				<p className="text-gray-900">
					{data.user?.personal?.birthdate ? GetShamsiDate(data.user.personal.birthdate) : ""}
				</p>
			</div>
		</div>
	);
};

export default ACompanyUsersCard;
