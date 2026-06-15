import { Divider, IconButton } from "@mui/material";
import { ReceiptSearch } from "iconsax-reactjs";
import { FC } from "react";
import { GetShamsiDateTime } from "../../utilities/DateTime";
import { useGetInspectionStates } from "../../utilities/Inspection-Status/InspectionStatus";
import InspectionRequest from "../../pages/dashboard/requests/interfaces/inspection-request.interface";

interface iprops {
	data: any;
	onViewInspection: (data: InspectionRequest) => void;
	isLoading?: boolean;
}

const AInspectionsCard: FC<iprops> = ({ data, onViewInspection, isLoading }) => {
	const { getStatus } = useGetInspectionStates();

	const statusTitle =
		data.self_statement === 1 && !data.technical_manager?.name && !data.company?.name
			? getStatus(data.status)?.self_statement_title
			: getStatus(data.status)?.technical_inspection_title;

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="w-full flex items-center justify-between">
				<p className="font-semibold">{data.company?.name ?? ""}</p>
				{data.status !== 3 && data.status !== 5 && (
					<IconButton size="small" onClick={() => onViewInspection(data)} disabled={isLoading}>
						<ReceiptSearch size="20" className="text-primary" />
					</IconButton>
				)}
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">وضعیت</p>
				<p className="font-semibold text-gray-900">{statusTitle ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره هوشمند</p>
				<p className="text-gray-900">{data.truck?.smart_number ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کاربری</p>
				<p className="text-gray-900">
					{data.type === 2 ? "مسافری" : data.type === 1 ? "باری" : "نامشخص"}
				</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">مدیر فنی</p>
				<p className="text-gray-900">{data.technical_manager?.name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">اپراتور</p>
				<p className="text-gray-900">{data.user_company?.full_name ?? data.company_credential?.name ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">زمان درخواست</p>
				<p className="text-gray-900">{GetShamsiDateTime(data.created_at)}</p>
			</div>
			{data.code && (
				<div className="flex items-center justify-between">
					<p className="text-gray-500">رهگیری</p>
					<p className="text-gray-900">{data.code}</p>
				</div>
			)}
			{data.technical_inspection.sabaf_code && (
				<div className="flex items-center justify-between">
					<p className="text-gray-500">رهگیری</p>
					<p className="text-gray-900">{data.technical_inspection.sabaf_code}</p>
				</div>
			)}
		</div>
	);
};

export default AInspectionsCard;
