import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import { GridColDef, GridRowClassNameParams, GridColumnVisibilityModel } from "@mui/x-data-grid";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import SaferPaginationProps from "../../Pagination/interfaces/safer-pagination-props.interface";

export default interface SaferGridProps<DataType> {
	columns: readonly GridColDef[];
	rows: DataType[];
	loading: boolean;
	renderCart: (data: DataType) => ReactNode;
	sx?: SxProps<Theme>;
	filterSetInUrl: boolean;
	onFilterChange: (queryParamsString: string, valueCount: number, queryParams: any) => void;
	renderFilter: (form: UseFormReturn<any, any, undefined>) => ReactNode;
	openFilterDialog: boolean;
	onCloseFilterDialog: () => void;
	cardClassName?: string;
	getRowClassName?: (params: GridRowClassNameParams<DataType>) => string;
	columnVisibilityModel?: GridColumnVisibilityModel;
	onColumnVisibilityModelChange?: React.Dispatch<React.SetStateAction<GridColumnVisibilityModel>>;
	paginatorProps?: SaferPaginationProps;
	fetchMoreData?: () => void;
	hasMore?: boolean;
}
