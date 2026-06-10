import { CircularProgress, Divider, Switch } from "@mui/material";
import { FC, useEffect } from "react";
import { RoleType } from "../../types/RoleType";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { useChangeCompanyStatusMutation } from "../../pages/dashboard/admin/api/admin-company.api";

interface iprops {
	data: any;
	isDialog?: boolean;
}

const ACompaniesCard: FC<iprops> = ({ data }) => {
	const [changeCompanyStatusFn, changeCompanyStatusResult] = useChangeCompanyStatusMutation();

	useEffect(() => {
		if (changeCompanyStatusResult.isSuccess)
			SweetAlertToast.fire({
				title: changeCompanyStatusResult.data.message,
				icon: "success",
			});
	}, [changeCompanyStatusResult.isSuccess]);

	const handleActive = (e: any, userId: number) => {
		if (e.target.checked) {
			changeCompanyStatusFn({
				userId: userId,
				role: RoleType.company,
				status: 3,
			});
		} else {
			changeCompanyStatusFn({
				userId: userId,
				role: RoleType.company,
				status: 2,
			});
		}
	};

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="w-full flex items-center justify-between">
				<p className="text-gray-900">{data.name ?? ""}</p>
				{changeCompanyStatusResult.isLoading && changeCompanyStatusResult.originalArgs?.userId === data.id ? (
					<CircularProgress color="primary" />
				) : (
					<Switch
						checked={data.status === 3}
						onChange={(e) => {
							handleActive(e, data.user_id);
						}}
					/>
				)}
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد سازمانی</p>
				<p className="text-gray-900">{data?.organization_code ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نام مدیر عامل</p>
				<p className="text-gray-900">{data.ceo_name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">همراه مدیر عامل</p>
				<p className="text-gray-900">{data.ceo_phone ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نام رابط فنی</p>
				<p className="text-gray-900">{data.coordinator_name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">همراه رابط فنی</p>
				<p className="text-gray-900">{data.coordinator_phone ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شهر</p>
				<p className="text-gray-900">{data.cities?.name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">حوزه فعالیت</p>
				<p className="text-gray-900">
					{data.company_usage === 1 ? "باری" : data.company_usage === 2 ? "مسافری" : data.company_usage === 3 ? "باری مسافری" : ""}
				</p>
			</div>
		</div>
	);
};

export default ACompaniesCard;
