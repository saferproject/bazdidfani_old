import { FC, useState } from "react";
import ImageProps from "./interfaces/image-props.interface";
import SaferImageMagnifierDialogProps from "../dialogs/ImageMagnifierDialog/interfaces/image-magnifier-dialog-props.interface";
import SaferImageMagnifierDialog from "../dialogs/ImageMagnifierDialog/ImageMagnifierDialog";

const Image: FC<ImageProps> = ({
	image,
	alt,
	width = "",
	height = "",
	borderRadius = "",
	stopPropagation = false,
	orientation = "vertical",
	placeholder,
}) => {
	const handleCloseImageMagnifierDialog = () => setSaferImageMagnifierDialogData((prevData) => ({ ...prevData, isOpen: false }));

	const [saferImageMagnifierDialogData, setSaferImageMagnifierDialogData] = useState<SaferImageMagnifierDialogProps>({
		isOpen: false,
		onClose: handleCloseImageMagnifierDialog,
		image: "",
		orientation,
	});

	const handleMagnifyImage = () => {
		setSaferImageMagnifierDialogData({
			isOpen: true,
			image,
			orientation,
			fullWidth: true,
			onClose: handleCloseImageMagnifierDialog,
		});
	};

	return (
		<>
			{saferImageMagnifierDialogData.isOpen && <SaferImageMagnifierDialog {...saferImageMagnifierDialogData} />}
			<div
				title="برای مشاهده کلیک کنید"
				className={`${width} ${height} ${borderRadius} object-cover overflow-hidden flex justify-center items-center cursor-pointer`}
				onClick={(event) => {
					if (stopPropagation) {
						event.stopPropagation();
						event.preventDefault();
					}
					handleMagnifyImage();
				}}
			>
				{image ? (
					<img
						src={image}
						alt={alt}
					/>
				) : (
					placeholder
				)}
			</div>
		</>
	);
};

export default Image;
