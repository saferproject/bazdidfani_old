import { useStartInspectionMutation } from "../../../api/Checklist/Checklist";
import {
  useGetInspectionsInfiniteQuery,
  useGetInspectionsWithPaginationQuery,
} from "../../../api/TechnicalManager/TechnicalVisit";
import AddRequest from "../../../components/DoTechnicalVisit/AddRequestDialog";
import TechnicalCard from "../../../components/DoTechnicalVisit/TechnicalsCard";
import Plate from "../../../components/shared/DataGrid/Plate";
import SaferGrid from "../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../components/shared/Filters/SaferFilters";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { useAppDispatch } from "../../../Stores/hooks";
import { setInspectionData } from "../../../Stores/slices/inspection-data.slice";
import { setInspectionType } from "../../../Stores/slices/inspection-type.slice";
import useIsInIran from "../../../utilities/custom-hooks/use-is-in-iran";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiTimeDate } from "../../../utilities/DateTime";
import { useGetInspectionStates } from "../../../utilities/Inspection-Status/InspectionStatus";
import { Fab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { TruckFast } from "iconsax-reactjs";
import { Add } from "iconsax-reactjs";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TechnicalInspectionTypes = 1 | 2;

interface iprops {
  type: TechnicalInspectionTypes;
}

const DoTechnicalVisit: FC<iprops> = ({ type }) => {
  const isPhone = useIsPhone();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    isInIran,
    currentLocation,
    isLoading: gettingLocation,
    error: locationError,
  } = useIsInIran();

  const [selectedInspection, setSelectedInspection] = useState(null);
  const [openFilters, setOpenFilters] = useState(false);
  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);
  const [isAddRequestDialogOpen, setAddRequestDialogOpen] = useState(false);

  const { states, getStatus } = useGetInspectionStates();

  const technicalVisitsQuery = useGetInspectionsWithPaginationQuery(
    {
      type,
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteTechnicalVisitQuery = useGetInspectionsInfiniteQuery(
    {
      type,
      per_page: 10,
      ...filters,
    },
    {
      skip: !paginatorProps || !filters || !isPhone,
    },
  );

  const [startInspectionFn, startInspectionResult] =
    useStartInspectionMutation();

  useEffect(() => {}, [states]);

  const columns: GridColDef[] = [
    { field: "count", headerName: "", width: 32, align: "center" },
    {
      field: "company_name",
      headerName: "نام شرکت",
      width: 220,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "created_at",
      headerName: "تاریخ و ساعت",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => GetShamsiTimeDate(row?.created_at),
    },
    {
      field: "smart_number",
      headerName: "هوشمند ماشین",
      width: 96,
      headerAlign: "center",
      align: "center",
      valueGetter: (_value, row) => row.truck_info.smart_number,
    },
    {
      field: "truck_plaque",
      headerName: "شماره پلاک",
      width: 230,
      headerAlign: "center",
      align: "center",
      renderCell: ({
        row: {
          plate_first_number,
          plate_character,
          plate_second_number,
          plate_fourth_number,
        },
      }) => (
        <Plate
          firstChar={plate_first_number}
          secondChar={plate_character}
          thirdChar={plate_second_number}
          fourthChar={plate_fourth_number}
        />
      ),
    },
    {
      field: "loader_type",
      headerName: "نوع بارگیر",
      flex: 1,
      headerAlign: "center",
      align: "left",
      valueGetter: (_, row) => row.truck_info.loader_name,
    },
    {
      field: "status",
      headerName: "وضعیت",
      width: 160,
      headerAlign: "center",
      align: "left",
      valueFormatter: (value) => getStatus(value)?.technical_inspection_title,
    },
    {
      field: "driver_national_code",
      headerName: "کد ملی راننده",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "driver_name",
      headerName: "نام راننده",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "driver_phone",
      headerName: "همراه راننده",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
  ];

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const startInspection = (data: any) => {
    dispatch(setInspectionData(data));
    if (data.self_statement)
      dispatch(setInspectionType("REVIEW_SELF_STATEMENT"));
    else if (data.type === 1)
      dispatch(setInspectionType("TECHNICAL_FREIGHTER"));
    else if (data.type === 2)
      dispatch(setInspectionType("TECHNICAL_PASSENGER"));

    setSelectedInspection(data);

    startInspectionFn({
      bazdidfani_id: data.id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      selfStatement: 0,
      technical_manager_id: data.technical_manager.id,
    });
  };

  const handleAddRequest = () => {
    setAddRequestDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setAddRequestDialogOpen(false);
  };

  useEffect(() => {
    if (startInspectionResult.isSuccess) handleGoToInspection();
  }, [startInspectionResult.isSuccess]);

  const handleGoToInspection = () => {
    navigate(
      `/dashboard/do-technical-visit/checklist/${selectedInspection.truck_info.loader_code}?inspectionId=${startInspectionResult.data.data.id}`,
    );
  };

  useEffect(() => {
    if (!gettingLocation && !isInIran)
      SweetAlertToast.fire({
        icon: "error",
        text:
          locationError ??
          "دریافت موقعیت مکانی شما انجام نشد. صفحه را رفرش کنید.",
      });
  }, [isInIran, currentLocation, gettingLocation, locationError]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <TruckFast size="32" className="text-primary" />
        <h2 className="font-bold text-xl">لیست درخواست های بازدید فنی</h2>
      </div>
      <SaferFilters
        search={true}
        date={true}
        mode="SEARCH_PARAMS"
        plaque={true}
        onFilter={handleFilter}
        onGetExcel={() => {}}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          technicalVisitsQuery.isLoading || technicalVisitsQuery.isFetching
        }
        rows={
          isPhone
            ? (infiniteTechnicalVisitQuery.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (technicalVisitsQuery.data?.data.data ?? [])
        }
        renderCart={(data) => (
          <TechnicalCard
            data={data}
            isDialog={false}
            isReportsPage={false}
            isLoading={startInspectionResult.isLoading}
            onStartInspection={startInspection}
          />
        )}
        filterSetInUrl
        onCloseFilterDialog={() => setOpenFilters(false)}
        onFilterChange={() => {}}
        openFilterDialog={openFilters}
        renderFilter={() => <></>}
        paginatorProps={{
          ...paginatorProps,
          totalPages: technicalVisitsQuery.data?.data.last_page,
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
        fetchMoreData={infiniteTechnicalVisitQuery.fetchNextPage}
        hasMore={infiniteTechnicalVisitQuery.hasNextPage}
      />
      <Fab
        size="medium"
        color="primary"
        onClick={() => handleAddRequest()}
        className="fixed bottom-8 right-8 shadow"
      >
        <Add size="32" />
      </Fab>
      <AddRequest isOpen={isAddRequestDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default DoTechnicalVisit;
