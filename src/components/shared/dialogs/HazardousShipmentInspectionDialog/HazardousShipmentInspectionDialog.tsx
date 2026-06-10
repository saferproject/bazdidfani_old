import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton } from "@mui/material";
import { CloseCircle, InfoCircle, ReceiptSearch } from "iconsax-reactjs";
import HazardousShipmentInspectionDialogProps from "./interfaces/hazardous-shipment-inspection.interface";
import { motion } from "motion/react";
import { useState } from "react";

export default function HazardousShipmentInspectionDialog({ isOpen, inspectionItems, onClose }: HazardousShipmentInspectionDialogProps) {
	const [items, setItems] = useState(inspectionItems);

	const handleToggleItem = ({ code }) => {};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="md"
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
						<p className="text-gray-500 font-Yekan-Bakh text-sm">موارد چک لیست را بررسی کنید و تایید و ثبت کنید.</p>
					</div>
					<ul>
						{items.map((item, index) => (
							<motion.li
								key={item.code}
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
							>
								<FormControlLabel
									control={
										<Checkbox
											color="success"
											value={item.checked}
											checked={item.checked}
											onChange={() => {}}
										/>
									}
									label={item.name}
									className="font-Yekan-Bakh font-semibold"
								/>
								{item.driverDescription && (
									<div className="p-2 rounded-lg bg-gray-200 my-2">
										<p className="text-gray-900 indent-2">توضیحات راننده: {item.driverDescription}</p>
									</div>
								)}
								{item.inspectorDescription && (
									<div className="p-2 rounded-lg bg-gray-200 my-2">
										<p className="text-gray-900 indent-2">توضیحات مدیر فنی: {item.inspectorDescription}</p>
									</div>
								)}
							</motion.li>
						))}
					</ul>
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
					<Button
						size="large"
						variant="contained"
						onClick={() => {}}
					>
						تایید
					</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
}
