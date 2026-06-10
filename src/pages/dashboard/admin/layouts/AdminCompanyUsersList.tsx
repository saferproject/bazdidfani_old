import { CircularProgress, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { FC, useEffect, useState } from "react";
import AdminCompanyUsersListProps from "../interfaces/admin-company-users-list-props.interface";
import { useChangeAdminCompanyUserStatusMutation, useGetAdminCompanyUsersQuery } from "../api/admin-company-users.api";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { GetShamsiDate } from "../../../../utilities/DateTime";
import { User } from "iconsax-reactjs";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";

const AdminCompanyUsersList: FC<AdminCompanyUsersListProps> = () => {
	const [paginatorProps, setPaginatorProps] = useState({ currentPage: 1, itemsPerPage: 10 });
	const [filters, setFilters] = useState(null);

	const users = useGetAdminCompanyUsersQuery(
		{ page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters }
	);

	const [changeAdminCompanyUserStatusFn, changeAdminCompanyUserStatusResult] = useChangeAdminCompanyUserStatusMutation();

	const handleChangeStatus = (active: boolean, id: number) => {
		if (active) changeAdminCompanyUserStatusFn({ status: 0, id, admin_description: "" });
		else changeAdminCompanyUserStatusFn({ status: 1, id, admin_description: "" });
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
				<div className="flex items-center justify-center">
					{changeAdminCompanyUserStatusResult.isLoading && changeAdminCompanyUserStatusResult.originalArgs.id == row.id ? (
						<CircularProgress color="primary" />
					) : (
						<Switch
							checked={row.status === "active"}
							onChange={() => handleChangeStatus(row.status === "active", row.id)}
							className="rotate-180"
						/>
					)}
				</div>
			),
		},
		{
			field: "full_name",
			headerName: "نام و نام خانوادگی",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.user.personal.full_name,
		},
		{
			field: "father_name",
			headerName: "نام پدر",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.user.personal.full_name,
		},
		{
			field: "national_code",
			headerName: "کد ملی",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.user.personal.national_code,
		},
		{
			field: "company",
			headerName: "شرکت",
			type: "string",
			editable: false,
			align: "center",
			flex: 1.5,
			valueGetter: (_value, row) => row.company.name,
		},
		{
			field: "phone",
			headerName: "شماره همراه",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.user.personal.phone,
		},
		{
			field: "telephone",
			headerName: "شماره ثابت",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.user.personal.telephone,
		},
		{
			field: "birthdate",
			headerName: "تاریخ تولد",
			type: "date",
			editable: false,
			align: "center",
			flex: 1,
			valueFormatter: (_value, row) => (row.user.personal.birthdate ? GetShamsiDate(row.user.personal.birthdate) : ""),
		},
		// {
		// 	field: "VIN",
		// 	headerName: "VIN",
		// 	type: "string",
		// 	editable: false,
		// 	align: "center",
		// 	flex: 1,
		// },
		// {
		// 	field: "loader",
		// 	headerName: "نوع بارگیر",
		// 	type: "string",
		// 	editable: false,
		// 	align: "center",
		// 	flex: 1,
		// 	valueGetter: (_value, row) => row.loader.name,
		// },
		// {
		// 	field: "owner_phone_number",
		// 	headerName: "شماره همراه مالک",
		// 	type: "string",
		// 	editable: false,
		// 	align: "center",
		// 	flex: 1,
		// 	valueGetter: (_value, row) => row.trucks_info[0].owner_phone_number,
		// },
	];

	useEffect(() => {
		if (changeAdminCompanyUserStatusResult.isSuccess)
			SweetAlertToast.fire({
				icon: "success",
				text: changeAdminCompanyUserStatusResult.data.message,
			});
	}, [changeAdminCompanyUserStatusResult.isSuccess, changeAdminCompanyUserStatusResult.data]);

	return (
		<section className="flex flex-col gap-8">
			<header className="flex items-center gap-4">
				<User
					size="24"
					className="text-primary"
				/>
				<h2 className="text-xl font-bold">کاربران شرکت ها</h2>
			</header>
			<main className="flex flex-col gap-8">
				<SaferFilters
					mode="SEARCH_PARAMS"
					search={true}
					onFilter={handleFilter}
				/>
				<SaferGrid<any>
					columns={columns}
					loading={users.isLoading || users.isFetching}
					rows={users.data?.data.data ?? []}
					renderCart={() => <></>}
					filterSetInUrl
					onCloseFilterDialog={() => {}}
					onFilterChange={() => {}}
					openFilterDialog={false}
					renderFilter={() => <></>}
					paginatorProps={{
						...paginatorProps,
						totalPages: users.data?.data.last_page,
						onItemsPerPageChange: (pageSize) => setPaginatorProps((currentValue) => ({ ...currentValue, itemsPerPage: pageSize })),
						onPageChange: (page) => setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: page })),
					}}
				/>
			</main>
		</section>
	);
};

export default AdminCompanyUsersList;
