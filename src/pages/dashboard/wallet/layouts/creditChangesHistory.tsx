import SaferGrid from "../../../../components/shared/DataGrid/SaferGrid";
import SaferFilters from "../../../../components/shared/Filters/SaferFilters";
import WalletCard from "../../../../components/Wallet/WalletCard";
import buildQueryParams from "../../../../utilities/build-query-params";
import useIsPhone from "../../../../utilities/custom-hooks/use-is-phone";
import { GetShamsiDateTime } from "../../../../utilities/DateTime";
import downloadFile from "../../../../utilities/download-file";
import {
  useGetCreditChangesHistoryQuery,
  useGetInfiniteCreditChangesHistoryInfiniteQuery,
} from "../api/wallet.api";
import CreditChangeHistoryProps from "../interfaces/credit-change-history-props.interface";
import { Divider } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { FC, useState } from "react";

const formatValue = (value: string): string => {
  if (value)
    return Number(value)
      .toFixed()
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CreditChangesHistory: FC<CreditChangeHistoryProps> = () => {
  const isPhone = useIsPhone();

  const [paginatorProps, setPaginatorProps] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState(null);

  const creditChangeHistory = useGetCreditChangesHistoryQuery(
    {
      page: paginatorProps.currentPage,
      per_page: paginatorProps.itemsPerPage,
      ...filters,
    },
    { skip: !paginatorProps || !filters || isPhone },
  );

  const infiniteCreditChangeHistory =
    useGetInfiniteCreditChangesHistoryInfiniteQuery(
      {
        page: paginatorProps.currentPage,
        per_page: paginatorProps.itemsPerPage,
        ...filters,
      },
      { skip: !paginatorProps || !filters || !isPhone },
    );

  const columns: readonly GridColDef<any>[] = [
    {
      field: "count",
      align: "center",
      headerName: "",
      width: 32,
      editable: false,
    },
    {
      field: "order_code",
      headerName: "کد رهگیری",
      align: "center",
      width: 150,
      headerAlign: "center",
      editable: false,
    },
    {
      field: "transaction_type",
      headerName: "نوع تراکنش",
      align: "center",
      width: 150,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) =>
        row.transaction_type === "1" ? "شارژ" : "برداشت",
    },
    {
      field: "price",
      headerName: "مبلغ (تومان)",
      align: "center",
      width: 200,
      headerAlign: "center",
      editable: false,
      renderCell: ({ row }) => formatValue(row.price),
    },
    {
      field: "status_title",
      headerName: "عنوان",
      align: "center",
      width: 200,
      headerAlign: "center",
      editable: false,
    },
    {
      field: "created_at",
      headerName: "تاریخ",
      width: 150,
      align: "center",
      headerAlign: "center",
      editable: false,
      valueGetter: (_, row) => GetShamsiDateTime(row.created_at),
    },
    {
      field: "description",
      headerName: "توضیحات",
      align: "left",
      width: 180,
      headerAlign: "center",
      flex: 1,
    },
  ];

  const handleFilter = (filters: Record<string, string | number | boolean>) => {
    setPaginatorProps((currentValue) => ({ ...currentValue, currentPage: 1 }));
    setFilters(filters);
  };

  const handleGetExcel = async () => {
    const excelFile = await fetch(
      `${
        import.meta.env.VITE_IS_TEST_API === "YES"
          ? import.meta.env.VITE_TEST_API_URL
          : import.meta.env.VITE_API_URL
      }/api/wallet/transactions?isExcel=true${filters ? "&" + buildQueryParams(filters) : ""}`,
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
      "لیست تراکنش ها",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };

  return (
    <>
      <Divider className="my-4">
        <h3 className="font-Yekan-Bakh font-semibold px-8 md:text-2xl">
          تاریخچه تراکنش ها
        </h3>
      </Divider>
      <SaferFilters
        mode="SEARCH_PARAMS"
        date={true}
        filters={[
          {
            field: "transaction_type",
            label: "نوع تراکنش",
            type: "select",
            options: [
              { label: "شارژ", value: 1 },
              { label: "برداشت", value: 2 },
            ],
          },
          {
            field: "order_code",
            label: "کد رهگیری",
            type: "string",
          },
        ]}
        onFilter={handleFilter}
        onGetExcel={handleGetExcel}
      />
      <SaferGrid<any>
        columns={columns}
        loading={
          creditChangeHistory.isLoading ||
          creditChangeHistory.isFetching ||
          infiniteCreditChangeHistory.isLoading ||
          infiniteCreditChangeHistory.isFetching
        }
        rows={
          isPhone
            ? (infiniteCreditChangeHistory.data?.pages
                .map((page) => page.data.data)
                .reduce((a, b) => [...a, ...b]) ?? [])
            : (creditChangeHistory.data?.data.data ?? [])
        }
        renderCart={(data) => <WalletCard data={data} />}
        filterSetInUrl
        onCloseFilterDialog={() => {}}
        onFilterChange={() => {}}
        openFilterDialog={false}
        renderFilter={() => <></>}
        cardClassName="overflow-auto max-h-[450px]!"
        paginatorProps={{
          ...paginatorProps,
          totalPages: creditChangeHistory.data?.data.last_page,
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
        fetchMoreData={infiniteCreditChangeHistory.fetchNextPage}
        hasMore={infiniteCreditChangeHistory.hasNextPage}
      />
    </>
  );
};

export default CreditChangesHistory;
