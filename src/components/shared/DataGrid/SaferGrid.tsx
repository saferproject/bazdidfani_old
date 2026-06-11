import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import SaferPagination from "../Pagination/SaferPagination";
import SaferGridProps from "./interfaces/safer-grid-props.interface";
import { CircularProgress, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Warning2 } from "iconsax-reactjs";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";














export default function SaferGrid<DataType>({
  columns,
  loading,
  rows,
  renderCart,
  sx,
  getRowClassName,
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  paginatorProps,
  fetchMoreData,
  hasMore,
}: SaferGridProps<DataType>) {
  const isPhone = useIsPhone();
  const isFetchingMoreRef = useRef(false);
  const prevLengthRef = useRef(0);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isPhone || loading || !hasMore || !fetchMoreData) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentPosition = window.innerHeight + window.scrollY;

      if (currentPosition < scrollHeight - 300 || isFetchingMoreRef.current)
        return;

      isFetchingMoreRef.current = true;
      fetchMoreData();
      window.setTimeout(() => {
        isFetchingMoreRef.current = false;
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchMoreData, hasMore, isPhone, loading, rows.length]);

  useEffect(() => {
    if (!!rows) setData(rows);
  }, [rows]);

  // Remember how many items were already rendered so newly fetched items can
  // be staggered relative to their batch instead of their absolute index.
  useEffect(() => {
    prevLengthRef.current = data?.length ?? 0;
  }, [data]);

  return isPhone ? (
    <div className="w-full flex flex-col items-center gap-4">
      {loading && !data?.length ? (
        <Skeleton
          className="w-full max-w-[350px] h-[400px] rounded-2xl"
          variant="rounded"
        />
      ) : (
        <div className="w-[calc(100vw-48px)]">
          <ul className="flex flex-col gap-4">
            {data?.map((row, index) => (
              <motion.li
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.2,
                  delay:
                    Math.min(Math.max(index - prevLengthRef.current, 0), 6) *
                    0.07,
                  ease: "easeOut",
                }}
                className="shadow-lg"
              >
                {renderCart(row)}
              </motion.li>
            ))}
          </ul>
          {hasMore ? (
            <div className="flex flex-row items-center justify-center">
              <Skeleton
                className="w-full max-w-80 h-52 mt-2 rounded-2xl"
                variant="rounded"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Warning2 className="text-yellow-500" />
              <p className="text-gray-500">اطلاعات بیشتری برای دریافت نیست</p>
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <>
      <div className="overflow-auto">
        <DataGrid<DataType>
          className="min-w-fit"
          columns={columns}
          rows={rows || []}
          hideFooter
          loading={loading}
          rowHeight={50}
          getRowClassName={getRowClassName}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={onColumnVisibilityModelChange}
          hideFooterPagination={true}
          rowSelection={false}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          sx={{
            ...(sx as any),
          }}
        />
      </div>
      <div className="mt-6">
        <SaferPagination {...paginatorProps} />
      </div>
    </>
  );
}
