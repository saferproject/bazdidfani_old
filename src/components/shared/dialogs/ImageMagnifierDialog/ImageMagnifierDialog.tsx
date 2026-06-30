import { FC } from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";

import SaferImageMagnifierDialogProps from "./interfaces/image-magnifier-dialog-props.interface";
import { CloseCircle } from "iconsax-reactjs";

const SaferImageMagnifierDialog: FC<SaferImageMagnifierDialogProps> = ({
	isOpen,
	maxWidth,
	fullWidth,
	fullScreen,
	image,
	orientation,
	title,
	description,
	onClose,
}) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			fullScreen={fullScreen}
		>
			<section className="w-full flex flex-col">
				{title && (
					<header className="w-full grow">
						<div className="w-full flex justify-between items-center mb-2">
							<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">{title}</DialogTitle>
							<IconButton onClick={onClose}>
								<CloseCircle
									size="24"
									className="text-red-500"
								/>
							</IconButton>
						</div>
						{description && <p className="text-gray-500">{description}</p>}
					</header>
				)}
				<main className="relative w-full grow">
					<div
						className={
							(orientation === "vertical" ? "w-auto h-full" : "w-full h-auto") +
							"object-cover overflow-hidden flex justify-center items-center"
						}
					>
						<img
							src={image}
							alt={title || "عکس"}
						/>
					</div>
					{!title && (
						<IconButton
							onClick={onClose}
							className="absolute top-2 left-2 z-10 bg-gray-200/70"
						>
							<CloseCircle
								size="32"
								className="text-red-500"
							/>
						</IconButton>
					)}
				</main>
			</section>
		</Dialog>
	);
};

export default SaferImageMagnifierDialog;
