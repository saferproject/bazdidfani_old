import {
  useChangeFleetStatusMutation,
  useDeleteFleetMutation,
  useGetFleetForCompanyQuery,
  useGetFleetForDriverQuery,
  useGetInfiniteFleetForCompanyInfiniteQuery,
  useGetInfiniteFleetForDriverInfiniteQuery,
} from "../../api/fleet/Fleet";
import { useAppSelector } from "../../Stores/hooks";
import { API_URL } from "../../Stores/api-urls";
import useIsPhone from "../../utilities/custom-hooks/use-is-phone";
import buildQueryParams from "../../utilities/build-query-params";
import { GetShamsiDate } from "../../utilities/DateTime";
import downloadExcelFile from "../../utilities/download-excel";
import Plate from "../shared/DataGrid/Plate";
import SaferGrid from "../shared/DataGrid/SaferGrid";
import CustomDialog, {
  CustomDialogProps,
  EmptyCustomDialoProps,
} from "../shared/Dialog/CustomeDialog";
import SaferTextDialogProps from "../shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";
import SaferTextDialog from "../shared/dialogs/TextDialog/TextDialog";
import SaferFilters from "../shared/Filters/SaferFilters";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import FleetCard from "./FleetCard";
import { Button, CircularProgress, IconButton, Switch } from "@mui/material";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { Edit, TickSquare, Trash } from "iconsax-reactjs";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface iprops {
  isDialog?: boolean;
  owner?: "company" | "me";
  onSelect?: (data: any) => void;
}

const FleetList: FC<iprops> = ({ onSelect, isDialog, owner = "company" }) => {
  const isPhone = useIsPhone();
  const token = useAppSelector((state) => state.user.token);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      status: owner === "company" && !isDialog,
    });

  const handleCloseTextDialog = () => {
    setTextDialog((currentValue) => ({ ...currentValue, isOpen: false }));
  };

  const [customDialogProps, setCustomDialogProps] = useState<CustomDialogProps>(
    { ...EmptyCustomDialoProps },
  );
  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [textDialog, setTextDialog] = useState<SaferTextDialogProps>({
    isOpen: false,
    title: "حذف ناوگان",
    description: "آیا از حذف ناوگان اطمینان دارید؟",
    maxWidth: "sm",
    fullWidth: true,
  });

  const navigate = useNavigate();

  const companyFleet = useGetFleetForCompanyQuery(
    isDialog
      ? {
          status: 1,
          page: paginatorProps.currentPage,
          per_page: paginatorProps.itemsPerPage,
          ...filters,
        }
      : {
          page: paginatorProps.currentPage,
          per_page: paginatorProps.itemsPerPage,
          ...filters,
        },
    { skip: owner === "me" || !paginatorProps || !filters || isPhone },
  );

  const infiniteCompanyFleet = useGetInfiniteFleetForCompanyInfiniteQuery(
    isDialog
      ? {
          status: 1,
          page: paginatorProps.currentPage,
          per_page: paginatorProps.itemsPerPage,
          ...filters,
        }
      : {
          page: paginatorProps.currentPage,
          per_page: paginatorProps.itemsPerPage,
          ...filters,
        },
    { skip: owner === "me" || !filters || !isPhone },
  );

  const driverFleet = useGetFleetForDriverQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: owner === "company" || !paginatorProps || !filters || isPhone },
  );

  const infiniteDriverFleet = useGetInfiniteFleetForDriverInfiniteQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: owner === "company" || !filters || !isPhone },
  );

  useEffect(() => {
    if (owner === "company" && paginatorProps && filters && !isPhone)
      companyFleet.refetch();
  }, [paginatorProps, filters, isPhone]);

  useEffect(() => {
    if (owner === "company" && filters && isPhone)
      infiniteCompanyFleet.refetch();
  }, [filters, isPhone]);

  useEffect(() => {
    if (owner === "me" && paginatorProps && filters && !isPhone)
      driverFleet.refetch();
  }, [paginatorProps, filters, isPhone]);

  useEffect(() => {
    if (owner === "me" && filters && isPhone) infiniteDriverFleet.refetch();
  }, [filters, isPhone]);

  const [deleteFleetFn, deleteFleetResult] = useDeleteFleetMutation();
  const [changeFleetStatusFn, changeFleetStatusResult] =
    useChangeFleetStatusMutation();

  useEffect(() => {
    if (changeFleetStatusResult.isSuccess) {
      setCustomDialogProps({ ...EmptyCustomDialoProps });
      SweetAlertToast.fire({
        title: changeFleetStatusResult.data.message,
        icon: "success",
      });
    }
  }, [changeFleetStatusResult]);

  const handleFleetChangeStatus = (id: number, status: 0 | 1) => {
    changeFleetStatusFn({
      id,
      owner,
      body: {
        status,
      },
    });
  };

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  useEffect(() => {
    if (deleteFleetResult.isSuccess) {
      setTextDialog((currentValue) => ({ ...currentValue, isOpen: false }));
      SweetAlertToast.fire({
        title: deleteFleetResult.data.message,
        icon: "success",
      });
    }
  }, [deleteFleetResult]);

  const handleTaggleButton = useCallback(
    (e: any, id: number) => {
      if (e.target.checked) {
        setCustomDialogProps({
          children: (
            <div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
              <p className="font-semibold text-lg">
                آیا از فعال کردن این ناوگان مطمئن هستید ؟
              </p>
              <div className="flex items-center justify-around w-full">
                <Button
                  variant="contained"
                  className="px-10"
                  onClick={() => handleFleetChangeStatus(id, 1)}
                  loading={changeFleetStatusResult.isLoading}
                >
                  بله
                </Button>
                <Button
                  variant="outlined"
                  className="px-10"
                  onClick={() =>
                    setCustomDialogProps({ ...EmptyCustomDialoProps })
                  }
                  sx={{ color: "red", borderColor: "red" }}
                >
                  خیر
                </Button>
              </div>
            </div>
          ),
          hasOnClose: true,
          onClose: () => setCustomDialogProps({ ...EmptyCustomDialoProps }),
          show: true,
        });
      } else {
        setCustomDialogProps({
          children: (
            <div className="flex flex-col items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
              <p className="font-semibold text-lg">
                آیا از غیر فعال کردن این ناوگان مطمئن هستید ؟
              </p>
              <div className="flex items-center justify-around w-full">
                <Button
                  loading={changeFleetStatusResult.isLoading}
                  variant="contained"
                  className="px-10"
                  onClick={() => handleFleetChangeStatus(id, 0)}
                >
                  بله
                </Button>
                <Button
                  variant="outlined"
                  className="px-10"
                  onClick={() =>
                    setCustomDialogProps({ ...EmptyCustomDialoProps })
                  }
                  sx={{ color: "red", borderColor: "red" }}
                >
                  خیر
                </Button>
              </div>
            </div>
          ),
          hasOnClose: true,
          onClose: () => setCustomDialogProps({ ...EmptyCustomDialoProps }),
          show: true,
        });
      }
    },
    [changeFleetStatusResult, handleFleetChangeStatus],
  );

  const handleChoiceFleet = (row: any) => {
    onSelect?.(row);
  };

  const onEditButtonClick = (id: number) => {
    navigate(`${id}`);
  };

  const onRemoveButtonClick = useCallback(
    (id: number) => {
      setTextDialog((currentValue) => ({
        ...currentValue,
        isOpen: true,
        buttons: (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseTextDialog}
            >
              خیر
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteFleetFn({ id, owner })}
            >
              بله
            </Button>
          </>
        ),
      }));
    },
    [deleteFleetFn, deleteFleetResult, owner],
  );

  const onSelfStatmentButtonClick = (data: any) => {
    if (isDialog) handleChoiceFleet(data);
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
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-between">
          {changeFleetStatusResult.isLoading &&
          changeFleetStatusResult.originalArgs.id === row.id ? (
            <CircularProgress color="primary" />
          ) : (
            <Switch
              checked={row.company_truck?.status === "1"}
              onChange={(e) => handleTaggleButton(e, row.id)}
            />
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      width: isDialog ? 64 : 128,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <div className="flex items-center justify-between gap-2">
          {!isDialog && (
            <>
              <IconButton
                title="ویرایش"
                onClick={() => onEditButtonClick(row.id)}
              >
                <Edit size="24" className="text-amber-400" />
              </IconButton>
              <IconButton
                title="حذف"
                onClick={() => onRemoveButtonClick(row.id)}
              >
                <Trash size="24" color="#ef4444" />
              </IconButton>
            </>
          )}
          {isDialog && (
            <IconButton title="انتخاب" onClick={() => handleChoiceFleet(row)}>
              <TickSquare size="24" className="text-primary" />
            </IconButton>
          )}
        </div>
      ),
    },
    {
      field: "smart_number",
      headerName: "هوشمند ماشین",
      width: 128,
      headerAlign: "center",
      align: "right",
      valueGetter: (_, param) => param?.truck?.smart_number,
    },
    {
      field: "plaque",
      headerName: "شماره پلاک",
      width: 192,
      headerAlign: "center",
      align: "center",
      renderCell: ({
        row: {
          truck: {
            first_number,
            second_number,
            third_character,
            fourth_number,
          },
        },
      }) => (
        <Plate
          firstChar={first_number}
          secondChar={third_character}
          thirdChar={second_number}
          fourthChar={fourth_number}
        />
      ),
    },
    {
      field: "usage",
      headerName: "کاربری",
      width: 96,
      align: "left",
      valueGetter: (_value, row) => row.truck.usage,
      valueFormatter: (value) =>
        value === "freighter" ? "باری" : value === "passenger" ? "مسافری" : "",
    },
    {
      field: "loaderType",
      headerName: "نوع بارگیر",
      minWidth: 192,
      flex: 1,
      align: "left",
      valueGetter: (_value, row) => row.truck.loader.name,
    },
    {
      field: "capacity",
      headerName: "ظرفیت",
      width: 128,
      align: "center",
      valueGetter: (_value, row) => row.truck_info.capacity,
      renderCell: ({ value, row }) =>
        value && (
          <p className="w-full flex justify-between px-4">
            <span className="text-gray-400 ml-2">
              {row.truck.usage === "freighter" ? "Kg" : "مسافر"}
            </span>
            <span>{value}</span>
          </p>
        ),
    },
    {
      field: "insuranceValidity",
      headerName: "اعتبار بیمه",
      width: 128,
      align: "center",
      valueGetter: (_value, row) => row.truck_info.insurance_validity,
      valueFormatter: (value) => GetShamsiDate(value),
    },
    {
      field: "inspectionValidity",
      headerName: "اعتبار معاینه فنی",
      width: 128,
      align: "center",
      type: "date",
      valueGetter: (_value, row) => row.truck.validity_technical_examination,
      valueFormatter: (value) => GetShamsiDate(value),
    },
    {
      field: "manufactureYear",
      headerName: "سال ساخت",
      width: 128,
      align: "center",
      type: "number",
      valueGetter: (_value, row) => row.truck.date_made,
      renderCell: ({ value }) => (
        <div className="w-full flex justify-between px-2">
          <span>{value}</span>
          {value.toString().match(/^(19|20)/) ? (
            <span className="text-gray-400">میلادی</span>
          ) : (
            <span className="text-gray-400">شمسی</span>
          )}
        </div>
      ),
    },
    {
      field: "VIN",
      width: 192,
      align: "right",
      type: "string",
      valueGetter: (_value, row) => row.truck.VIN,
    },
    {
      field: "ownerPhoneNumber",
      headerName: "شماره همراه مالک",
      width: 128,
      align: "center",
      type: "string",
      valueGetter: (_value, row) => row.truck_info.owner_phone_number,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {textDialog.isOpen && <SaferTextDialog {...textDialog} />}
      <CustomDialog {...customDialogProps} />
      <SaferFilters
        mode="SEARCH_PARAMS"
        plaque={true}
        filters={[
          {
            label: "شماره هوشمند",
            field: "smart_number",
            type: "string",
          },
        ]}
        onFilter={handleFilter}
        onGetExcel={async () => {
          setExcelLoading(true);
          try {
            const base = owner === "me" ? "driver" : "company";
            await downloadExcelFile(
              `${API_URL}/api/${base}/trucks/export/excel${filters ? "?" + buildQueryParams(filters) : ""}`,
              token,
              "ناوگان",
            );
          } finally {
            setExcelLoading(false);
          }
        }}
        excelLoading={excelLoading}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          driverFleet.isLoading ||
          infiniteCompanyFleet.isLoading ||
          infiniteCompanyFleet.isFetching ||
          driverFleet.isFetching ||
          companyFleet.isLoading ||
					companyFleet.isFetching || 
					infiniteDriverFleet.isLoading || 
					infiniteDriverFleet.isFetching 
        }
        rows={
          owner === "me"
            ? isPhone
              ? (infiniteDriverFleet.data?.pages
                  .map((page) => page.data.data)
                  .reduce((a, b) => [...a, ...b]) ?? [])
              : (driverFleet.data?.data.data ?? [])
            : isPhone
              ? (infiniteCompanyFleet.data?.pages
                  .map((page) => page.data.data)
                  .reduce((a, b) => [...a, ...b]) ?? [])
              : (companyFleet.data?.data.data ?? [])
        }
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        renderCart={(data) => (
          <FleetCard
            data={data}
            isDialog={isDialog ? true : false}
            onEditButtonClick={onEditButtonClick}
            onRemoveButtonClick={onRemoveButtonClick}
            onSelfStatmentButtonClick={onSelfStatmentButtonClick}
          />
        )}
        filterSetInUrl={!isDialog}
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        paginatorProps={{
          ...paginatorProps,
          totalPages:
            driverFleet.data?.data.last_page ||
            companyFleet.data?.data.last_page,
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
        fetchMoreData={
          owner === "company"
            ? infiniteCompanyFleet.fetchNextPage
            : infiniteDriverFleet.fetchNextPage
        }
        hasMore={
          owner === "company"
            ? infiniteCompanyFleet.hasNextPage
            : infiniteDriverFleet.hasNextPage
        }
      />
    </div>
  );
};
export default FleetList;
