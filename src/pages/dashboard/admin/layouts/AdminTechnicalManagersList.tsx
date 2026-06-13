import ATechnicalManagerCard from "../../../../components/Admin/ATechnicalManagerCard";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import LoginAsDialog from "../../../../components/shared/dialogs/LoginAsDialog/LoginAsDialog";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import {
  useChangeAdminTechnicalManagerStatusMutation,
  useGetAdminInfiniteTechnicalManagersInfiniteQuery,
  useGetAdminTechnicalManagersQuery,
} from "../api/admin-technical-manager.api";
import AdminTechnicalManagersListProps from "../interfaces/admin-technical-managers-list-props.interface";
import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, Edit, Login, UserOctagon } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";

const AdminTechnicalManagersList: FC<AdminTechnicalManagersListProps> = ({
  onEditTechnicalManager,
  onAddTechnicalManager,
}) => {
  const isPhone = useIsPhone();

  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [loginAsTarget, setLoginAsTarget] = useState<{
    userId: number;
    fullName: string;
  } | null>(null);

  const technicalManagers = useGetAdminTechnicalManagersQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteTechnicalManagers =
    useGetAdminInfiniteTechnicalManagersInfiniteQuery(
      {
        page: paginatorProps.currentPage,
        per_page: paginatorProps.itemsPerPage,
        ...filters,
      },
      { skip: !paginatorProps || !filters || !isPhone },
    );

  const [changeTechnicalManagerStatusFn, changeTechnicalManagerStatusResult] =
    useChangeAdminTechnicalManagerStatusMutation();

  useEffect(() => {
    if (changeTechnicalManagerStatusResult.isSuccess)
      SweetAlertToast.fire({
        text: changeTechnicalManagerStatusResult.data.message,
        icon: "success",
      });
  }, [
    changeTechnicalManagerStatusResult.isSuccess,
    changeTechnicalManagerStatusResult.data,
  ]);

  const handleActive = (status: 0 | 1, userId: number) => {
    if (status)
      changeTechnicalManagerStatusFn({
        userId: userId,
        status: 0,
        description: "",
      });
    else
      changeTechnicalManagerStatusFn({
        userId: userId,
        status: 1,
        description: "",
      });
  };

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const columns: readonly GridColDef<any>[] = [
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
      align: "left",
      headerAlign: "left",
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          {changeTechnicalManagerStatusResult.isLoading &&
          changeTechnicalManagerStatusResult.originalArgs.userId == row.id ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              checked={row?.status === 1}
              onChange={() => {
                handleActive(row.status, row.id);
              }}
              className="rotate-180"
            />
          )}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "عملیات",
      align: "center",
      headerAlign: "left",
      width: 110,
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center">
          <IconButton
            title="ویرایش"
            onClick={() => onEditTechnicalManager(row)}
          >
            <Edit size="24" className="text-amber-400" />
          </IconButton>
          <IconButton
            title="ورود به‌جای کاربر"
            onClick={() =>
              setLoginAsTarget({
                userId: row.user_id,
                fullName: row.user.personal.full_name,
              })
            }
          >
            <Login size="24" className="text-primary" />
          </IconButton>
        </div>
      ),
    },
    // {
    // 	field: "images",
    // 	headerName: "",
    // 	cellClassName: "flex justify-center items-center",
    // 	renderCell: ({ row }) => (
    // 		<Avatar
    // 			src={STORAGE_URL + row.user.images.find((img) => img.image_type === "profile")?.url}
    // 			alt="عکس پروفایل"
    // 			sx={{ width: 48, height: 48 }}
    // 		/>
    // 	),
    // },
    {
      field: "full_name",
      headerName: "نام و نام خانوادگی",
      align: "left",
      headerAlign: "left",
      editable: false,
      flex: 1,
      valueGetter: (_value, row) => row.user.personal.full_name,
    },
    {
      field: "national_code",
      headerName: "کد ملی",
      align: "center",
      headerAlign: "left",
      editable: false,
      flex: 0.5,
      valueGetter: (_value, row) => row.user.personal.national_code,
    },
    {
      field: "type",
      headerName: "حوزه فعالیت",
      align: "left",
      headerAlign: "left",
      editable: false,
      flex: 0.5,
      valueFormatter: (value) =>
        value === 1
          ? "باری"
          : value === 2
            ? "مسافری"
            : value === 3
              ? "مسافری باری"
              : undefined,
    },
    {
      field: "username",
      headerName: "شماره تماس",
      align: "center",
      headerAlign: "left",
      editable: false,
      flex: 0.6,
      valueGetter: (_value, row) => row.user.personal.telephone,
    },
    {
      field: "companies",
      headerName: "شرکت ها",
      type: "string",
      editable: false,
      align: "left",
      flex: 1,
      valueGetter: (_value, row) =>
        row.companies.map((company) => company.name).join("، "),
    },
    {
      field: "capacity",
      headerName: "تعداد بازدید کل",
      align: "center",
      headerAlign: "left",
      editable: false,
      flex: 0.6,
    },
    {
      field: "passenger_capacity",
      headerName: "مسافری",
      align: "center",
      headerAlign: "left",
      editable: false,
      flex: 0.4,
    },
    {
      field: "freighter_capacity",
      headerName: "باری",
      align: "center",
      headerAlign: "left",
      editable: false,
      flex: 0.4,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <UserOctagon size="32" className="text-primary" />
          <h2 className="font-bold text-xl">لیست مدیران فنی</h2>
        </div>
        <Button
          className="hidden lg:flex"
          variant="contained"
          size="large"
          startIcon={<Add size="24" />}
          onClick={onAddTechnicalManager}
        >
          افزودن مدیر فنی
        </Button>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        filters={[
          {
            label: "حوزه فعالیت",
            field: "type",
            type: "select",
            options: [
              { value: "1", label: "باری" },
              { value: "2", label: "مسفاری" },
              { value: "3", label: "مسافری باری" },
            ],
          },
        ]}
        onFilter={handleFilter}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          technicalManagers.isLoading ||
          technicalManagers.isFetching ||
          infiniteTechnicalManagers.isLoading ||
          infiniteTechnicalManagers.isFetching
        }
        rows={
          isPhone
            ? (infiniteTechnicalManagers.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (technicalManagers.data?.data.data ?? [])
        }
        renderCart={(data) => (
          <ATechnicalManagerCard
            data={data.user.personal}
            isDialog={false}
            onLoginAs={() =>
              setLoginAsTarget({
                userId: data.user_id,
                fullName: data.user.personal.full_name,
              })
            }
          />
        )}
        filterSetInUrl
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        paginatorProps={{
          ...paginatorProps,
          totalPages: technicalManagers.data?.data.last_page,
          onItemsPerPageChange: (pageSize) =>
            setPaginatorProps((currentValue) => ({
              ...currentValue,
              itemsPerPage: pageSize,
            })),
          onPageChange: (page) =>
            setPaginatorProps((currentValue) => ({
              ...currentValue,
              currentPage: page,
            })),
        }}
        fetchMoreData={infiniteTechnicalManagers.fetchNextPage}
        hasMore={infiniteTechnicalManagers.hasNextPage}
      />
      <LoginAsDialog
        isOpen={!!loginAsTarget}
        userId={loginAsTarget?.userId ?? null}
        fullName={loginAsTarget?.fullName}
        onClose={() => setLoginAsTarget(null)}
      />
    </div>
  );
};

export default AdminTechnicalManagersList;

// () => (
// 	<div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-8 2xl:grid-cols-9 gap-y-4 gap-x-6 items-center justify-between p-4 mb-10">
// 		<h2 className="font-bold">جستجو براساس</h2>
// 		<TextField
// 			label="نام و نام خانوادگی"
// 			fullWidth
// 			className="col-span-2"
// 			InputProps={{
// 				sx: {
// 					borderRadius: "7px",
// 				},
// 			}}
// 		/>
// 		<TextField
// 			label="کد ملی"
// 			fullWidth
// 			className="col-span-2"
// 			InputProps={{
// 				sx: {
// 					borderRadius: "7px",
// 				},
// 			}}
// 		/>
// 		<TextField
// 			label="وضعیت "
// 			fullWidth
// 			className="col-span-2"
// 			InputProps={{
// 				sx: {
// 					borderRadius: "7px",
// 				},
// 			}}
// 		/>
// 	</div>
// );
