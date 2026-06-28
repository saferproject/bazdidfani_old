import { CircularProgress, Divider, Switch } from "@mui/material";
import { IconButton } from "@mui/material";
import { Edit } from "iconsax-reactjs";
import { FC, useEffect } from "react";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { useChangeAdminFleetStatusMutation } from "../../pages/dashboard/admin/api/admin-fleet.api";
import { GetShamsiDate } from "../../utilities/DateTime";

interface iprops {
	data: any;
	onEditFleet: (data: any) => void;
}

const AFleetCard: FC<iprops> = ({ data, onEditFleet }) => {
	const [changeStatusFn, changeStatusResult] = useChangeAdminFleetStatusMutation();

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
				<p className="font-semibold">{data.smart_number ?? ""}</p>
				<div className="flex items-center gap-1">
					<IconButton size="small" onClick={() => onEditFleet(data)}>
						<Edit size="20" className="text-amber-400" />
					</IconButton>
					{changeStatusResult.isLoading && changeStatusResult.originalArgs?.id === data.id ? (
						<CircularProgress size={20} color="primary" />
					) : (
						<Switch
							size="small"
							checked={!!data.trucks_info?.[0]?.status}
							onChange={() => handleChangeStatus(!!data.trucks_info?.[0]?.status, data.id)}
							className="rotate-180"
						/>
					)}
				</div>
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">{data.loader?.type === 1 ? "بارگیر" : "ظرفیت"}</p>
				<p className="text-gray-900">{data.loader?.name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">VIN</p>
				<p className="text-gray-900">{data.VIN ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره همراه مالک</p>
				<p className="text-gray-900">{data.trucks_info?.[0]?.owner_phone_number ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">اعتبار بیمه نامه</p>
				<p className="text-gray-900">
					{data.trucks_info?.[0]?.Insurance_validity ? GetShamsiDate(data.trucks_info[0].Insurance_validity) : ""}
				</p>
			</div>
		</div>
	);
};

export default AFleetCard;
