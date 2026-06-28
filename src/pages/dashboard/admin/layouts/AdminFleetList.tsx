import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, Edit, Truck } from "iconsax-reactjs";
import { FC, useCallback, useEffect, useState } from "react";
import PlateTextFieldCell from "../../self-statement/PlatetextFieldCell";
import { GetShamsiDate } from "../../../../utilities/DateTime";
import { useChangeAdminFleetStatusMutation, useGetAdminFleetQuery, useGetInfiniteAdminFleetInfiniteQuery } from "../api/admin-fleet.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import AdminFleetListProps from "../interfaces/admin-fleet-list-props.interface";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import AFleetCard from "../../../../components/Admin/AFleetCard";
import { Fab } from "@mui/material";
import { useAppSelector } from "../../../../Stores/hooks";
import downloadExcelFile from "../../../../utilities/download-excel";
import { API_URL } from "../../../../Stores/api-urls";
import buildQueryParams from "../../../../utilities/build-query-params";

const AdminFleetList: FC<AdminFleetListProps> = ({ onAddFleet, onEditFleet }) => {
	const isPhone = useIsPhone();
	const [paginatorProps, setPaginatorProps] = useState({ currentPage: 1, itemsPerPage: 10 });
	const [filters, setFilters] = useState(null);
	const [excelLoading, setExcelLoading] = useState(false);

	const fleet = useGetAdminFleetQuery(
		{ page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters || isPhone }
	);

	const infiniteFleet = useGetInfiniteAdminFleetInfiniteQuery(
		{ per_page: 10, ...filters },
		{ skip: !paginatorProps || !filters || !isPhone }
	);

	const [changeStatusFn, changeStatusResult] = useChangeAdminFleetStatusMutation();

	const handleChangeStatus = (active: boolean, id: number) => {
		if (active) changeStatusFn({ status: 0, id, admin_description: "" });
		else changeStatusFn({ status: 1, id, admin_description: "" });
	};

	const handleFilter = (filters: Record<string, string | number | boolean>) => {
		setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
		setFilters(filters);
	};

	const columns: GridColDef[] = [
		{
			field: "count",
			align: "center",
			headerName: "",
			width: 32,
			editable: false,
		},
		{
			field: "status",
			headerName: "وضعیت",
			type: "custom",
			editable: false,
			align: "center",
			flex: 0.5,
			renderCell: ({ row }) => (
				<div className="flex items-center justify-between">
					{changeStatusResult.isLoading && changeStatusResult.originalArgs.id == row.id ? (
						<CircularProgress color="primary" />
					) : (
						<Switch
							checked={!!row.trucks_info[0].status}
							onChange={() => handleChangeStatus(!!row.trucks_info[0].status, row.id)}
							className="rotate-180"
						/>
					)}
				</div>
			),
		},
		{
			field: "actions",
			headerName: "عملیات",
			type: "actions",
			editable: false,
			align: "center",
			flex: 0.5,
			renderCell: ({ row }) => (
				<IconButton title="ویرایش" onClick={() => onEditFleet(row)}>
					<Edit size="24" className="text-amber-400" />
				</IconButton>
			),
		},
		{
			field: "smart_number",
			headerName: "شماره هوشمند",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
		},
		{
			field: "VIN",
			headerName: "VIN",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
		},
		{
			field: "loader",
			headerName: "نوع",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.loader.name,
		},
		{
			field: "plaque",
			headerName: "شماره پلاک",
			type: "custom",
			editable: false,
			align: "center",
			flex: 1,
			renderCell: ({ row }) => (
				<div className="h-full w-full flex justify-center items-center">
					<div className="w-full h-[70%]">
						<PlateTextFieldCell
							row={{
								truck: {
									first_number: row.first_number,
									second_number: row.second_number,
									third_character: row.third_character,
									fourth_number: row.fourth_number,
								},
							}}
						/>
					</div>
				</div>
			),
		},
		{
			field: "owner_phone_number",
			headerName: "شماره همراه مالک",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.trucks_info[0].owner_phone_number,
		},
		{
			field: "insurance_validity",
			headerName: "اعتبار بیمه نامه",
			type: "date",
			editable: false,
			align: "center",
			flex: 1,
			valueFormatter: (_value, row) =>
				row.trucks_info[0].Insurance_validity ? GetShamsiDate(row.trucks_info[0].Insurance_validity) : "",
		},
	];

	useEffect(() => {
		if (changeStatusResult.isSuccess)
			SweetAlertToast.fire({
				icon: "success",
				text: changeStatusResult.data.message,
			});
	}, [changeStatusResult.isSuccess, changeStatusResult.data]);

	const token = useAppSelector((state) => state.user.token);

	const handleGetExcel = useCallback(async () => {
      setExcelLoading(true);
      try {
        await downloadExcelFile(
          `${API_URL}/api/admin/truck/export/excel${filters ? "?" + buildQueryParams(filters) : ""}`,
          token,
          "لیست ناوگان ها",
        );
      } finally {
        setExcelLoading(false);
      }
    }, [filters, API_URL, buildQueryParams, token, setExcelLoading]);

	return (
		<section className="flex flex-col gap-8">
			<header className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Truck size="32" className="text-primary" />
					<h2 className="text-xl font-bold">ناوگان</h2>
				</div>
				<Button
					className="hidden lg:flex"
					variant="contained"
					size="large"
					startIcon={<Add size="24" />}
					onClick={onAddFleet}
				>
					افزودن ناوگان
				</Button>
			</header>
			<main className="flex flex-col gap-8">
				<SaferFilters
					mode="SEARCH_PARAMS"
					search={true}
					plaque={true}
					onFilter={handleFilter}
					onGetExcel={handleGetExcel}
					excelLoading={excelLoading}
				/>
				<SaferGrid<any>
					columns={columns}
					loading={
						fleet.isLoading ||
						fleet.isFetching ||
						infiniteFleet.isLoading ||
						infiniteFleet.isFetching
					}
					rows={
						isPhone
							? (infiniteFleet.data?.pages
									.map((page) => page.data.data)
									.reduce((a, b) => [...a, ...b]) ?? [])
							: (fleet.data?.data.data ?? [])
					}
					renderCart={(data) => <AFleetCard data={data} onEditFleet={onEditFleet} />}
					filterSetInUrl
					onCloseFilterDialog={() => {}}
					onFilterChange={() => {}}
					openFilterDialog={false}
					renderFilter={() => <></>}
					paginatorProps={{
						...paginatorProps,
						totalPages: fleet.data?.data.last_page,
						onItemsPerPageChange: (pageSize) => setPaginatorProps((currentValue) => ({ ...currentValue, itemsPerPage: pageSize })),
						onPageChange: (page) => setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: page })),
					}}
					fetchMoreData={infiniteFleet.fetchNextPage}
					hasMore={infiniteFleet.hasNextPage}
				/>
			</main>
			<Fab
				size="medium"
				color="primary"
				onClick={onAddFleet}
				className="lg:hidden fixed bottom-8 right-8 shadow"
			>
				<Add size="32" />
			</Fab>
		</section>
	);
};

export default AdminFleetList;
