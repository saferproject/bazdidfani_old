import { FC } from "react";
import MapComponent from "../../Map/Map";
import MapDialogProps from "./interfaces/map-dialog-props.interface";
import { Dialog, IconButton } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";

const MapDialog: FC<MapDialogProps> = ({ isOpen, onClose, location, handleLocationChange, disableMouseEvents }) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
		>
			<div className="relative w-full h-[75vh] overflow-hidden">
				<IconButton
					onClick={onClose}
					className="!absolute top-2 left-2 z-[1000] !bg-white"
				>
					<CloseCircle size="24" className="text-red-500" />
				</IconButton>
				<MapComponent
					center={location}
					setCenter={handleLocationChange}
					disableClick={disableMouseEvents}
				/>
			</div>
		</Dialog>
	);
};

export default MapDialog;
