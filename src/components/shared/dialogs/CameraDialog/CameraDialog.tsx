import { useState, useRef, useEffect, FC } from "react";
import { ArrowRotateLeft, Camera, CloseCircle, DocumentDownload, Repeat, TickCircle } from "iconsax-reactjs";
import { Badge, Dialog, DialogTitle, IconButton } from "@mui/material";
import SweetAlertToast from "../../Functions/SweetAlertToast";
import SaferCameraDialogProps from "./interfaces/camera-dialog-props.interface";
import CameraButton from "../../buttons/CameraButton";
import useCamera from "../../../../utilities/custom-hooks/use-camera";

const SaferCameraDialog: FC<SaferCameraDialogProps> = ({
  isOpen, title, description, required, fullScreen, fullWidth, maxWidth,
  data, onClose, onCapture,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>();
  const [switchError, setSwitchError] = useState<string | null>(null);
  const switchGeneration = useRef(0);
  const { videoRef, stream, error, capture, stopCamera } = useCamera({
    active: isOpen && !image,
    deviceId,
  });

  useEffect(() => {
    if (!isOpen) {
      setImage(null);
      setDeviceId(undefined);
    }
    return () => { switchGeneration.current += 1; };
  }, [isOpen]);

  useEffect(() => {
    const message = error ?? switchError;
    if (message) SweetAlertToast.fire({ icon: "error", toast: true, text: message, timer: 3000, timerProgressBar: true });
  }, [error, switchError]);

  const handleClose = () => {
    switchGeneration.current += 1;
    stopCamera();
    setImage(null);
    onClose();
  };

  const handleCapture = () => {
    const captured = capture();
    if (captured) {
      switchGeneration.current += 1;
      setImage(captured);
    } else setSwitchError("دریافت تصویر از دوربین با خطا مواجه شد.");
  };

  const handleRetakeImage = () => setImage(null);

  const handleSwitchCameraMode = async () => {
    if (!stream) return;
    const request = ++switchGeneration.current;
    setSwitchError(null);
    try {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === "videoinput");
      if (request !== switchGeneration.current) return;
      if (devices.length <= 1) {
        setSwitchError("فقط یک دوربین موجود است.");
        return;
      }
      const currentDevice = stream.getVideoTracks()[0]?.getSettings().deviceId;
      const currentIndex = devices.findIndex(device => device.deviceId === currentDevice);
      setDeviceId(devices[(currentIndex + 1) % devices.length].deviceId);
    } catch {
      if (request === switchGeneration.current) setSwitchError("تغییر دوربین با خطا مواجه شد.");
    }
  };

  const handleConfirm = () => {
    if (!image) return;
    if (!data) onCapture(image);
    else onCapture(image, data);
    handleClose();
  };

  const handleSaveImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `photo-${Date.now()}.jpg`;
    link.click();
    SweetAlertToast.fire({ icon: "success", toast: true, text: "عکس با موفقیت ذخیره شد", timer: 3000, timerProgressBar: true });
  };

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			maxWidth={maxWidth}
			fullWidth={fullWidth}
			fullScreen={fullScreen}
		>
			<section className="relative aspect-9/16 flex flex-col">
				{title ? (
					<header className="w-full grow">
						<div className="w-full flex justify-between items-center mb-2">
							<Badge
								badgeContent={required && title ? "اجباری" : "اختیاری"}
								color={required && title ? "error" : "success"}
							>
								<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">{title}</DialogTitle>
							</Badge>
							<IconButton onClick={handleClose}>
								<CloseCircle
									size="24"
									className="text-red-500"
								/>
							</IconButton>
						</div>
						{description && <p className="text-gray-500">{description}</p>}
					</header>
				) : (
					<IconButton onClick={handleClose} className="!absolute top-2 left-2 z-10 !bg-white">
						<CloseCircle size="24" className="text-red-500" />
					</IconButton>
				)}
				<main className="aspect-9/16 grow">
					{image ? (
						<div className="w-full h-full relative object-cover overflow-hidden flex justify-center items-center rounded-lg">
							<img
								src={image}
								alt="عکس گرفته شده"
								className="rounded-lg"
							/>
							<CameraButton
								onClick={handleRetakeImage}
								classes="w-10 h-10 bottom-4 origin-center translate-x-full"
							>
								<ArrowRotateLeft size="24" />
							</CameraButton>
							<CameraButton
								onClick={handleConfirm}
								classes="w-14 h-14 bottom-2 origin-center -translate-x-1/2"
							>
								<TickCircle size="32" />
							</CameraButton>
							<CameraButton
								onClick={handleSaveImage}
								classes="w-10 h-10 bottom-4 origin-center -translate-x-[200%]"
							>
								<DocumentDownload size="24" />
							</CameraButton>
						</div>
					) : (
						<div className="aspect-9/16 relative overflow-hidden rounded-md">
							<video
								ref={videoRef}
								className="aspect-9/16 rounded-lg"
								autoPlay
                muted
                playsInline
							/>
							<CameraButton
								onClick={handleCapture}
								classes="w-14 h-14 bottom-2 -translate-x-1/2"
							>
								<Camera size="32" />
							</CameraButton>
							<CameraButton
								onClick={handleSwitchCameraMode}
								classes="w-10 h-10 bottom-4 translate-x-12"
							>
								<Repeat size="24" />
							</CameraButton>
						</div>
					)}
				</main>
			</section>
		</Dialog>
	);
};

export default SaferCameraDialog;
