import { FC, useEffect, useMemo } from "react";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CloseCircle, InfoCircle, ReceiptSearch, Trash } from "iconsax-reactjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import CheckInspectionDialogProps from "./interfaces/check-inspection-dialog-props.interface";
import InspectionItem from "../../../InspectionList/interfaces/inspection-item.interface";
import ImageComponent from "../../Image/Image";
import { STORAGE_URL } from "../../../../Stores/api-urls";
import { useConfirmInspectionCheckMutation, useDeleteInspectionCheckImageMutation } from "../../../../api/Requests/RequestsList";
import SweetAlertToast from "../../Functions/SweetAlertToast";
import { useAdminSaveLogMutation } from "../../../../pages/dashboard/admin/api/admin-logs.api";

const CheckInspectionDialog: FC<CheckInspectionDialogProps> = ({ isOpen, data, onClose, isAdminPage }) => {
	const [saveLog] = useAdminSaveLogMutation();

	const formatedData = useMemo<InspectionItem[]>(() => {
		const newData = [];

		for (const item of data)
			if (item.details.length) newData.push(...item.details.map((detail) => ({ ...detail, isDetail: 1 })));
			else newData.push({ ...item, isDetail: 0 });

		newData.sort((a, b) => a.code - b.code);

		return newData;
	}, [data]);

	const [deleteInspectioncheckImageFn, deleteInspectionImageResult] = useDeleteInspectionCheckImageMutation();
	const [confirmInspectionCheckFn, confirmInspectionCheckResult] = useConfirmInspectionCheckMutation();

	const handleRemoveInspectionItemImage = (data: InspectionItem) => {
		deleteInspectioncheckImageFn({
			technical_inspection_id: data.technical_inspection_id,
			code: data.code,
			image_code: Object.keys(data.image_data)[0],
			is_detail: data.isDetail,
			uuid: data.uuid,
		});
	};

	const handleConfirmInspectionCheck = (bazdidfani_id: number) => {
		confirmInspectionCheckFn({ bazdidfani_id });
	};

	const handleGetRowClassName = (row) => {
		return row.is_rejected || !row.checked ? "bg-red" : "";
	};

	const columns: GridColDef<InspectionItem>[] = [
		{
			field: "name",
			headerName: "نام",
			flex: 1,
			type: "string",
		},
		{
			field: "self_statement",
			headerName: "نوع",
			width: 96,
			type: "string",
			valueFormatter: (value) => (value === 1 ? "خوداظهاری" : "بازدید فنی"),
		},
		{
			field: "description",
			headerName: "توضیحات",
			flex: 1,
			type: "string",
			valueGetter: (_value, row) => row.inspectorDescription ?? row.driverDescription ?? row.description,
		},
		{
			field: "image",
			headerName: "عکس",
			width: 80,
			type: "custom",
			align: "center",
			renderCell: ({ row }) =>
				row.isImage &&
				Object.values(row.image_data)[0] && (
					<div className="w-16 h-16 overflow-hidden flex items-center justify-center rounded">
						<ImageComponent
							image={`${STORAGE_URL}${Object.values(row.image_data)[0]}`}
							alt={row.name}
						/>
					</div>
				),
		},
		{
			field: "actions",
			headerName: "عملیات",
			width: 64,
			type: "actions",
			renderCell: ({ row }) =>
				!isAdminPage &&
				!row.is_rejected &&
				!row.self_statement &&
				row.bazdidfani_status !== 13 &&
				row.bazdidfani_status !== 14 &&
				row.bazdidfani_status !== 15 &&
				row.isImage &&
				(row.code === deleteInspectionImageResult.originalArgs?.code && deleteInspectionImageResult.isLoading ? (
					<CircularProgress color="error" />
				) : (
					<IconButton onClick={() => handleRemoveInspectionItemImage(row)}>
						<Trash
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				)),
		},
	];

	useEffect(() => {
		if (confirmInspectionCheckResult.isSuccess) onClose();
	}, [confirmInspectionCheckResult.isSuccess]);

	useEffect(() => {
		if (deleteInspectionImageResult.isSuccess)
			SweetAlertToast.fire({
				icon: "success",
				text: deleteInspectionImageResult.data.message,
			});
	}, [deleteInspectionImageResult.isSuccess]);

	useEffect(() => {
		saveLog({ log_message: JSON.stringify(formatedData), type: "debug" });
	}, [data]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="xl"
			fullWidth={true}
		>
			<div className="p-2 lg:p-x-4">
				<DialogTitle className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<ReceiptSearch
							size="32"
							className="text-primary"
						/>
						<h1 className="text-xl font-semibold font-Yekan-Bakh">بررسی بازدید فنی</h1>
					</div>
					<IconButton onClick={onClose}>
						<CloseCircle className="text-red-500" />
					</IconButton>
				</DialogTitle>
				<DialogContent
					dividers={true}
					className="flex flex-col gap-4 mb-2"
				>
					<div className="flex items-center gap-2">
						<InfoCircle className="text-blue-500" />
						<p className="text-gray-500 font-Yekan-Bakh text-sm">
							موارد چک لیست را بررسی کنید و اگر عکسی مناسب نبود آن را حذف کنید. موارد قرمز رد شده‌اند.
						</p>
					</div>
					<DataGrid
						getRowId={(row) => row.code}
						rows={formatedData}
						columns={columns}
						getRowClassName={({ row }) => handleGetRowClassName(row)}
						rowHeight={64}
						rowSelection={false}
						hideFooter={true}
					/>
				</DialogContent>
				<DialogActions className="flex items-center gap-2 justify-end">
					<Button
						size="large"
						variant="outlined"
						color="secondary"
						onClick={onClose}
					>
						بازگشت
					</Button>
					{!isAdminPage &&
						formatedData[0].bazdidfani_status !== 14 &&
						formatedData[0].bazdidfani_status !== 15 &&
						formatedData[0].bazdidfani_status !== 16 && (
							<Button
								size="large"
								variant="contained"
								onClick={() => handleConfirmInspectionCheck(formatedData[0].bazdidfani_id)}
							>
								تایید
							</Button>
						)}
				</DialogActions>
			</div>
		</Dialog>
	);
};

export default CheckInspectionDialog;
