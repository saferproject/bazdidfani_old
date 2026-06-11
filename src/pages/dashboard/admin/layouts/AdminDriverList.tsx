import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import LoginAsDialog from "../../../../components/shared/dialogs/LoginAsDialog/LoginAsDialog";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDate } from "../../../../utilities/DateTime";
import {
  useAdminChangeDriverStatusMutation,
  useGetDriversQuery,
  useGetInfiniteDriversInfiniteQuery,
} from "../api/admin-driver.api";
import AdminDriverListProps from "../interfaces/admin-driver-list-props.interface";
import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, Edit, Login, UserSquare } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";

const AdminDriverList: FC<AdminDriverListProps> = ({
  onAddDriver,
  onEditDriver,
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

  const drivers = useGetDriversQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteDrivers = useGetInfiniteDriversInfiniteQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || !isPhone },
  );

  const [changeDriverStatusFn, changeDriverStatusResult] =
    useAdminChangeDriverStatusMutation();

  useEffect(() => {
    if (changeDriverStatusResult.isSuccess)
      SweetAlertToast.fire({
        title: changeDriverStatusResult.data.message,
        icon: "success",
      });
  }, [changeDriverStatusResult.isSuccess, changeDriverStatusResult.data]);

  const handleActive = (checked: boolean, userId: number) => {
    if (checked)
      changeDriverStatusFn({
        user_id: userId,
        description: "",
        status: 0,
      });
    else
      changeDriverStatusFn({
        user_id: userId,
        description: "",
        status: 1,
      });
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
      flex: 0.5,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          {changeDriverStatusResult.isLoading &&
          changeDriverStatusResult.originalArgs.user_id == row.id ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              checked={row.driver[0].status === 1}
              onChange={() => handleActive(!!row.driver[0].status, row.id)}
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
      editable: false,
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center">
          <IconButton title="ویرایش" onClick={() => onEditDriver(row)}>
            <Edit size="24" className="text-amber-400" />
          </IconButton>
          {row.driver?.[0]?.user && (
            <IconButton
              title="ورود به‌جای کاربر"
              onClick={() =>
                setLoginAsTarget({
                  userId: row.driver[0].user.id,
                  fullName: row.driver[0].full_name,
                })
              }
            >
              <Login size="24" className="text-primary" />
            </IconButton>
          )}
        </div>
      ),
    },
    {
      field: "full_name",
      headerName: "نام و نام خانوادگی",
      align: "left",
      width: 200,
      headerAlign: "left",
      editable: false,
      valueGetter: (_value, row) => row.driver[0].full_name,
    },
    {
      field: "national_code",
      headerName: "کد ملی",
      flex: 1,
      align: "center",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "phone_number",
      headerName: "شماره همراه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
      valueGetter: (_value, row) => row.driver[0].phone_number,
    },
    {
      field: "certificate_type",
      headerName: "نوع گواهی نامه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
      valueGetter: (_value, row) => row.driver[0].certificate_type,
      valueFormatter: (value: number) => {
        switch (value) {
          case 1:
            return "پایه یک";

          case 2:
            return "پایه دو";

          case 3:
            return "پایه دو تبصره 99";

          default:
            return "";
        }
      },
    },
    {
      field: "certificate_number",
      headerName: "شماره گواهی نامه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
    },
    {
      field: "certificate_validity",
      headerName: "اعتبار گواهی نامه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
      valueFormatter: (value) => (value ? GetShamsiDate(value) : ""),
    },
    {
      field: "insurance_number",
      headerName: "شماره بیمه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
    },
    {
      field: "health_card_validity",
      headerName: "اعتبار کارت بیمه",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
      valueFormatter: (value) => (value ? GetShamsiDate(value) : ""),
    },
    {
      field: "birthdate",
      headerName: "تاریخ تولد",
      align: "center",
      headerAlign: "left",
      flex: 1,
      editable: false,
      valueFormatter: (value) => (value ? GetShamsiDate(value) : ""),
    },
  ];

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserSquare size="32" className="text-primary" />
          <h2 className="font-bold text-xl">لیست رانندگان</h2>
        </div>
        <Button
          className="hidden lg:flex"
          variant="contained"
          size="large"
          startIcon={<Add size="24" />}
          onClick={onAddDriver}
        >
          افزودن راننده
        </Button>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        filters={[
          {
            label: "نوع گواهی نامه",
            field: "certificate_type",
            type: "select",
            options: [
              { value: "1", label: "پایه یک" },
              { value: "2", label: "پایه دو" },
              { value: "3", label: "پایه دو تبصره 99" },
            ],
          },
        ]}
        onFilter={handleFilter}
        onGetExcel={() => {}}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          drivers.isLoading ||
          drivers.isFetching ||
          infiniteDrivers.isLoading ||
          infiniteDrivers.isFetching
        }
        rows={
          isPhone
            ? (infiniteDrivers.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (drivers.data?.data.data ?? [])
        }
        renderCart={() => <></>}
        filterSetInUrl
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        paginatorProps={{
          ...paginatorProps,
          totalPages: drivers.data?.data.last_page,
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
        fetchMoreData={infiniteDrivers.fetchNextPage}
        hasMore={infiniteDrivers.hasNextPage}
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

export default AdminDriverList;
