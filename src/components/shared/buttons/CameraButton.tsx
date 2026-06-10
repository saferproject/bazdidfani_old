import { FC } from "react";
import { IconButton } from "@mui/material";

import CameraButtonProps from "./interfaces/camera-button-props.interface";

const CameraButton: FC<CameraButtonProps> = ({ children, classes = "", onClick }) => {
	return (
		<IconButton
			onClick={onClick}
			className={"absolute left-1/2 bg-gray-100/70 flex justify-center items-center text-gray-500 rounded-full " + classes}
		>
			{children}
		</IconButton>
	);
};

export default CameraButton;