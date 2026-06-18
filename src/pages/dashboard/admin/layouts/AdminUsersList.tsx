import { GridColDef } from "@mui/x-data-grid";
import { FC, useCallback, useState } from "react";
import { useGetAdminUsersQuery, useGetInfiniteAdminUsersInfiniteQuery, useGetUserRolesQuery } from "../api/admin-users.api";
import { useAppSelector } from "../../../../Stores/hooks";
import { API_URL } from "../../../../Stores/api-urls";
import { formatJalaliDate } from "../../../../utilities/DateTime";
import buildQueryParams from "../../../../utilities/build-query-params";
import downloadExcelFile from "../../../../utilities/download-excel";
import AdminUsersListProps from "../interfaces/admin-users-list-props.interface";
import { IconButton } from "@mui/material";
import { Edit, Login, SecurityUser, User as UserIcon } from "iconsax-reactjs";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import AdminChangeRoleStatus from "../../../../components/shared/dialogs/AdminChangeRoleStatus/AdminChangeRoleStatus";
import AdminChangeRoleStatusProps from "../../../../components/shared/dialogs/AdminChangeRoleStatus/interfaces/admin-change-role-status-props.interface";
import LoginAsDialog from "../../../../components/shared/dialogs/LoginAsDialog/LoginAsDialog";
import User from "../interfaces/user.interface";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import AUsersCard from "../../../../components/Admin/AUsersCard";

const AdminUsersList: FC<AdminUsersListProps> = ({ onEditUser }) => {
	const isPhone = useIsPhone();
	const token = useAppSelector((state) => state.user.token);

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
	const [excelLoading, setExcelLoading] = useState(false);
	const [changeRoleStatusDialog, setChangeRoleStatusDialog] = useState<AdminChangeRoleStatusProps>({
		isOpen: false,
		user: null,
		onClose: handleCloseChangeRoleStatusDialog,
	});
	const [loginAsTarget, setLoginAsTarget] = useState<{ userId: number; fullName: string } | null>(null);

	const users = useGetAdminUsersQuery(
		{ page: paginatorProps.currentPage, per_page: paginatorProps.itemsPerPage, ...filters },
		{ skip: !paginatorProps || !filters || isPhone }
	);

	const infiniteUsers = useGetInfiniteAdminUsersInfiniteQuery(
		{ per_page: 10, ...filters },
		{ skip: !paginatorProps || !filters || !isPhone }
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
			width: 120,
			editable: false,
			renderCell: ({ row }) => (
				<div>
					<IconButton title="ویرایش" onClick={() => onEditUser(row)}>
						<Edit size="24" className="text-amber-400" />
					</IconButton>
					<IconButton title="تغییر وضعیت" onClick={() => handleChangeRolesStatus(row)}>
						<SecurityUser size="24" className="text-blue-400" />
					</IconButton>
					<IconButton
						title="ورود به‌جای کاربر"
						onClick={() =>
							setLoginAsTarget({
								userId: row.id,
								fullName: row.personal?.full_name ?? "",
							})
						}
					>
						<Login size="24" className="text-primary" />
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
			field: "company_name",
			headerName: "نام شرکت",
			type: "string",
			editable: false,
			align: "left",
			width: 160,
			valueGetter: (_value, row) => row.company?.name ?? "",
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

	const handleGetExcel = useCallback(async () => {
		setExcelLoading(true);
		try {
			await downloadExcelFile(
				`${API_URL}/api/admin/user/users-list/export/excel${filters ? "?" + buildQueryParams(filters) : ""}`,
				token,
				"کل کاربران",
			);
		} finally {
			setExcelLoading(false);
		}
	}, [filters, API_URL, buildQueryParams, token, setExcelLoading]);

	return (
		<section className="flex flex-col gap-8">
			{changeRoleStatusDialog.isOpen && <AdminChangeRoleStatus {...changeRoleStatusDialog} />}
			<header className="flex items-center gap-4">
				<UserIcon size="24" className="text-primary" />
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
					onGetExcel={handleGetExcel}
					excelLoading={excelLoading}
				/>
				<SaferGrid<any>
					columns={columns}
					loading={
						users.isLoading ||
						users.isFetching ||
						infiniteUsers.isLoading ||
						infiniteUsers.isFetching
					}
					rows={
						isPhone
							? (infiniteUsers.data?.pages
									.map((page) => page.data.data)
									.reduce((a, b) => [...a, ...b]) ?? [])
							: (users.data?.data.data ?? [])
					}
					renderCart={(data) => (
						<AUsersCard
							data={data}
							onEditUser={onEditUser}
							onLoginAs={(userId, fullName) => setLoginAsTarget({ userId, fullName })}
							onChangeRolesStatus={handleChangeRolesStatus}
						/>
					)}
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
					fetchMoreData={infiniteUsers.fetchNextPage}
					hasMore={infiniteUsers.hasNextPage}
				/>
			</main>
			<LoginAsDialog
				isOpen={!!loginAsTarget}
				userId={loginAsTarget?.userId ?? null}
				fullName={loginAsTarget?.fullName}
				onClose={() => setLoginAsTarget(null)}
			/>
		</section>
	);
};

export default AdminUsersList;
