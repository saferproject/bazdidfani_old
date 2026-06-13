import { CircularProgress, Divider, IconButton, Switch } from "@mui/material";
import { Edit, Login } from "iconsax-reactjs";
import { FC, useEffect } from "react";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { useAdminChangeDriverStatusMutation } from "../../pages/dashboard/admin/api/admin-driver.api";
import { GetShamsiDate } from "../../utilities/DateTime";

interface iprops {
	data: any;
	onEditDriver: (data: any) => void;
	onLoginAs: (userId: number, fullName: string) => void;
}

const certificateTypeLabel = (type: number) => {
	if (type === 1) return "پایه یک";
	if (type === 2) return "پایه دو";
	if (type === 3) return "پایه دو تبصره 99";
	return "";
};

const ADriverCard: FC<iprops> = ({ data, onEditDriver, onLoginAs }) => {
	const [changeDriverStatusFn, changeDriverStatusResult] = useAdminChangeDriverStatusMutation();

	useEffect(() => {
		if (changeDriverStatusResult.isSuccess)
			SweetAlertToast.fire({ title: changeDriverStatusResult.data.message, icon: "success" });
	}, [changeDriverStatusResult.isSuccess, changeDriverStatusResult.data]);

	const handleActive = (checked: boolean, userId: number) => {
		if (checked) changeDriverStatusFn({ user_id: userId, description: "", status: 0 });
		else changeDriverStatusFn({ user_id: userId, description: "", status: 1 });
	};

	const driver = data.driver?.[0];
	const hasUser = !!driver?.user;

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="w-full flex items-center justify-between">
				<p className="font-semibold">{driver?.full_name ?? ""}</p>
				<div className="flex items-center">
					<IconButton size="small" onClick={() => onEditDriver(data)}>
						<Edit size="20" className="text-amber-400" />
					</IconButton>
					{hasUser && (
						<IconButton
							size="small"
							onClick={() => onLoginAs(driver.user.id, driver.full_name)}
						>
							<Login size="20" className="text-primary" />
						</IconButton>
					)}
					{changeDriverStatusResult.isLoading && changeDriverStatusResult.originalArgs?.user_id === data.id ? (
						<CircularProgress size={20} color="primary" />
					) : (
						<Switch
							size="small"
							checked={driver?.status === 1}
							onChange={() => handleActive(!!driver?.status, data.id)}
							className="rotate-180"
						/>
					)}
				</div>
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{data.national_code ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره همراه</p>
				<p className="text-gray-900">{driver?.phone_number ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نوع گواهی نامه</p>
				<p className="text-gray-900">{certificateTypeLabel(driver?.certificate_type)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">اعتبار گواهی نامه</p>
				<p className="text-gray-900">
					{data.certificate_validity ? GetShamsiDate(data.certificate_validity) : ""}
				</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">اعتبار کارت بیمه</p>
				<p className="text-gray-900">
					{data.health_card_validity ? GetShamsiDate(data.health_card_validity) : ""}
				</p>
			</div>
		</div>
	);
};

export default ADriverCard;
