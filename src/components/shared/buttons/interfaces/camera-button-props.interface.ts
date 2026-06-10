import React from "react";

export default interface CameraButtonProps {
	children: React.ReactElement;
	classes: string;
  onClick: () => void;
}
