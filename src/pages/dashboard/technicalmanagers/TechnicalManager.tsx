import { useGetInfiniteTechnicalManagerInfiniteQuery, useGetTechnicalManagerQuery } from "../../../api/Categories/TechnicalManager";
import { useChangeTechnicalManagerStatusMutation } from "../../../api/TechnicalManager/TechnicalManager";
import ATechnicalManagerCard from "../../../components/Admin/ATechnicalManagerCard";
import SaferGrid from "../../../components/shared/DataGrid/SaferGrid";
import CustomeDialog, { CustomDialogProps, EmptyCustomDialoProps } from "../../../components/shared/Dialog/CustomeDialog";
import SaferFilters from "../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import LoginAsDialog from "../../../components/shared/dialogs/LoginAsDialog/LoginAsDialog";
import { RoleType } from "../../../types/RoleType";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDate } from "../../../utilities/DateTime";
import EditTechnicalManagerDataDialog from "./dialogs/EditTechnicalManagerDataDialog";
import EditTechnicalManagerDataDialogProps from "./interfaces/edit-technical-manager-data-dialog-props.interface";
import { useAppSelector } from "../../../Stores/hooks";
import { API_URL } from "../../../Stores/api-urls";
import buildQueryParams from "../../../utilities/build-query-params";
import downloadExcelFile from "../../../utilities/download-excel";
import { Button, CircularProgress, IconButton, Switch, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, Edit, Login, UserOctagon } from "iconsax-reactjs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TechnicalManager() {
  const isPhone = useIsPhone();
  const token = useAppSelector((state) => state.user.token);

  const [customDialogprops, setCustomDialogProps] = useState<CustomDialogProps>(
    { ...EmptyCustomDialoProps },
  );
  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [loginAsTarget, setLoginAsTarget] = useState<{
    userId: number;
    fullName: string;
    tmWorkType: 1 | 2 | 3;
  } | null>(null);

  const handleCloseEditDialog = () => {
    setEditFormProps((currentValue) => ({
      ...currentValue,
      data: null,
      isOpen: false,
    }));
  };

  const handleOnEditSuccess = () => {
    handleCloseEditDialog();
  };

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const technicalManagers = useGetTechnicalManagerQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteTechnicalManager = useGetInfiniteTechnicalManagerInfiniteQuery(
    { per_page: 10, ...filters },
    { skip: !paginatorProps || !filters || !isPhone },
  );

  useEffect(() => {
    if (paginatorProps && filters && !isPhone) technicalManagers.refetch();
  }, [paginatorProps, filters, isPhone]);

  useEffect(() => {
    if (filters && isPhone) infiniteTechnicalManager.refetch();
  }, [filters, isPhone]);

  const [editFormProps, setEditFormProps] =
    useState<EditTechnicalManagerDataDialogProps>({
      isOpen: false,
      data: null,
      onClose: handleCloseEditDialog,
      onSuccess: handleOnEditSuccess,
    });

  const [changeStatusUserFn, changeStatusUserResult] =
    useChangeTechnicalManagerStatusMutation();

  useEffect(() => {
    if (changeStatusUserResult.isSuccess) {
      setCustomDialogProps({ ...EmptyCustomDialoProps });
      SweetAlertToast.fire({
        title: changeStatusUserResult.data.message,
        icon: "success",
      });
    }
  }, [changeStatusUserResult]);

  const handleChangeUserStatus = useCallback(
    (userId: number, status: 0 | 1) => {
      changeStatusUserFn({
        role: RoleType.technicalManager,
        userId: userId,
        status,
      });
    },
    [changeStatusUserFn],
  );

  const handleTaggleButton = useCallback(
    (e: any, userId: number) => {
      if (e.target.checked) {
        setCustomDialogProps({
          children: (
            <div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
              <p className="font-semibold text-lg">
                آیا از فعال کردن این مدیر فنی مطمئن هستید ؟
              </p>
              <div className="flex items-center justify-around w-full">
                <Button
                  loading={changeStatusUserResult.isLoading}
                  variant="contained"
                  className="px-10"
                  onClick={() => {
                    handleChangeUserStatus(userId, 1);
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
          fullWidth: true,
          maxWidth: "xs",
        });
      } else {
        setCustomDialogProps({
          children: (
            <div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
              <p className="font-semibold text-lg">
                آیا از غیر فعال کردن این مدیر فنی مطمئن هستید ؟
              </p>
              <div className="flex items-center justify-around w-full">
                <Button
                  loading={changeStatusUserResult.isLoading}
                  variant="contained"
                  className="px-10"
                  onClick={() => {
                    handleChangeUserStatus(userId, 0);
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
          fullWidth: true,
          maxWidth: "xs",
        });
      }
    },
    [changeStatusUserResult, handleChangeUserStatus],
  );

  const handleEditInspector = (data) => {
    setEditFormProps((currentValues) => ({
      ...currentValues,
      isOpen: true,
      data,
    }));
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
      field: "status",
      headerName: "وضعیت",
      // width: 195,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center">
          {changeStatusUserResult.isLoading ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              checked={row?.status === 1}
              onChange={(e) => {
                handleTaggleButton(e, row.id);
              }}
            />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        const hasFreighter = (row.freighter_capacity ?? 0) > 0;
        const hasPassenger = (row.passenger_capacity ?? 0) > 0;
        const tmWorkType: 1 | 2 | 3 = hasFreighter && hasPassenger ? 3 : hasPassenger ? 2 : 1;
        return (
          <div className="flex items-center justify-center">
            <IconButton title="ویرایش" onClick={() => handleEditInspector(row)}>
              <Edit size="24" className="text-amber-400" />
            </IconButton>
            <IconButton
              title="ورود به‌جای کاربر"
              onClick={() =>
                setLoginAsTarget({ userId: row.id, fullName: row.full_name, tmWorkType })
              }
            >
              <Login size="24" className="text-primary" />
            </IconButton>
          </div>
        );
      },
    },
    {
      field: "full_name",
      headerName: "نام و نام خانوادگی",
      width: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "national_code",
      headerName: "کد ملی",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "شماره همراه",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "capacity",
      headerName: "تعداد بازدید کل",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "passenger_capacity",
      headerName: "مسافری",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "freighter_capacity",
      headerName: "باری",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "start_cooperate",
      headerName: "تاریخ شروع",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value) => GetShamsiDate(value),
    },
    {
      field: "end_cooperate",
      headerName: "تاریخ پایان",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value) => GetShamsiDate(value),
    },
    {
      field: "remained",
      headerName: "روز های باقی مانده",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        const date: any = new Date(row.end_cooperate);
        const now: any = new Date();

        const diffTime = Math.abs(date - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) {
          return `${diffDays} روز`;
        } else {
          return <Typography color="red">به اتمام رسیده</Typography>;
        }
      },
    },
  ];

  const navigate = useNavigate();

  const handleClickAdd = () => {
    navigate("/dashboard/technicalmanagers/add-technicalmanager");
  };

  return (
    <div className="flex flex-col gap-y-4 overflow-x-hidden">
      <CustomeDialog {...customDialogprops} />
      {editFormProps.isOpen && (
        <EditTechnicalManagerDataDialog {...editFormProps} />
      )}
      <LoginAsDialog
        isOpen={!!loginAsTarget}
        userId={loginAsTarget?.userId ?? null}
        fullName={loginAsTarget?.fullName}
        tmWorkType={loginAsTarget?.tmWorkType}
        onClose={() => setLoginAsTarget(null)}
        isLoginFromUser
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserOctagon size="32" className="text-primary" />
          <h2 className="font-bold text-xl">مدیران فنی</h2>
        </div>
        <Button
          size="large"
          color="primary"
          variant="contained"
          startIcon={<Add size="24" />}
          className="hidden lg:flex"
          onClick={handleClickAdd}
        >
          افزودن مدیر فنی
        </Button>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        onFilter={handleFilter}
        onGetExcel={async () => {
          setExcelLoading(true);
          try {
            await downloadExcelFile(
              `${API_URL}/api/company/technicalManager/index/export/excel${filters ? "?" + buildQueryParams(filters) : ""}`,
              token,
              "مدیران فنی",
            );
          } finally {
            setExcelLoading(false);
          }
        }}
        excelLoading={excelLoading}
      />
      <SaferGrid
        filterSetInUrl
        columns={columns}
        rows={
          isPhone
            ? (infiniteTechnicalManager.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (technicalManagers.data?.data.data.map(
                (inspector) => ({ ...inspector.personal, id: inspector.user?.id }),
              ) ?? [])
        }
        loading={
          technicalManagers.isLoading ||
          technicalManagers.isFetching ||
          infiniteTechnicalManager.isLoading ||
          infiniteTechnicalManager.isFetching
        }
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderCart={(data) => <ATechnicalManagerCard data={data.personal} />}
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
        fetchMoreData={infiniteTechnicalManager.fetchNextPage}
        hasMore={infiniteTechnicalManager.hasNextPage}
      />
    </div>
  );
}
