import { CircularProgress, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaferPagination from "../Pagination/SaferPagination";
import SaferGridProps from "./interfaces/safer-grid-props.interface";
import { Warning2 } from "iconsax-reactjs";
import useIsPhone from "../../../utilities/custom-hooks/use-is-phone";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

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

	useEffect(() => {
		if (!isPhone || loading || !hasMore || !fetchMoreData) return;

		const handleScroll = () => {
			const scrollHeight = document.documentElement.scrollHeight;
			const currentPosition = window.innerHeight + window.scrollY;

			if (currentPosition < scrollHeight - 300 || isFetchingMoreRef.current) return;

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

	return isPhone ? (
		<div className="w-full flex flex-col items-center gap-4">
			{loading ? (
				<Skeleton
					className="w-full max-w-[350px] h-[400px] rounded-2xl"
					variant="rounded"
				/>
			) : (
				<div className="w-[calc(100vw-48px)]">
					<ul className="flex flex-col gap-4">
						{rows?.map((row, index) => (
							<motion.li
								key={index}
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{ duration: 0.2, delay: index * 0.1, ease: "easeOut" }}
								className="shadow-lg"
							>
								{renderCart(row)}
							</motion.li>
						))}
					</ul>
					{hasMore ? (
						<CircularProgress
							className="mt-4"
							color="primary"
							size="32"
						/>
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
