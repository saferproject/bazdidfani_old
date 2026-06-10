import ACompaniesCard from "../../../../components/Admin/ACompaniesCard";
import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { RoleType } from "../../../../types/RoleType";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDateTime } from "../../../../utilities/DateTime";
import {
  useChangeCompanyStatusMutation,
  useGetAllCompaniesQuery,
  useGetInfiniteAllCompaniesInfiniteQuery,
} from "../api/admin-company.api";
import CompanyListProps from "../interfaces/company-list-props.interface";
import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, Buildings, Edit, Login } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";
import LoginAsDialog from "../../../../components/shared/dialogs/LoginAsDialog/LoginAsDialog";

const AdminCompanyList: FC<CompanyListProps> = ({
  onAddCompany,
  onEditCompany,
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

  const companies = useGetAllCompaniesQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteCompanies = useGetInfiniteAllCompaniesInfiniteQuery(
    { per_page: 10, ...filters },
    { skip: !paginatorProps || !filters || !isPhone },
  );

  const [changeCompanyStatusFn, changeCompanyStatusResult] =
    useChangeCompanyStatusMutation();

  useEffect(() => {
    if (changeCompanyStatusResult.isSuccess)
      SweetAlertToast.fire({
        title: changeCompanyStatusResult.data.message,
        icon: "success",
      });
  }, [changeCompanyStatusResult.isSuccess, changeCompanyStatusResult.data]);

  const handleActive = (e: any, userId: number) => {
    if (e.target.checked)
      changeCompanyStatusFn({
        userId: userId,
        role: RoleType.company,
        status: 3,
      });
    else
      changeCompanyStatusFn({
        userId: userId,
        role: RoleType.company,
        status: 2,
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
      field: "action",
      headerName: "عملیات",
      align: "center",
      width: 110,
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center">
          <IconButton title="ویرایش" onClick={() => onEditCompany(row)}>
            <Edit size="24" className="text-amber-400" />
          </IconButton>
          <IconButton
            title="ورود به‌جای کاربر"
            onClick={() =>
              setLoginAsTarget({
                userId: row.user_id,
                fullName: row.user?.personal?.full_name ?? row.name,
              })
            }
          >
            <Login size="24" className="text-primary" />
          </IconButton>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "وضعیت",
      align: "center",
      headerAlign: "left",
      width: 64,
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center w-full">
          {changeCompanyStatusResult.isLoading &&
          changeCompanyStatusResult.originalArgs.userId == row.user_id ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              disabled={
                row?.status === 0 ||
                (changeCompanyStatusResult.isLoading &&
                  changeCompanyStatusResult.originalArgs?.userId === row.id)
              }
              checked={row?.status === 3}
              onChange={(e) => {
                handleActive(e, row.user_id);
              }}
              className="rotate-180"
            />
          )}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "نام شرکت",
      align: "left",
      width: 220,
      headerAlign: "left",
      editable: false,
    },
    {
      field: "branch_code",
      headerName: "کد شعبه",
      align: "center",
      width: 96,
      headerAlign: "left",
      editable: false,
    },
    {
      field: "organization_code",
      headerName: "کد سازمانی",
      align: "right",
      width: 100,
      headerAlign: "left",
      editable: false,
    },
    {
      field: "created_at",
      headerName: "زمان احراز هویت",
      width: 160,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (value) => GetShamsiDateTime(value),
    },
    {
      field: "user",
      headerName: "کاربر",
      width: 160,
      align: "left",
      headerAlign: "center",
      editable: false,
      valueGetter: (_value, row) => row.user.personal?.full_name ?? "",
    },
    {
      field: "ceo_name",
      headerName: "مدیر عامل",
      width: 160,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "ceo_phone",
      headerName: "شماره تماس",
      align: "left",
      headerAlign: "left",
      width: 110,
      editable: false,
    },
    {
      field: "coordinator_name",
      headerName: "رابط فنی",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "coordinator_phone",
      headerName: "شماره تماس",
      align: "left",
      headerAlign: "left",
      width: 110,
      editable: false,
    },
    {
      field: "company_usage",
      headerName: "نوع کاربری",
      align: "left",
      width: 100,
      headerAlign: "left",
      editable: false,
      valueFormatter: (value: number) => {
        switch (value) {
          case 1:
            return "باری";

          case 2:
            return "مسافری";

          case 3:
            return "مسافری باری";

          default:
            return "نامشخص";
        }
      },
    },
    {
      field: "city",
      headerName: "شهر",
      align: "left",
      width: 128,
      headerAlign: "left",
      editable: false,
      valueGetter: (_value, row) => row.cities?.name ?? "",
    },
    {
      field: "address",
      headerName: "آدرس",
      align: "left",
      flex: 1,
      minWidth: 320,
      headerAlign: "left",
      editable: false,
    },
  ];

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Buildings size="32" className="text-primary" />
          <h2 className="font-bold text-xl">لیست شرکت های حمل و نقل</h2>
        </div>
        <Button
          className="hidden lg:flex"
          variant="contained"
          size="large"
          startIcon={<Add size="24" />}
          onClick={onAddCompany}
        >
          افزودن شرکت
        </Button>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        date={true}
        filters={[
          {
            label: "کاربری",
            field: "company_usage",
            type: "select",
            options: [
              { value: "1", label: "باری" },
              { value: "2", label: "مسافری" },
              { value: "3", label: "مسافری باری" },
            ],
          },
        ]}
        onFilter={handleFilter}
        onGetExcel={() => {}}
      />
      <SaferGrid<any>
        columns={columns}
        loading={companies.isLoading}
        rows={
          isPhone
            ? (infiniteCompanies.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (companies.data?.data.data ?? [])
        }
        renderCart={(data) => <ACompaniesCard data={data} isDialog={false} />}
        filterSetInUrl
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        paginatorProps={{
          ...paginatorProps,
          totalPages: companies.data?.data.last_page,
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
        fetchMoreData={infiniteCompanies.fetchNextPage}
        hasMore={infiniteCompanies.hasNextPage}
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

export default AdminCompanyList;
