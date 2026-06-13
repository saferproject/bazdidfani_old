import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import CheckInspectionDialog from "../../../../components/shared/dialogs/CheckInspectionDialog/CheckInspectionDialog";
import CheckInspectionDialogProps from "../../../../components/shared/dialogs/CheckInspectionDialog/interfaces/check-inspection-dialog-props.interface";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import PlateTextField from "../../../../components/shared/Inputs/PlateTextField";
import { GetShamsiDateTime } from "../../../../utilities/DateTime";
import { useGetInspectionStates } from "../../../../utilities/Inspection-Status/InspectionStatus";
import InspectionRequest from "../../requests/interfaces/inspection-request.interface";
import {
  useGetAdminInspectionDetailsQuery,
  useGetAdminInspectionsQuery,
  useGetInfiniteAdminInspectionsInfiniteQuery,
} from "../api/admin-inspections.api";
import AdminInspectionsListProps from "../interfaces/admin-inspections-list-props.interface";
import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ReceiptSearch } from "iconsax-reactjs";
import { FC, JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import AInspectionsCard from "../../../../components/Admin/AInspectionsCard";

const PlateTextFieldCell = ({ row }: any): JSX.Element => {
  const { control, watch } = useForm({
    defaultValues: {
      first_number: String(row?.first_number),
      third_character: row?.third_character,
      second_number: String(row?.second_number),
      fourth_number: String(row?.fourth_number),
    },
  });

  return <PlateTextField control={control} watch={watch} readOnly={true} />;
};

const AdminInspectionsList: FC<AdminInspectionsListProps> = () => {
  const isPhone = useIsPhone();

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const handleOpenCheckInspectionDialog = (data: InspectionRequest) => {
    setCheckingInspection(data);
  };

  const handleCloseCheckInspectionDialog = () => {
    setCheckInspectionDialog({
      isOpen: false,
      data: [],
      onClose: handleCloseCheckInspectionDialog,
    });
    setCheckingInspection(null);
  };

  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [checkingInspection, setCheckingInspection] =
    useState<InspectionRequest | null>(null);
  const [checkInspectionDialog, setCheckInspectionDialog] =
    useState<CheckInspectionDialogProps>({
      isOpen: false,
      data: null,
      onClose: handleCloseCheckInspectionDialog,
    });

  const inspections = useGetAdminInspectionsQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteInspections = useGetInfiniteAdminInspectionsInfiniteQuery(
    { per_page: 10, ...filters },
    { skip: !paginatorProps || !filters || !isPhone },
  );

  const InspectionData = useGetAdminInspectionDetailsQuery(
    { id: checkingInspection?.id ?? 0 },
    { skip: !checkingInspection },
  );

  const { states, getStatus, getStatusColorClass } = useGetInspectionStates();

  useEffect(() => {}, [states]);

  useEffect(() => {
    if (InspectionData.isSuccess)
      setCheckInspectionDialog((cuurentValue) => ({
        ...cuurentValue,
        isOpen: true,
        data: InspectionData.data.data,
      }));
  }, [InspectionData.isSuccess, InspectionData.data]);

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
      width: 64,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => (
        <div className="flex flex-row gap-2">
          {row.status !== 3 && row.status !== 5 && (
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
          )}
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
      field: "fullName",
      headerName: "شماره پلاک",
      align: "center",
      width: 200,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => (
        <div className="h-full w-full flex justify-center items-center">
          <div className="w-full h-[70%]">
            <PlateTextFieldCell row={row.truck} />
          </div>
        </div>
      ),
    },
    {
      field: "company",
      align: "left",
      headerName: "شرکت",
      width: 192,
      editable: false,
      valueGetter: (_value, row) => row.company.name,
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
      field: "company_user",
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
      align: "left",
      width: 150,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => {
        return (
          <p className="font-semibold">
            {row.self_statement === 1 &&
            !row.technical_manager.name &&
            !row.company.name
              ? getStatus(row.status)?.self_statement_title
              : getStatus(row.status)?.technical_inspection_title}
          </p>
        );
      },
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
    {
      field: "sabaf",
      headerName: "کد سباف",
      align: "center",
      width: 220,
      editable: false,
      valueGetter: (_value, row) => row.technical_inspection.sabaf_code,
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
  ];

  return (
    <section className="flex flex-col gap-8">
      {checkInspectionDialog.isOpen && (
        <CheckInspectionDialog {...checkInspectionDialog} isAdminPage={true} />
      )}
      <header className="flex items-center gap-4">
        <ReceiptSearch size="32" className="text-primary" />
        <h2 className="text-xl font-bold">بازدید های فنی و خوداظهاری ها</h2>
      </header>
      <main className="flex flex-col gap-8">
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
            {
              label: "خوداظهاری",
              field: "self_statement",
              type: "boolean",
              activeLabel: "خوداظهاری",
              inActiveLabel: "بازدید فنی",
            },
          ]}
          onFilter={handleFilter}
          onGetExcel={() => {}}
        />
        <SaferGrid<any>
          columns={columns}
          loading={
            inspections.isLoading ||
            inspections.isFetching ||
            infiniteInspections.isLoading ||
            infiniteInspections.isFetching
          }
          rows={
            isPhone
              ? (infiniteInspections.data?.pages
                  .map((page) => page.data.data)
                  .reduce((a, b) => [...a, ...b]) ?? [])
              : (inspections.data?.data.data ?? [])
          }
          renderCart={(data) => (
            <AInspectionsCard
              data={data}
              onViewInspection={handleOpenCheckInspectionDialog}
              isLoading={InspectionData.isFetching || InspectionData.isLoading}
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
            totalPages: inspections.data?.data.last_page,
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
          fetchMoreData={infiniteInspections.fetchNextPage}
          hasMore={infiniteInspections.hasNextPage}
        />
      </main>
    </section>
  );
};

export default AdminInspectionsList;
