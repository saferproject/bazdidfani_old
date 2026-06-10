import { useGetInspectionDetailMutation } from "./api/inspection-details.api";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import ImageComponent from "../../components/shared/Image/Image";
import { STORAGE_URL } from "../../Stores/api-urls";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import InspectionItem from "../../components/InspectionList/interfaces/inspection-item.interface";
import { BazdidfaniRow } from "./interfaces/inspection-detail.interface";
import { useGetInspectionStates } from "../../utilities/Inspection-Status/InspectionStatus";
import Plate from "../../components/shared/DataGrid/Plate";
import { GetShamsiDateTime } from "../../utilities/DateTime";

export default function InspectionDetails() {
	const [searchParams] = useSearchParams();
	const { states, getStatus } = useGetInspectionStates();

	const [getInspectionDetail, inspectionDetailResult] = useGetInspectionDetailMutation();

	const formatedData = useMemo<InspectionItem[]>(() => {
		const newData = [];

		if (inspectionDetailResult.isSuccess) {
			for (const item of inspectionDetailResult.data.data.checklist)
				if (item.details.length) newData.push(...item.details.map((detail) => ({ ...detail, isDetail: 1 })));
				else newData.push({ ...item, isDetail: 0 });

			newData.sort((a, b) => a.code - b.code);
		}

		return newData;
	}, [inspectionDetailResult.isSuccess, inspectionDetailResult.data]);

	const inspectionData = useMemo<BazdidfaniRow>(
		() => inspectionDetailResult.isSuccess && inspectionDetailResult.data.data.bazdidfani_row,
		[inspectionDetailResult.isSuccess, inspectionDetailResult.data]
	);

	const columns: GridColDef<InspectionItem>[] = [
		{
			field: "name",
			headerName: "نام",
			flex: 1,
			type: "string",
		},
		{
			field: "self_statement",
			headerName: "نوع",
			width: 96,
			type: "string",
			valueFormatter: (value) => (value === 1 ? "خوداظهاری" : "بازدید فنی"),
		},
		{
			field: "description",
			headerName: "توضیحات",
			flex: 1,
			type: "string",
			valueGetter: (_value, row) => row.inspectorDescription ?? row.driverDescription ?? row.description,
		},
		{
			field: "image",
			headerName: "عکس",
			width: 80,
			type: "custom",
			align: "center",
			renderCell: ({ row }) =>
				row.isImage &&
				Object.values(row.image_data)[0] && (
					<div className="w-16 h-16 overflow-hidden flex items-center justify-center rounded">
						<ImageComponent
							image={`${STORAGE_URL}${Object.values(row.image_data)[0]}`}
							alt={row.name}
						/>
					</div>
				),
		},
	];

	const handleGetRowClassName = (row) => {
		return row.is_rejected || !row.checked ? "bg-red" : "";
	};

	const handleLogoClick = () => {
		window.location.href = "https://www.bazdidfani.ir";
	};

	useEffect(() => {
		const id = searchParams.get("id");
		const code = searchParams.get("code");

		if (id && code) getInspectionDetail({ bazdidfani_id: id, code });
	}, [searchParams]);

	useEffect(() => {}, [states]);

	return (
		<div className="w-screen h-screen bg-gray-50 flex select-none">
			<aside className="w-96 h-full border-l-2 border-gray-200">
				<div
					title="bazdidfani.ir"
					className="w-full flex flex-col justify-center items-center cursor-pointer"
					onClick={handleLogoClick}
				>
					<div className="flex items-center justify-center h-32 w-48 object-cover">
						<img
							src="/favicon.png"
							alt="logo"
						/>
					</div>
					<h1 className="text-xl font-bold">بازدید فنی</h1>
				</div>
				<ul className="flex flex-col gap-4 mt-16 p-4">
					<li className="flex items-center justify-between px-4 py-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">وضعیت</p>
						<p>{getStatus(inspectionData.status)?.technical_inspection_title ?? ""}</p>
					</li>
					<li className="flex items-center justify-between px-4 py-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">پلاک</p>
						<Plate
							firstChar={inspectionData.truck?.first_number}
							secondChar={inspectionData.truck?.third_character}
							thirdChar={inspectionData.truck?.second_number?.toString()}
							fourthChar={inspectionData.truck?.fourth_number?.toString()}
						/>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">شماره هوشمند</p>
						<p>{inspectionData.truck?.smart_number}</p>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">کد رهگیری</p>
						<p>{inspectionData.code}</p>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">زمان درخواست</p>
						<p>{GetShamsiDateTime(inspectionData.created_at)}</p>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">شروع بازدید</p>
						<p>{GetShamsiDateTime(inspectionData.technical_inspection?.start_technical_inspection_at)}</p>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">اپراتور</p>
						<p>{inspectionData.user_company?.full_name ?? inspectionData.company?.name}</p>
					</li>
					<li className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
						<p className="text-gray-500">مدیر فنی</p>
						<p>{inspectionData.technical_manager?.name}</p>
					</li>
				</ul>
			</aside>
			<main className="w-[calc(100%-384px)] h-full p-8 overflow-hidden">
				<DataGrid
					getRowId={(row) => row.code}
					rows={formatedData}
					columns={columns}
					getRowClassName={({ row }) => handleGetRowClassName(row)}
					loading={inspectionDetailResult.isLoading}
					rowHeight={64}
					rowSelection={false}
					hideFooter={true}
				/>
			</main>
		</div>
	);
}
