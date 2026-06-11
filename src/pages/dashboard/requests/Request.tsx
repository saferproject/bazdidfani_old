import { useCancelInspectionRequestMutation, useGetInfiniteRequestsListInfiniteQuery, useGetInspectionCheckDataQuery, useGetRequestsListQuery } from "../../../api/Requests/RequestsList";
import RequestCard from "../../../components/Request/RequestCard";
import Plate from "../../../components/shared/DataGrid/Plate";
import SaferGrid from "../../../components/shared/DataGrid/SaferGrid";
import CheckInspectionDialog from "../../../components/shared/dialogs/CheckInspectionDialog/CheckInspectionDialog";
import CheckInspectionDialogProps from "../../../components/shared/dialogs/CheckInspectionDialog/interfaces/check-inspection-dialog-props.interface";
import HazardousShipmentInspectionDialog from "../../../components/shared/dialogs/HazardousShipmentInspectionDialog/HazardousShipmentInspectionDialog";
import HazardousShipmentInspectionDialogProps from "../../../components/shared/dialogs/HazardousShipmentInspectionDialog/interfaces/hazardous-shipment-inspection.interface";
import MapDialogProps from "../../../components/shared/dialogs/MapDialog/interfaces/map-dialog-props.interface";
import MapDialog from "../../../components/shared/dialogs/MapDialog/MapDialog";
import ReferInspectionDialogProps from "../../../components/shared/dialogs/ReferInspectionDialog/interfaces/refer-inspection-dialog-props.interface";
import ReferInspectionDialog from "../../../components/shared/dialogs/ReferInspectionDialog/ReferInspectionDialog";
import SaferTextDialogProps from "../../../components/shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";
import SaferTextDialog from "../../../components/shared/dialogs/TextDialog/TextDialog";
import SaferFilters from "../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import DEFAULT_LOCATION from "../../../shared/constants/default-location";
import buildQueryParams from "../../../utilities/build-query-params";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDateTime } from "../../../utilities/DateTime";
import downloadFile from "../../../utilities/download-file";
import { useGetInspectionStates } from "../../../utilities/Inspection-Status/InspectionStatus";
import SabafCode from "../reports/SabafCode";
import PrintMenu from "./components/PrintMenu";
import InspectionRequestForm from "./InspectionRequestForm";
import InspectionRequestFormProps from "./interfaces/inspection-request-form-props.interface";
import InspectionRequest from "./interfaces/inspection-request.interface";
import { Button, Fab, IconButton, MenuItem } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, ArrowForward, Copy, DocumentText1, Forbidden, Location, ReceiptSearch } from "iconsax-reactjs";
import { useEffect, useState } from "react";





































export default function Request() {
  const isPhone = useIsPhone();

  const handleCloseCheckInspectionDialog = () => {
    setCheckInspectionDialog({
      isOpen: false,
      data: [],
      onClose: handleCloseCheckInspectionDialog,
    });
    setCheckingInspection(null);
  };

  const handleCloseDialog = () =>
    setRedirectInspectionDialog((currentValue) => ({
      ...currentValue,
      isOpen: false,
    }));

  const handleOpenCheckInspectionDialog = (data: InspectionRequest) => {
    setCheckingInspection(data);
  };

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const handleOpenInspectionRedirectDialog = (row) => {
    setRedirectInspectionDialog((currentValue) => ({
      ...currentValue,
      isOpen: true,
      data: row,
    }));
  };

  const handleSabafSuccess = () => {
    if (!requests.isUninitialized) requests.refetch();
  };

  const handleCancelInspectionRequest = () => {
    cancelInspectionRequestFn({ bazdidfani_id: cancelingInspection.id });

    setTextDialog((currentValue) => ({
      ...currentValue,
      isOpen: true,
      buttons: (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseTextDialog}
            disabled={true}
          >
            خیر
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelInspectionRequest}
            loading={true}
          >
            بله
          </Button>
        </>
      ),
    }));
  };

  const handleCloseMapDialog = () =>
    setMapDialog((currentValue) => ({ ...currentValue, isOpen: false }));

  const handleShowInspectionLocation = (inspection: InspectionRequest) => {
    setMapDialog((currentValue) => ({
      ...currentValue,
      isOpen: true,
      location: [
        Number(inspection.technical_inspection.latitude),
        Number(inspection.technical_inspection.longitude),
      ],
      disableMouseEvents: true,
    }));
  };

  const handleCloseNewInspectionRequestDialog = () =>
    setNewInspectionRequestDialog((currentValue) => ({
      ...currentValue,
      isOpen: false,
    }));

  const handleOpenCancelInspectionDialog = (
    inspectionRequest: InspectionRequest,
  ) => {
    setCancelingInspection(inspectionRequest);
  };

  const handleCloseTextDialog = () => {
    setTextDialog((currentValue) => ({ ...currentValue, isOpen: false }));
    setCancelingInspection(null);
  };

  const handleOpenHazardousShipmentInspectionDialog = () =>
    setHazardousShipmentInspectionDialog((currentData) => ({
      ...currentData,
      isOpen: true,
    }));

  const handleCloseHazardousShipmentInspectionDialog = () =>
    setHazardousShipmentInspectionDialog((currentData) => ({
      ...currentData,
      isOpen: false,
    }));

  const handleGetExcel = async () => {
    const excelFile = await fetch(
      `${
        import.meta.env.VITE_IS_TEST_API === "YES"
          ? import.meta.env.VITE_TEST_API_URL
          : import.meta.env.VITE_API_URL
      }/api/company/bazdidfani/index?isExcel=true${filters ? "&" + buildQueryParams(filters) : ""}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      },
    );

    downloadFile(
      await excelFile.blob(),
      "لیست درخواست های بازدید فنی",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };

  const [checkingInspection, setCheckingInspection] =
    useState<InspectionRequest | null>(null);
  const [cancelingInspection, setCancelingInspection] =
    useState<InspectionRequest | null>(null);
  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [checkInspectionDialog, setCheckInspectionDialog] =
    useState<CheckInspectionDialogProps>({
      isOpen: false,
      data: null,
      onClose: handleCloseCheckInspectionDialog,
    });
  const [redirectInspectionDialog, setRedirectInspectionDialog] =
    useState<ReferInspectionDialogProps>({
      isOpen: false,
      data: null,
      onClose: handleCloseDialog,
      onSuccess: handleCloseDialog,
    });
  const [mapDialog, setMapDialog] = useState<MapDialogProps>({
    isOpen: false,
    location: DEFAULT_LOCATION,
    onClose: handleCloseMapDialog,
  });
  const [newInspectionRequestDialog, setNewInspectionRequestDialog] =
    useState<InspectionRequestFormProps>({
      isOpen: false,
      onClose: handleCloseNewInspectionRequestDialog,
    });
  const [textDialog, setTextDialog] = useState<SaferTextDialogProps>({
    isOpen: false,
    title: "ابطال بازدید فنی",
    description: "آیا از ابطال بازدید فنی اطمینان دارید؟",
    maxWidth: "sm",
    fullWidth: true,
  });
  const [
    hazardousShipmentInspectionDialog,
    setHazardousShipmentInspectionDialog,
  ] = useState<HazardousShipmentInspectionDialogProps>({
    isOpen: false,
    inspectionItems: [],
    onClose: handleCloseHazardousShipmentInspectionDialog,
  });

  const requests = useGetRequestsListQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );
  const infiniteRequest = useGetInfiniteRequestsListInfiniteQuery(
    { per_page: 10, ...filters },
    { skip: !filters || !isPhone },
  );
  const InspectionData = useGetInspectionCheckDataQuery(
    { id: checkingInspection?.id ?? 0 },
    { skip: !checkingInspection },
  );
  const { states, getStatus, getStatusColorClass } = useGetInspectionStates();

  const [cancelInspectionRequestFn, cancelInspectionRequestResult] =
    useCancelInspectionRequestMutation();

  useEffect(() => {
    if (checkingInspection) InspectionData.refetch();
  }, [checkingInspection]);

  useEffect(() => {
    if (cancelingInspection)
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
              onClick={handleCancelInspectionRequest}
            >
              بله
            </Button>
          </>
        ),
      }));
  }, [cancelingInspection]);

  useEffect(() => {
    if (InspectionData.isSuccess)
      setCheckInspectionDialog((cuurentValue) => ({
        ...cuurentValue,
        isOpen: true,
        data: InspectionData.data.data,
      }));
  }, [InspectionData.isSuccess, InspectionData.data]);

  useEffect(() => {}, [states]);

  useEffect(() => {
    if (paginatorProps && filters && !isPhone) requests.refetch();
  }, [paginatorProps, filters]);

  useEffect(() => {
    if (filters && isPhone) infiniteRequest.refetch();
  }, [filters, isPhone]);

  useEffect(() => {
    if (cancelInspectionRequestResult.isSuccess) {
      SweetAlertToast.fire({
        icon: "success",
        text: cancelInspectionRequestResult.data.message,
      });

      handleCloseTextDialog();
    } else if (cancelInspectionRequestResult.isError)
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
              onClick={handleCancelInspectionRequest}
            >
              بله
            </Button>
          </>
        ),
      }));
  }, [
    cancelInspectionRequestResult.isSuccess,
    cancelInspectionRequestResult.isError,
  ]);

  const columns: readonly GridColDef<any>[] = [
    {
      field: "count",
      align: "center",
      headerName: "",
      width: 32,
      editable: false,
    },
    {
      field: "detail",
      align: "left",
      headerName: "عملیات",
      width: 200,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex flex-row gap-2">
          {row.status === 3 && (
            <IconButton
              title="ارجاع مجدد بازدید"
              onClick={() => handleOpenInspectionRedirectDialog(row)}
            >
              <ArrowForward size="24" className="text-cyan-500" />
            </IconButton>
          )}
          {row.status !== 3 && row.status !== 5 && (
            <>
              <IconButton
                title="بررسی بازدید"
                onClick={() => handleOpenCheckInspectionDialog(row)}
                loading={
                  (InspectionData.isFetching || InspectionData.isLoading) &&
                  checkingInspection.id === row.id
                }
                disabled={
                  (InspectionData.isFetching || InspectionData.isLoading) &&
                  checkingInspection.id !== row.id
                }
              >
                <ReceiptSearch size="24" className="text-primary" />
              </IconButton>
              <IconButton
                title="کپی بازدید"
                onClick={() => handleAddRequest(row)}
              >
                <Copy size="24" className="text-gray-500" />
              </IconButton>
            </>
          )}
          {row.status !== 3 &&
            row.status !== 11 &&
            row.status !== 12 &&
            row.status !== 14 &&
            row.status !== 15 &&
            row.status !== 16 && (
              <IconButton
                title="ابطال بازدید"
                onClick={() => handleOpenCancelInspectionDialog(row)}
              >
                <Forbidden size="24" className="text-red-500" />
              </IconButton>
            )}
          {row.technical_inspection.latitude &&
            row.technical_inspection.longitude && (
              <IconButton
                title="موقعیت بازدید"
                onClick={() => handleShowInspectionLocation(row)}
              >
                <Location size="24" className="text-blue-500" />
              </IconButton>
            )}
          {/* <IconButton
						title="بررسی محموله خطرناک"
						onClick={() => handleOpenHazardousShipmentInspectionDialog()}
					>
						<DocumentText
							size="24"
							className="text-purple-500"
						/>
					</IconButton> */}
          <PrintMenu
            loaderType={row.truck.loader_code}
            inspectionRequest={row}
          />
        </div>
      ),
    },
    {
      field: "smart_number",
      headerName: "شماره هوشمند",
      align: "center",
      width: 110,
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) => row?.truck?.smart_number,
    },
    {
      field: "plaque",
      headerName: "شماره پلاک",
      align: "center",
      width: 200,
      headerAlign: "center",
      editable: false,
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
      field: "sabaf",
      headerName: "کد رهگیری",
      align: "center",
      width: 220,
      editable: false,
      renderCell: ({ row }) =>
        (row.status === 7 || row.status === 13 || row.status === 14) && (
          <SabafCode data={row} onSuccess={handleSabafSuccess} />
        ),
    },
    {
      field: "created_at",
      headerName: "زمان درخواست",
      width: 140,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (item) => GetShamsiDateTime(item),
    },
    {
      field: "start_technical_inspection_at",
      headerName: "شروع بازدید",
      width: 140,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (_value, row) =>
        GetShamsiDateTime(
          row.technical_inspection.start_technical_inspection_at,
        ),
    },
    {
      field: "user_company",
      headerName: "اپراتور",
      align: "center",
      width: 150,
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) =>
        row?.user_company?.full_name ?? row?.company_credential.name,
    },
    {
      field: "inspector",
      headerName: "مدیر فنی",
      align: "center",
      width: 150,
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) => row?.technical_manager?.name,
    },
    {
      field: "status",
      headerName: "وضعیت",
      align: "center",
      width: 150,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => {
        return (
          <p className="font-semibold">
            {getStatus(row.status)?.technical_inspection_title}
          </p>
        );
      },
    },
    {
      field: "driver_name",
      headerName: "نام راننده",
      align: "center",
      width: 180,
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) => row?.driver?.full_name,
    },
    {
      field: "driver_phone",
      headerName: "همراه راننده",
      align: "center",
      width: 100,
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) => row?.driver?.phone,
    },
    {
      field: "type",
      headerName: "کاربری",
      align: "center",
      width: 100,
      headerAlign: "center",
      editable: false,
      valueFormatter: (value) =>
        value === 2 ? "مسافری" : value === 1 ? "باری" : "نا مشخص",
    },
    {
      field: "code",
      headerName: "رهگیری",
      align: "center",
      width: 114,
      headerAlign: "center",
      editable: false,
    },
  ];

  const handleAddRequest = (copiedData?: InspectionRequest) => {
    setNewInspectionRequestDialog((currentValue) => ({
      ...currentValue,
      isOpen: true,
      data: copiedData,
    }));
  };

  return (
    <div className="max-w-screen lg:max-w-[80vw] xl:max-w-[90vw] flex flex-col gap-4">
      {checkInspectionDialog.isOpen && (
        <CheckInspectionDialog {...checkInspectionDialog} />
      )}
      {redirectInspectionDialog.isOpen && (
        <ReferInspectionDialog {...redirectInspectionDialog} />
      )}
      {mapDialog.isOpen && <MapDialog {...mapDialog} />}
      {newInspectionRequestDialog.isOpen && (
        <InspectionRequestForm {...newInspectionRequestDialog} />
      )}
      {textDialog.isOpen && <SaferTextDialog {...textDialog} />}
      {hazardousShipmentInspectionDialog.isOpen && (
        <HazardousShipmentInspectionDialog
          {...hazardousShipmentInspectionDialog}
        />
      )}
      <Fab
        size="medium"
        color="primary"
        onClick={() => handleAddRequest()}
        className="fixed bottom-8 right-8"
      >
        <Add size="32" />
      </Fab>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <DocumentText1 size="32" className="text-primary" />
          <h2 className="text-xl font-bold">درخواست های بازدید فنی</h2>
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Add size="24" />}
          className="hidden lg:flex"
          onClick={() => handleAddRequest()}
        >
          افزودن درخواست
        </Button>
      </div>
      <SaferFilters
        mode="SEARCH_PARAMS"
        search={true}
        plaque={true}
        date={true}
        filters={[
          {
            label: "شماره هوشمند",
            field: "smart_number",
            type: "string",
          },
          {
            label: "وضعیت",
            field: "status",
            type: "select",
            options: [
              { value: "1", label: "منتظر پذیرش" },
              { value: "2,4,11,12", label: "درحال بازدید" },
              { value: "3", label: "رد پذیرش" },
              { value: "7", label: "تایید مدیر فنی" },
              { value: "14", label: "دارای کد رهگیری" },
              { value: "16", label: "ابطال شده" },
            ],
          },
        ]}
        onFilter={handleFilter}
        onGetExcel={handleGetExcel}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          requests.isLoading ||
          requests.isFetching ||
          infiniteRequest.isLoading ||
          infiniteRequest.isFetching
        }
        rows={
          isPhone
            ? (infiniteRequest.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (requests.data?.data?.data ?? [])
        }
        renderCart={(data) => (
          <RequestCard
            data={data}
            onCopyRequest={handleAddRequest}
            onGetSabafSuccess={handleSabafSuccess}
          />
        )}
        filterSetInUrl
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        getRowClassName={({ row }) => getStatusColorClass(row.status)}
        paginatorProps={{
          ...paginatorProps,
          totalPages: requests.data?.data?.last_page ?? 1,
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
        fetchMoreData={infiniteRequest.fetchNextPage}
        hasMore={infiniteRequest.hasNextPage}
      />
    </div>
  );
}
