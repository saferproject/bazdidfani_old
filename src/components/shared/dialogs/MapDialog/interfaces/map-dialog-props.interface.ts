import { LatLngExpression } from "leaflet";

export default interface MapDialogProps {
	location: LatLngExpression;
	isOpen: boolean;
	onClose: () => void;
	handleLocationChange?: (location: LatLngExpression) => void;
	disableMouseEvents?: boolean;
}