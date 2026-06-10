import { FC } from "react";
import MapComponent from "../../Map/Map";
import MapDialogProps from "./interfaces/map-dialog-props.interface";
import { Dialog } from "@mui/material";

const MapDialog: FC<MapDialogProps> = ({ isOpen, onClose, location, handleLocationChange, disableMouseEvents }) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
		>
			<div className="w-full h-[75vh] overflow-hidden">
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
