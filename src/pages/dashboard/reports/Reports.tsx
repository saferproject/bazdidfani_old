import { GridColDef } from "@mui/x-data-grid";
import { JSX, useEffect, useState } from "react";

import SaferGrid from "../../../components/shared/DataGrid/SaferGrid";
import PlateTextField from "../../../components/shared/Inputs/PlateTextField";
import { GiBus } from "react-icons/gi";
import { BsTruckFlatbed } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useGetRequestsListQuery } from "../../../api/Requests/RequestsList";
import RequestCard from "../../../components/Request/RequestCard";
import { GetShamsiDate } from "../../../utilities/DateTime";
import SabafCode from "./SabafCode";
import { useGetInspectionStates } from "../../../utilities/Inspection-Status/InspectionStatus";
import SaferFilters from "../../../components/shared/Filters/SaferFilters";
import { DocumentText } from "iconsax-reactjs";

const PlateTextFieldCell = ({ row }: any): JSX.Element => {
	const { control, watch } = useForm({
		defaultValues: {
			first_number: String(row?.first_number),
			third_character: row?.third_character,
			second_number: String(row?.second_number),
			fourth_number: String(row?.fourth_number),
		},
	});
	return (
		<PlateTextField
			control={control}
			watch={watch}
			readOnly={true}
		/>
	);
};

// TODO later make buttons cell an independent component to show sabaf code
export default function Reports() {
	// NOTE type 1 is for freighter and 2 is for passenger
	const [paginatorProps, setPaginatorProps] = useState({ currentPage: 1, itemsPerPage: 10 });
	const [filters, setFilters] = useState(null);

	const requests = useGetRequestsListQuery(
		{ status: "7,13,14", page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters }
	);
	const { states, getStatus } = useGetInspectionStates();

	useEffect(() => {}, [states]);

	const handleSabafSuccess = () => {
		requests.refetch();
	};

	const columns: readonly GridColDef<any>[] = [
		{ field: "count", width: 32, align: "center", headerName: "" },
		{
			field: "detail",
			align: "center",
			headerName: "کد سباف",
			minWidth: 220,
			flex: 1,
			headerAlign: "center",
			editable: false,
			display: "flex",
			cellClassName: "justify-center items-center gap-2",
			renderCell: ({ row }) => (
				<SabafCode
					data={row}
					onSuccess={handleSabafSuccess}
				/>
			),
		},
		{
			field: "driver_name",
			headerName: "نام راننده",
			align: "center",
			width: 180,
			headerAlign: "center",
			editable: false,
			valueGetter: (_, row) => row?.driver?.full_name,
		},
		{
			field: "smart_number",
			headerName: "شماره هوشمند",
			align: "center",
			width: 110,
			headerAlign: "center",
			editable: false,
			valueGetter: (_, row) => row?.truck?.smart_number,
		},
		{
			field: "driver_phone",
			headerName: "همراه راننده",
			align: "center",
			width: 100,
			headerAlign: "center",
			editable: false,
			valueGetter: (_, row) => row?.driver?.phone,
		},
		{
			field: "status",
			headerName: "وضعیت",
			align: "center",
			width: 150,
			headerAlign: "center",
			editable: false,
			renderCell: ({ row }) => {
				return (
					<p
						className="font-semibold"
						style={{
							color: getStatus(row.status)?.color,
						}}
					>
						{getStatus(row.status)?.title}
					</p>
				);
			},
		},
		{
			field: "usage",
			headerName: "کاربری",
			align: "center",
			width: 70,
			headerAlign: "center",
			editable: false,
			renderCell: ({ row }) =>
				row?.bazdidfani?.truck_info?.truck?.usage === "passenger" ? (
					<GiBus
						size={40}
						className="text-primary-dark"
						title="مسافری"
					/>
				) : (
					<BsTruckFlatbed
						size={40}
						className="scale-x-[-1] text-primary-dark"
						title="باری"
					/>
				),
		},
		{
			field: "code",
			headerName: "رهگیری",
			align: "center",
			width: 114,
			headerAlign: "center",
			editable: false,
		},
		{
			field: "created_at",
			headerName: "زمان درخواست",
			width: 140,
			align: "center",
			headerAlign: "center",
			editable: false,
			valueGetter: (item) => GetShamsiDate(item),
		},
		{
			field: "full_name",
			headerName: "کارشناس",
			align: "center",
			width: 130,
			headerAlign: "center",
			editable: false,
			valueGetter: (_, row) => row?.technical_manager?.name,
		},
		{
			field: "fullName",
			headerName: "شماره پلاک",
			align: "center",
			width: 220,
			headerAlign: "center",
			editable: false,
			renderCell: ({ row }) => (
				<div className="h-full w-full flex justify-center items-center">
					<div className="w-full h-[70%]">
						<PlateTextFieldCell row={row.truck} />
					</div>
				</div>
			),
		},
	];

	const handleFilter = (filters: Record<string, string | number | boolean>) => {
		setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
		setFilters(filters);
	};

	return (
		<>
			<section className="flex flex-col gap-8">
				<header className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<DocumentText
							size="32"
							className="text-primary"
						/>
						<h2 className="font-bold text-xl">گزارشات</h2>
					</div>
				</header>
				<main className="flex flex-col gap-8">
					<SaferFilters
						mode="SEARCH_PARAMS"
						search={true}
						plaque={true}
						date={true}
						filters={[
							{
								label: "شماره هوشمند",
								field: "smart_number",
								type: "string",
							},
						]}
						onFilter={handleFilter}
					/>
					<SaferGrid<any>
						columns={columns}
						loading={requests.isLoading || requests.isFetching}
						rows={requests.data?.data.data || []}
						renderCart={(data) => (
							<RequestCard
								data={data}
								isReportPage={true}
								onGetSabafSuccess={handleSabafSuccess}
							/>
						)}
						filterSetInUrl
						onCloseFilterDialog={() => {}}
						onFilterChange={() => {}}
						openFilterDialog={false}
						renderFilter={() => <></>}
					/>
				</main>
			</section>
		</>
	);
}
