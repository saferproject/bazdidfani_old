import { useSendOTPWithoutCheckMutation } from "../../api/Auth/OTP-with-token";
import { useChangeCompanyUserStatusMutation, useGetCompanyUsersQuery, useGetInfiniteCompanyUsersInfiniteQuery } from "../../api/Company/Users";
import { useCheckOTPForCompanyUserMutation } from "../../api/Profile/Profile";
import SaferGrid from "../../components/shared/DataGrid/SaferGrid";
import CustomDialog, { CustomDialogProps, EmptyCustomDialoProps } from "../../components/shared/Dialog/CustomeDialog";
import SaferFilters from "../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../components/shared/Functions/SweetAlertToast";
import PermissionPage from "../../components/User/PermissionContainer";
import UserItemsDialog from "../../components/User/UserDialog";
import UsersCard from "../../components/User/UsersCard";
import { EmptyProfileData, ProfileDataType } from "../../types/ProfileType";
import { NewUserType } from "../../types/RegisterUsersType";
import useIsPhone from "../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDate } from "../../utilities/DateTime";
import { Avatar, Button, CircularProgress, Dialog, DialogContent, Fab, Switch, TextField, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, User } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";



























export default function Users() {
  const isPhone = useIsPhone();

  const [openVerifyUserDialog, setOpenVerifyUserDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userprofileData, setUserProfileData] = useState<ProfileDataType>({
    ...EmptyProfileData,
  });
  const [SelectedRow, setSelectedRow] = useState(null);
  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);

  const {
    register,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<NewUserType>();

  const { phone_number, token } = useWatch({
    control,
  });

  const [customDialogProps, setCustomDialogProps] = useState<CustomDialogProps>(
    { ...EmptyCustomDialoProps },
  );

  const users = useGetCompanyUsersQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteUsers = useGetInfiniteCompanyUsersInfiniteQuery(
    { per_page: 10, ...filters },
    { skip: !paginatorProps || !filters || !isPhone },
  );

  const [sendOTPWithoutCheckFn, sendOTPWithoutCheckResult] =
    useSendOTPWithoutCheckMutation();

  const [changeStatusFn, changeStatusResult] =
    useChangeCompanyUserStatusMutation();

  useEffect(() => {
    if (changeStatusResult.isSuccess)
      setCustomDialogProps({ ...EmptyCustomDialoProps });
  }, [changeStatusResult.isSuccess]);

  useEffect(() => {
    if (sendOTPWithoutCheckResult.isSuccess)
      SweetAlertToast.fire({
        title: sendOTPWithoutCheckResult.data.message,
        icon: "success",
      });
  }, [sendOTPWithoutCheckResult]);

  const [validateOtpFn, validateOtpResult] =
    useCheckOTPForCompanyUserMutation();

  useEffect(() => {
    if (validateOtpResult.isSuccess) {
      setUserProfileData({
        ...EmptyProfileData,
        ...validateOtpResult.data.data.userResponse?.personal,
        user_id: validateOtpResult.data.data.userResponse.id,
        phone: phone_number!,
      });
      SweetAlertToast.fire({
        title: validateOtpResult.data.message,
        icon: "success",
      });
      setOpenProfileDialog(true);
      setOpenVerifyUserDialog(false);
    }
  }, [validateOtpResult, phone_number]);

  const showPermissionPage = useMemo(() => {
    return !!searchParams.get("user_id");
  }, [searchParams]);

  const handleChangeUserStatus = (row) => {
    setSelectedRow({ ...row });
    setCustomDialogProps({
      title: row?.status === "active" ? "غیرفعال" : "فعال",
      children: (
        <Typography variant="body2">
          آیا از {row?.status === "active" ? "غیرفعال" : "فعال"} کردن این کاربر
          مطمئنید؟
        </Typography>
      ),
      hasOnClose: true,
      onClose: () => {
        setCustomDialogProps({ ...EmptyCustomDialoProps });
      },
      show: true,
      maxWidth: "xs",
      fullWidth: true,
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
      field: "actions2",
      headerName: "وضعیت",
      type: "actions",
      // width: 200,
      cellClassName: "actions",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-center">
          {changeStatusResult.isLoading &&
          changeStatusResult.originalArgs.userId == row.id ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              checked={row?.status === "active"}
              onClick={() => handleChangeUserStatus(row)}
            />
          )}
        </div>
      ),
    },
    {
      field: "[profile]",
      headerName: "تصویر",
      align: "center",
      headerAlign: "left",
      width: 100,
      editable: false,
      renderCell: () => <Avatar className="rounded-full w-[60px] h-[60px]" />,
    },
    {
      field: "full_name",
      headerName: "نام و نام خانوادگی",
      align: "center",
      headerAlign: "left",
      width: 180,
      editable: false,
    },
    {
      field: "father_name",
      headerName: "نام پدر",
      align: "center",
      headerAlign: "left",
      width: 180,
      editable: false,
    },
    {
      field: "phone",
      headerName: "شماره تماس",
      align: "center",
      headerAlign: "left",
      width: 140,
      editable: false,
    },
    {
      field: "national_code",
      headerName: "کد ملی",
      align: "center",
      headerAlign: "left",
      width: 140,
      editable: false,
    },
    {
      field: "telephone",
      headerName: "تلفن ثابت",
      align: "center",
      headerAlign: "left",
      width: 140,
      editable: false,
    },
    {
      field: "birthdate",
      headerName: "تاریخ تولد",
      align: "center",
      headerAlign: "left",
      width: 140,
      editable: false,
      valueGetter: (item) => GetShamsiDate(item),
    },
    {
      field: "email",
      headerName: "ایمیل",
      align: "center",
      headerAlign: "left",
      width: 180,
      editable: false,
    },
  ];

  if (showPermissionPage) {
    return <PermissionPage />;
  }

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <Dialog
        open={openVerifyUserDialog}
        onClose={() => setOpenVerifyUserDialog(false)}
      >
        <DialogContent className="flex flex-col gap-4">
          <div className="flex gap-4 items-center mb-4">
            <User size="32" className="text-primary" />
            <h3 className="font-semibold text-xl">افزودن کاربر جدید</h3>
          </div>
          <TextField
            type="text"
            label="شماره همراه"
            error={!!errors.nameLastname}
            helperText={errors.nameLastname?.message ?? ""}
            {...register("phone_number")}
            slotProps={{
              htmlInput: { maxLength: 11 },
            }}
            fullWidth
          />
          <Button
            fullWidth
            variant="contained"
            onClick={async () => {
              const isValid = await trigger("phone_number");
              isValid && sendOTPWithoutCheckFn({ phone: phone_number! });
            }}
            disabled={!watch("phone_number")}
            loading={sendOTPWithoutCheckResult.isLoading}
          >
            ارسال کد اعتبار سنجی
          </Button>
          <TextField
            type="text"
            label="کد اعتبار سنجی"
            error={!!errors.nationalCode}
            helperText={errors.nationalCode?.message ?? ""}
            fullWidth
            {...register("token")}
            slotProps={{
              htmlInput: { maxLength: 4 },
            }}
          />
          <Button
            variant="contained"
            onClick={async () => {
              const isValid = await trigger(["token", "phone_number"]);
              isValid &&
                validateOtpFn({
                  token: token!,
                  data: phone_number!,
                  forgot: true,
                  "forget-pass": false,
                  two_authentication: false,
                });
            }}
            className="flex items-center justify-between"
            fullWidth
            disabled={!watch("token")}
            loading={validateOtpResult.isLoading}
            endIcon={<FaArrowLeft />}
          >
            استعلام کاربر
          </Button>
        </DialogContent>
      </Dialog>
      <UserItemsDialog
        defaultValues={userprofileData}
        onClose={() => {
          setOpenProfileDialog(false);
        }}
        open={openProfileDialog}
        onSuccess={(data) => {
          setOpenProfileDialog(false);
          const params = new URLSearchParams(searchParams);
          params.set("user_id", data.user_id);
          navigate(`?${params.toString()}`);
        }}
        isExist={!!validateOtpResult.data?.data.userResponse?.personal}
      />
      <CustomDialog
        {...customDialogProps}
        dialogActions={
          <div className="w-full flex items-center justify-center gap-4">
            <Button
              onClick={() => {
                changeStatusFn({
                  userId: SelectedRow?.id,
                  body: {
                    status: SelectedRow?.status === "active" ? 0 : 1,
                  },
                });
              }}
              loading={changeStatusResult.isLoading}
              variant="contained"
            >
              تایید
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                setCustomDialogProps({ ...EmptyCustomDialoProps });
              }}
            >
              لغو
            </Button>
          </div>
        }
      />

      <div className="lg:flex hidden justify-between items-center">
        <div className="flex items-center gap-4">
          <User size="32" className="text-primary" />
          <h2 className="font-bold text-xl">کابران شرکت</h2>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Add size="24" />}
          className="hidden lg:flex"
          onClick={() => setOpenVerifyUserDialog(true)}
        >
          افزودن کاربر
        </Button>
      </div>
      <Fab
        className="fixed bottom-8 right-8"
        onClick={() => setOpenVerifyUserDialog(true)}
        size="medium"
        color="primary"
      >
        <Add size="24" />
      </Fab>
      <div className="flex md:justify-center md:hidden items-center gap-4 mb-4">
        <User size="32" className="text-primary" />
        <h2 className="font-bold text-xl">کاربران شرکت</h2>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        onFilter={handleFilter}
      />
      <div className="mb-4"></div>
      <SaferGrid
        columns={columns}
        rows={
          isPhone
            ? (infiniteUsers.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (users.data?.data.data ?? [])
        }
        loading={users.isLoading || users.isFetching}
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderCart={(data) => (
          <UsersCard
            isDialog={false}
            onStatusChange={handleChangeUserStatus}
            data={data}
          />
        )}
        renderFilter={() => <></>}
        filterSetInUrl
        paginatorProps={{
          ...paginatorProps,
          totalPages: users.data?.data.last_page,
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
        fetchMoreData={infiniteUsers.fetchNextPage}
        hasMore={infiniteUsers.hasNextPage}
      />
    </div>
  );
}
