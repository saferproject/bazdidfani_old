import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CustomDialog, { CustomDialogProps, EmptyCustomDialoProps } from "../shared/Dialog/CustomeDialog";
import { useChangeDriverStatusMutation, useGetDriverQuery, useGetInfiniteDriverInfiniteQuery } from "../../api/Driver/Driver";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { GetShamsiDate } from "../../utilities/DateTime";
import SaferGrid from "../shared/DataGrid/SaferGrid";
import DriverCard from "./DriverCard";
import { Edit, TickSquare, UserSquare } from "iconsax-reactjs";
import SaferFilters from "../shared/Filters/SaferFilters";
import { useNavigate } from "react-router-dom";
import useIsPhone from "../../utilities/custom-hooks/use-is-phone";

export default function DriverList({ isDialog, onSuccess }: { isDialog?: boolean; onSuccess?: (data: any) => void }) {
	const navigate = useNavigate();
	const isPhone = useIsPhone();

	const [paginatorProps, setPaginatorProps] = useState({ currentPage: 1, itemsPerPage: 10 });
	const [filters, setFilters] = useState(null);
	const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
		status: !isDialog,
	});

	const [customDialogProps, setCustomDialogProps] = useState<CustomDialogProps>({
		...EmptyCustomDialoProps,
	});

	const drivers = useGetDriverQuery(
		isDialog
			? { status: 1, page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters }
			: { page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters || isPhone }
	);

	const infiniteDrivers = useGetInfiniteDriverInfiniteQuery(
		isDialog
			? { status: 1, per_page: 10, ...filters }
			: { page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters || !isPhone }
	);

	const [changeDriverStatusfn, changeDriverStatusResult] = useChangeDriverStatusMutation();

	useEffect(() => {
		if (changeDriverStatusResult.isSuccess) {
			setCustomDialogProps({ ...EmptyCustomDialoProps });
			SweetAlertToast.fire({
				title: changeDriverStatusResult.data.message,
				icon: "success",
			});
		}
	}, [changeDriverStatusResult]);

	const handleActiveOrInActiveUser = (userId: number, status: 0 | 1) => {
		changeDriverStatusfn({
			userId,
			body: {
				status,
			},
		});
	};

	const handleTaggleButton = (e: any, userId: number) => {
		if (e.target.checked) {
			setCustomDialogProps({
				children: (
					<div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
						<p className="font-semibold text-lg">آیا از فعال کردن این راننده مطمئن هستید ؟</p>
						<div className="flex items-center justify-around w-full">
							<Button
								loading={changeDriverStatusResult.isLoading}
								variant="contained"
								className="px-10"
								onClick={() => {
									handleActiveOrInActiveUser(userId, 1);
								}}
							>
								بله
							</Button>
							<Button
								variant="outlined"
								className="px-10"
								onClick={() => {
									setCustomDialogProps({ ...EmptyCustomDialoProps });
								}}
								sx={{ color: "red", borderColor: "red" }}
							>
								خیر
							</Button>
						</div>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialogProps({ ...EmptyCustomDialoProps });
				},
				show: true,
			});
		} else {
			setCustomDialogProps({
				children: (
					<div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
						<p className="font-semibold text-lg">آیا از غیر فعال کردن این راننده مطمئن هستید ؟</p>
						<div className="flex items-center justify-around w-full">
							<Button
								loading={changeDriverStatusResult.isLoading}
								variant="contained"
								className="px-10"
								onClick={() => {
									handleActiveOrInActiveUser(userId, 0);
								}}
							>
								بله
							</Button>
							<Button
								variant="outlined"
								className="px-10"
								onClick={() => {
									setCustomDialogProps({ ...EmptyCustomDialoProps });
								}}
								sx={{ color: "red", borderColor: "red" }}
							>
								خیر
							</Button>
						</div>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialogProps({ ...EmptyCustomDialoProps });
				},
				show: true,
			});
		}
	};

	const handleChoiceDriver = (row: any) => {
		onSuccess?.(row);
	};

	const handleEditDriver = (data) => {
		navigate(`/dashboard/drivers/add-driver?mode=EDIT&nationalCode=${data.drivers_info.national_code}`);
	};

	const columns: GridColDef<any>[] = [
		{
			field: "count",
			align: "center",
			headerName: "",
			width: 32,
			editable: false,
		},
		{
			field: "actions",
			headerName: "عملیات",
			align: "center",
			type: "actions",
			renderCell: ({ row }) =>
				isDialog ? (
					<IconButton
						title="انتخاب"
						onClick={() => handleChoiceDriver(row)}
					>
						<TickSquare
							size="24"
							className="text-primary"
						/>
					</IconButton>
				) : (
					<IconButton
						title="ویرایش"
						onClick={() => handleEditDriver(row)}
					>
						<Edit
							size="24"
							className="text-amber-400"
						/>
					</IconButton>
				),
		},
		{
			field: "status",
			headerName: "وضعیت",
			// flex: 1,
			// minWidth: 195,
			headerAlign: "center",
			align: "center",
			renderCell: ({ row }) => (
				<div className="flex items-center justify-center">
					{changeDriverStatusResult.isLoading && changeDriverStatusResult.originalArgs.userId == row.id ? (
						<CircularProgress color="primary" />
					) : (
						<Switch
							checked={row?.status === "1"}
							onChange={(e) => {
								handleTaggleButton(e, row.id);
							}}
						/>
					)}
				</div>
			),
		},
		{
			field: "national_code",
			headerName: "کد ملی",
			flex: 1,
			minWidth: 160,
			headerAlign: "center",
			align: "center",
			valueGetter: (_, row) => {
				return row?.drivers_info?.national_code;
			},
		},
		{
			field: "full_name",
			headerName: "نام و نام خانوادگی",
			flex: 1,
			minWidth: 160,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "father_name",
			headerName: "نام پدر",
			flex: 0.5,
			minWidth: 120,
			headerAlign: "center",
			align: "center",
			valueGetter: (_, row) => {
				return row?.drivers_info?.father_name;
			},
		},
		{
			field: "phone_number",
			headerName: "شماره همراه",
			flex: 1,
			minWidth: 160,
			headerAlign: "center",
			align: "center",
		},
		{
			field: "birthdate",
			headerName: "تاریخ تولد",
			flex: 1,
			minWidth: 100,
			// flex:2,
			headerAlign: "center",
			align: "center",
			valueGetter: (_, row) => {
				const data = row?.drivers_info?.birthdate;
				return GetShamsiDate(data);
			},
		},
		{
			field: "certificate_type",
			headerName: "نوع گواهی نامه",
			flex: 1,
			minWidth: 160,
			headerAlign: "center",
			align: "center",
			valueFormatter: (value) => (value === 1 ? "پایه یک" : value === 2 ? "پایه دو" : value === 3 ? "پایه دو تبصره 99" : ""),
		},
		{
			field: "certificate_validity",
			headerName: "اعتبار گواهی نامه",
			flex: 1,
			minWidth: 160,
			headerAlign: "center",
			align: "center",
			valueFormatter: (value) => GetShamsiDate(value),
		},
		{
			field: "smart_card_validity",
			headerName: "اعتبار هوشمند",
			flex: 1,
			minWidth: 100,
			// flex:2,
			headerAlign: "center",
			align: "center",
			valueGetter: (_, row) => {
				const data = row?.drivers_info?.smart_card_validity;
				return GetShamsiDate(data);
			},
		},
		{
			field: "health_card_validity",
			headerName: "اعتبار سلامت",
			flex: 1,
			minWidth: 100,
			headerAlign: "center",
			align: "center",
			valueGetter: (_, row) => {
				const data = row?.drivers_info?.health_card_validity;
				return GetShamsiDate(data);
			},
		},
	];

	const handleFilter = (filters: Record<string, string | number | boolean>) => {
		setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
		setFilters(filters);
	};

	return (
		<div className={"flex flex-col gap-8"}>
			<CustomDialog {...customDialogProps} />
			<div className="flex items-center gap-4 md:hidden">
				<UserSquare
					size="32"
					className="text-primary"
				/>
				<h2 className="font-bold text-xl">رانندگان</h2>
			</div>
			<SaferFilters
				mode="SEARCH_PARAMS"
				search={true}
				onFilter={handleFilter}
			/>
			<SaferGrid
				columns={columns}
				rows={
					isPhone
						? infiniteDrivers.data?.pages.map((page) => page.data.data).reduce((a, b) => [...a, ...b]) ?? []
						: drivers.data?.data.data ?? []
				}
				loading={drivers.isLoading || drivers.isFetching}
				renderCart={(data) => (
					<DriverCard
						isDialog={false}
						data={data}
						setCustomDialogProps={setCustomDialogProps}
						onSuccess={onSuccess}
					/>
				)}
				filterSetInUrl={!isDialog}
				onFilterChange={() => {}}
				onCloseFilterDialog={() => {}}
				openFilterDialog={false}
				renderFilter={() => <></>}
				columnVisibilityModel={columnVisibilityModel}
				onColumnVisibilityModelChange={setColumnVisibilityModel}
				paginatorProps={{
					...paginatorProps,
					totalPages: drivers.data?.data.last_page,
					onItemsPerPageChange: (pageSize) => setPaginatorProps((currentValue) => ({ ...currentValue, itemsPerPage: pageSize })),
					onPageChange: (page) => setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: page })),
				}}
				fetchMoreData={infiniteDrivers.fetchNextPage}
				hasMore={infiniteDrivers.hasNextPage}
			/>
		</div>
	);
}
