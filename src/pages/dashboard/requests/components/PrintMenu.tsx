import { IconButton, Menu, MenuItem } from "@mui/material";
import { Printer } from "iconsax-reactjs";
import PrintMenuProps from "../interfaces/print-menu-props.interface";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SweetAlertToast from "../../../../components/shared/Functions/SweetAlertToast";
import { useAppDispatch } from "../../../../Stores/hooks";
import { setTechnicalInspectionPrintData } from "../../../../Stores/slices/technical-inspection-print-data.slice";

export default function PrintMenu({ loaderType, inspectionRequest }: PrintMenuProps) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const anchor = useRef(null);
	const [open, setOpen] = useState(false);

	const handleOpenMenu = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handlePrintTechnicalInspection = () => {
		dispatch(setTechnicalInspectionPrintData(inspectionRequest));
		navigate(`/print-technical-inspection-form/${loaderType}`);
	};

	const handlePrintHazardousInspection = () => {
		SweetAlertToast.fire({
			icon: "info",
			text: "این قابلیت هنوز فعال نشده است",
		});
	};

	return (
		<div>
			<IconButton
				ref={anchor}
				title="چاپ"
				onClick={handleOpenMenu}
			>
				<Printer
					size="24"
					className="text-purple-500"
				/>
			</IconButton>
			<Menu
				open={open}
				onClose={handleClose}
				anchorEl={anchor.current}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<MenuItem onClick={handlePrintTechnicalInspection}>چاپ چک لیست فنی</MenuItem>
				<MenuItem onClick={handlePrintHazardousInspection}>چاپ چک لیست محموله خطرناک</MenuItem>
			</Menu>
		</div>
	);
}
