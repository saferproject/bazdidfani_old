import { GridColDef } from "@mui/x-data-grid";
import { FC, useState } from "react";
import { useGetAdminUsersQuery, useGetUserRolesQuery } from "../api/admin-users.api";
import { formatJalaliDate } from "../../../../utilities/DateTime";
import AdminUsersListProps from "../interfaces/admin-users-list-props.interface";
import { IconButton } from "@mui/material";
import { Edit, SecurityUser, User as UserIcon } from "iconsax-reactjs";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import AdminChangeRoleStatus from "../../../../components/shared/dialogs/AdminChangeRoleStatus/AdminChangeRoleStatus";
import AdminChangeRoleStatusProps from "../../../../components/shared/dialogs/AdminChangeRoleStatus/interfaces/admin-change-role-status-props.interface";
import User from "../interfaces/user.interface";

const AdminUsersList: FC<AdminUsersListProps> = ({ onEditUser }) => {
	const handleFilter = (filters: Record<string, string | number | boolean>) => {
		setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
		setFilters(filters);
	};

	const handleCloseChangeRoleStatusDialog = () =>
		setChangeRoleStatusDialog((currentValue) => ({ ...currentValue, isOpen: false, user: null }));

	const handleChangeRolesStatus = (user: User) => {
		setChangeRoleStatusDialog((currentValue) => ({
			...currentValue,
			isOpen: true,
			user,
		}));
	};

	const [paginatorProps, setPaginatorProps] = useState({ currentPage: 1, itemsPerPage: 10 });
	const [filters, setFilters] = useState(null);
	const [changeRoleStatusDialog, setChangeRoleStatusDialog] = useState<AdminChangeRoleStatusProps>({
		isOpen: false,
		user: null,
		onClose: handleCloseChangeRoleStatusDialog,
	});

	const users = useGetAdminUsersQuery(
		{ page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters }
	);

	const roles = useGetUserRolesQuery();

	const columns: GridColDef[] = [
		{
			field: "count",
			align: "center",
			headerName: "",
			width: 32,
			editable: false,
		},
		{
			field: "action",
			headerName: "عملیات",
			align: "center",
			headerAlign: "left",
			width: 96,
			editable: false,
			renderCell: ({ row }) => (
				<div>
					<IconButton
						title="ویرایش"
						onClick={() => onEditUser(row)}
					>
						<Edit
							size="24"
							className="text-amber-400"
						/>
					</IconButton>
					<IconButton
						title="تغییر وضعیت"
						onClick={() => handleChangeRolesStatus(row)}
					>
						<SecurityUser
							size="24"
							className="text-blue-400"
						/>
					</IconButton>
				</div>
			),
		},
		{
			field: "full_name",
			headerName: "نام و نام خانوادگی",
			type: "string",
			editable: false,
			align: "left",
			flex: 1,
			valueGetter: (_value, row) => row.personal?.full_name ?? "",
		},
		{
			field: "status",
			headerName: "وضعیت",
			type: "string",
			editable: false,
			align: "center",
			width: 120,
			cellClassName: (cell) => (cell.value === 1 ? "text-green-500" : "text-gray-500"),
			valueGetter: (_value, row) => row.personal?.status ?? "",
			valueFormatter: (value) => (value === 1 ? "فعال" : "غیر فعال"),
		},
		{
			field: "national_code",
			headerName: "کد ملی",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.personal?.national_code ?? "",
		},
		{
			field: "phone_number",
			headerName: "شماره همراه",
			type: "string",
			editable: false,
			align: "center",
			flex: 1,
			valueGetter: (_value, row) => row.personal?.phone ?? "",
		},
		{
			field: "roles",
			headerName: "نقش ها",
			type: "string",
			editable: false,
			align: "left",
			flex: 1,
			valueGetter: (_value, row) =>
				row.roles
					.filter((role) => role.role.name !== "user")
					.map((role) => role.role.description)
					.join("، "),
		},
		{
			field: 'company_name',
			headerName: 'نام شرکت',
			type: 'string',
			editable: false,
			align: 'left',
			width: 160,
			valueGetter: (_value, row) => row.company?.name ?? ''
		},
		{
			field: "city",
			headerName: "شهر",
			type: "string",
			editable: false,
			align: "left",
			width: 150,
			valueGetter: (_value, row) => row.personal?.cities?.name ?? "",
		},
		{
			field: "created_at",
			headerName: "زمان ثبت نام",
			type: "date",
			editable: false,
			align: "center",
			flex: 1,
			valueFormatter: (_value, row) => (row.created_at ? formatJalaliDate(row.created_at, "yyyy/MM/dd - hh:mm") : ""),
		},
	];

	return (
		<section className="flex flex-col gap-8">
			{changeRoleStatusDialog.isOpen && <AdminChangeRoleStatus {...changeRoleStatusDialog} />}
			<header className="flex items-center gap-4">
				<UserIcon
					size="24"
					className="text-primary"
				/>
				<h2 className="text-xl font-bold">کل کاربران</h2>
			</header>
			<main className="flex flex-col gap-8">
				<SaferFilters
					mode="SEARCH_PARAMS"
					search={true}
					date={true}
					filters={[
						{
							label: "نقش",
							field: "role_id",
							type: "select",
							options: roles.data?.map((role) => ({ label: role.description, value: role.id })) ?? [],
						},
					]}
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

export default AdminUsersList;
