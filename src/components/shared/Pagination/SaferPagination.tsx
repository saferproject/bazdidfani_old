import { ChangeEvent, FC } from "react";
import { useTheme } from "@mui/material/styles";
import { MenuItem, Pagination, Select } from "@mui/material";
import SaferPaginationProps from "./interfaces/safer-pagination-props.interface";

const SaferPagination: FC<SaferPaginationProps> = ({
	totalPages,
	currentPage = 1,
	itemsPerPage = 10,
	onPageChange,
	onItemsPerPageChange,
}) => {
	const theme = useTheme();

	return (
		<div className="flex justify-end items-center gap-8">
			<Select
				slotProps={{
					input: {
						sx: {
							borderColor: "#e5e7eb",
						},
					},
				}}
				size="small"
				value={itemsPerPage}
				onChange={(event) => onItemsPerPageChange(event.target.value)}
			>
				<MenuItem value={10}>10</MenuItem>
				<MenuItem value={20}>20</MenuItem>
				<MenuItem value={50}>50</MenuItem>
			</Select>
			<Pagination
				count={totalPages}
				page={currentPage}
				variant="text"
				size="large"
				shape="rounded"
				color="primary"
				onChange={(_event: ChangeEvent<unknown>, page: number) => onPageChange(page)}
				sx={{
					display: "flex",
					justifyContent: "end",
					"& .MuiPaginationItem-ellipsis": {
						border: "none !important",
						"&:hover": {
							background: "none important",
						},
					},
					"& .MuiPaginationItem-page": {
						border: "1px solid #e5e7eb ",
						"&:hover": {
							background: theme.palette.primary.main,
						},
					},
					"& .MuiPaginationItem-previousNext": {
						border: "1px solid #e5e7eb ",
						"&:hover": {
							background: theme.palette.primary.main,
						},
					},
					"& .MuiPagination-root": {
						display: "flex",
						justifyContent: "end",
					},
				}}
			/>
		</div>
	);
};

export default SaferPagination;
