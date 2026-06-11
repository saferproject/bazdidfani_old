import { useStartSelfStatementMutation } from "../../../api/Checklist/Checklist";
import {
  useGetInfiniteSelfStatementInfiniteQuery,
  useGetSelfStatementQuery,
  useValidateDriverForSelfStatementMutation,
} from "../../../api/Driver/Driver";
import Plate from "../../../components/shared/DataGrid/Plate";
import SaferGrid from "../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { setSelfStatementData } from "../../../Stores/slices/self-statement-data.slice";
import useIsInIran from "../../../utilities/custom-hooks/use-is-in-iran";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiTimeDate } from "../../../utilities/DateTime";
import { useGetInspectionStates } from "../../../utilities/Inspection-Status/InspectionStatus";
import SelfStatementData from "../do-technical-visit/interfaces/self-statement-data.interface";
import SelfStatementFormProps from "./interfaces/self-statement-form-props.interface";
import SelfStatementCard from "./SelfStatementCard";
import SelfStatementTruckData from "./SelfStatementTruckData";
import { Button, CircularProgress, Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Add, DocumentText } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SelfStatement: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isPhone = useIsPhone();

  const {
    isInIran,
    currentLocation,
    isLoading: gettingLocation,
    error: locationError,
  } = useIsInIran();

  const [selectedSelfStatement, setSelectedSelfStatement] = useState<any>(null);

  const nationalCode = useAppSelector(
    (state) => state.user.personal.national_code,
  );

  const handleCloseNewSelfStatementRequestDialog = () =>
    setNewSelfStatementRequestDialog((currentValue) => ({
      ...currentValue,
      isOpen: false,
    }));

  const handleAddRequest = () => {
    validateDriverFn({ national_code: String(nationalCode) });
  };

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const handleStartSelfStatement = (data: SelfStatementData) => {
    dispatch(setSelfStatementData(data));
    setSelectedSelfStatement(data);
    selfStatementFn({
      bazdidfani_id: data.id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      selfStatement: 1,
    });
  };

  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [newSelfStatementRequestDialog, setNewSelfStatementRequestDialog] =
    useState<SelfStatementFormProps>({
      isOpen: false,
      onClose: handleCloseNewSelfStatementRequestDialog,
    });

  const { states, getStatus, getStatusColorClass } = useGetInspectionStates();

  const selfStatements = useGetSelfStatementQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );
  const infiniteSelfStatements = useGetInfiniteSelfStatementInfiniteQuery(
    {
      per_page: 10,
      ...filters,
    },
    { skip: !filters || !isPhone },
  );

  const [
    validateDriverFn,
    {
      isLoading: isDriverValidationLoading,
      isSuccess: isDriverValidationSuccessful,
      data: driverValidationData,
    },
  ] = useValidateDriverForSelfStatementMutation();

  const [selfStatementFn, selfStatementResult] =
    useStartSelfStatementMutation();

  useEffect(() => {
    if (selfStatementResult.isSuccess)
      navigate(
        `/dashboard/self-statement/checklist/${selectedSelfStatement.truck.loader_code}?inspectionId=${selfStatementResult.data.data.id}`,
      );
  }, [selfStatementResult.isSuccess]);

  useEffect(() => {
    if (isDriverValidationSuccessful)
      setNewSelfStatementRequestDialog((currentValue) => ({
        ...currentValue,
        isOpen: true,
      }));
  }, [isDriverValidationSuccessful, driverValidationData]);

  useEffect(() => {}, [states]);

  const columns: GridColDef<any>[] = [
    {
      field: "count",
      align: "center",
      headerName: "",
      width: 32,
      editable: false,
    },
    {
      field: "smart_number",
      headerName: "هوشمند ماشین",
      align: "center",
      flex: 0.5,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => row?.truck?.smart_number,
    },
    {
      field: "status",
      headerName: "وضعیت",
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      editable: false,
      renderCell: ({ row }) => {
        return (
          <p className="font-semibold">
            {getStatus(row.status)?.self_statement_title}
          </p>
        );
      },
    },
    {
      field: "code",
      headerName: "کد رهگیری",
      align: "center",
      flex: 0.3,
      headerAlign: "center",
      editable: false,
    },
    {
      field: "usage",
      headerName: "کاربری",
      align: "center",
      flex: 0.3,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => (row?.usage === "passenger" ? "مسافری" : "باری"),
    },
    {
      field: "created_at",
      headerName: "زمان ثبت",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => GetShamsiTimeDate(row.created_at),
    },
    {
      field: "CarPlaque",
      headerName: "شماره پلاک",
      align: "left",
      width: 200,
      headerAlign: "left",
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
      field: "description",
      headerName: "توضیحات",
      align: "left",
      flex: 1.5,
      headerAlign: "left",
      editable: false,
      type: "string",
    },
  ];

  useEffect(() => {
    if (!gettingLocation && !isInIran) {
      SweetAlertToast.fire({
        icon: "error",
        text:
          locationError ??
          "دریافت موقعیت مکانی شما انجام نشد. صفحه را رفرش کنید.",
      });
    }
  }, [isInIran, currentLocation, gettingLocation, locationError]);

  return (
    <div className="m-0 sm:m-0 md:mx-10 xl:m-0">
      {newSelfStatementRequestDialog.isOpen && (
        <SelfStatementTruckData {...newSelfStatementRequestDialog} />
      )}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DocumentText size="32" className="text-primary" />
            <h2 className="font-bold text-xl">خوداظهاری فنی</h2>
          </div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Add size="24" />}
            loading={isDriverValidationLoading}
            onClick={() => handleAddRequest()}
            className="hidden lg:flex"
          >
            افزودن خوداظهاری
          </Button>
          <Fab
            size="medium"
            color="primary"
            className="fixed bottom-8 right-8"
            onClick={() => handleAddRequest()}
          >
            {isDriverValidationLoading ? (
              <CircularProgress size={24} color="info" />
            ) : (
              <FaPlus />
            )}
          </Fab>
        </div>
        <div className="flex flex-col gap-8">
          <SaferFilters
            mode="SEARCH_PARAMS"
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
                  { value: "1", label: "منتظر انجام" },
                  { value: "10", label: "درحال انجام" },
                  { value: "8", label: "ثبت سازمانی" },
                  { value: "9", label: "منقضی شده" },
                  { value: "13,14", label: "استفاده شده" },
                ],
              },
            ]}
            onFilter={handleFilter}
            onGetExcel={() => {}}
          />
          <SaferGrid<any>
            columns={columns}
            loading={
              selfStatements.isLoading ||
              selfStatements.isFetching ||
              infiniteSelfStatements.isLoading ||
              infiniteSelfStatements.isFetching
            }
            rows={
              isPhone
                ? (infiniteSelfStatements.data?.pages
                    .map((page) => page.data.data)
                    .reduce((a, b) => [...a, ...b]) ?? [])
                : (selfStatements.data?.data.data ?? [])
            }
            renderCart={(data) => (
              <SelfStatementCard
                data={data}
                onStartSelfStatement={handleStartSelfStatement}
                isLoading={selfStatementResult.isLoading}
              />
            )}
            filterSetInUrl={false}
            onCloseFilterDialog={() => {}}
            onFilterChange={() => {}}
            openFilterDialog={false}
            renderFilter={() => <></>}
            getRowClassName={({ row }) => getStatusColorClass(row.status)}
            paginatorProps={{
              ...paginatorProps,
              totalPages: selfStatements.data?.data.last_page,
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
            fetchMoreData={infiniteSelfStatements.fetchNextPage}
            hasMore={infiniteSelfStatements.hasNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SelfStatement;
