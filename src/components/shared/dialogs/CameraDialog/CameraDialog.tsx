import { useState, useRef, useEffect, FC } from "react";
import { ArrowRotateLeft, Camera, CloseCircle, DocumentDownload, Repeat, TickCircle } from "iconsax-reactjs";

import SweetAlertToast from "../../Functions/SweetAlertToast";

import SaferCameraDialogProps from "./interfaces/camera-dialog-props.interface";

import CameraButton from "../../buttons/CameraButton";
import { Badge, Dialog, DialogTitle, IconButton } from "@mui/material";

const SaferCameraDialog: FC<SaferCameraDialogProps> = ({
	isOpen,
	title,
	description,
	required,
	fullScreen,
	fullWidth,
	maxWidth,
	data,
	onClose,
	onCapture,
}) => {
	//#region Functions

	const checkPermissions = async () => {
		try {
			const result = await navigator.permissions.query({ name: "camera" as PermissionName });

			if (result.state === "denied") {
				setCameraError("دسترسی دوربین در مرورگر را فعال کنید.");
				return false;
			}

			setPermissionState(result.state);

			result.addEventListener("change", () => setPermissionState(result.state));
			return true;
		} catch (_error) {
			setCameraError("دسترسی دوربین به نرم افزار داده نشده است");
			return false;
		}
	};

	const checkCameraSupport = (): Promise<boolean> => {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setCameraError("این مرورگر قابلیت استفاده از دوربین دستگاه را ندارد.");
				return Promise.resolve(true);
			}

			return Promise.resolve(true);
		} catch (error) {
			setCameraError("بررسی قابلیت استفاده از دوربین با خطا مواجه شد.");
			return Promise.reject(false);
		}
	};

	const getMediaStream = async (): Promise<boolean> => {
		let stream: MediaStream;

		try {
			if (mediaStream) mediaStream.getVideoTracks().forEach((track) => track.stop());

			stream = await navigator.mediaDevices.getUserMedia({ video: true });

			if (stream) {
				setMediaStream(stream);
				const track = stream.getVideoTracks()[0];
				const settings = track.getSettings();
				setEnumeratedDevices((currentValue) => [...currentValue, settings.deviceId]); // Store current device ID
				return true;
			} else throw new Error();
		} catch (error) {
			setCameraError("مرورگر نمیتواند تصویر را از دوربین دریافت کند.");
			return false;
		}
	};

	const showCameraStream = () => {
		try {
			if (videoRef.current && mediaStream) videoRef.current.srcObject = mediaStream;
			else throw new Error("تصویری از دوربین دریافت نمی شود.");
		} catch (error) {
			setCameraError(error);
		}
	};

	const checkCameraAvailability = async (): Promise<void> => {
		try {
			// ? ترتیب مهم است
			if (!(await checkCameraSupport())) return;
			if (!(await checkPermissions())) return;
			if (!(await getMediaStream())) return;
		} catch (error) {
			setCameraError("راه اندازی دوربین با خطا مواجه شد.");
		}
	};

	const stopCamera = (): void => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());

			if (videoRef.current) videoRef.current.srcObject = null;

			setMediaStream(null);
			setCameraError(null);
		}
	};

	const saveImage = (): void => {
		if (image) {
			const link = document.createElement("a");
			link.href = image;
			link.download = `photo-${Date.now()}.jpg`;
			link.click();

			SweetAlertToast.fire({
				icon: "success",
				toast: true,
				text: "عکس با موفقیت ذخیره شد",
				timer: 3000,
				timerProgressBar: true,
			});
		}
	};

	const removeImage = (): void => {
		setImage(null);
	};

	//#endregion

	//#region Hooks

	//#region Refrences

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	//#endregion

	//#region States

	const [image, setImage] = useState<string | null>(null);
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
	const [cameraError, setCameraError] = useState<string | null>(null);
	const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
	const [enumeratedDevices, setEnumeratedDevices] = useState<Array<string>>([]);

	//#endregion

	//#region Effects

	useEffect(() => {
		(async () => await checkCameraAvailability())();
	}, []);

	useEffect(() => {
		if (cameraError) {
			SweetAlertToast.fire({
				icon: "error",
				toast: true,
				text: cameraError,
				timer: 3000,
				timerProgressBar: true,
			});

			setTimeout(() => setCameraError(null), 3000);
		}
	}, [cameraError]);

	useEffect(() => {
		if (permissionState === "denied") {
			SweetAlertToast.fire({
				icon: "error",
				toast: true,
				text: "دسترسی دوربین در مرورگر را فعال کنید.",
				timer: 5000,
				timerProgressBar: true,
			});
		}
	}, [permissionState]);

	useEffect(() => {
		if (permissionState === "granted" && cameraError === null && mediaStream && videoRef.current && canvasRef.current && !image)
			showCameraStream();
	}, [permissionState, cameraError, mediaStream, videoRef.current, canvasRef.current, image]);

	// useEffect(() => {
	// 	(async () => {
	// 		await getMediaStream();
	// 	})();
	// }, [cameraMode]);

	//#endregion

	//#endregion

	//#region Event Handlers

	const handleRetakeImage = (): void => {
		removeImage();
	};

	const handleCapture = (): void => {
		if (videoRef.current && canvasRef.current) {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");

			if (context) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				const imageData = canvas.toDataURL("image/jpeg");
				setImage(imageData);
			} else setCameraError("ثبت عکس با خطا مواجه شد.");
		} else setCameraError("دریافت تصویر از دوربین با خطا مواجه شد.");
	};

	const handleSwitchCameraMode = async (): Promise<void> => {
		try {
			if (!mediaStream) {
				setCameraError("ابتدا دوربین را راه‌اندازی کنید.");
				return;
			}

			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter((device) => device.kind === "videoinput");

			if (videoDevices.length <= 1) {
				setCameraError("فقط یک دوربین موجود است.");
				setTimeout(() => setCameraError(null), 3000);
				return;
			}

			// Find the target device by label (excluding current device)
			let targetDevice = videoDevices.find((device) => !enumeratedDevices.includes(device.deviceId));

			if (!targetDevice) {
				targetDevice = videoDevices[0];
				setEnumeratedDevices([targetDevice.deviceId]);
			} else setEnumeratedDevices((currentValue) => [...currentValue, targetDevice.deviceId]); // Update current device ID

			// Stop current stream
			mediaStream.getVideoTracks().forEach((track) => track.stop());

			// Get new stream using deviceId
			const newStream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: targetDevice.deviceId } },
			});

			setMediaStream(newStream);
		} catch (error) {
			setCameraError("تغییر دوربین با خطا مواجه شد.");
		}
	};

	const handleConfirm = (): void => {
		if (!data) onCapture(image);
		else onCapture(image, data);

		stopCamera();
		setImage(null);
		onClose();
	};

	const handleSaveImage = (): void => {
		saveImage();
	};

	//#endregion

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
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
							<IconButton onClick={onClose}>
								<CloseCircle
									size="24"
									className="text-red-500"
								/>
							</IconButton>
						</div>
						{description && <p className="text-gray-500">{description}</p>}
					</header>
				) : (
					<IconButton onClick={onClose} className="!absolute top-2 left-2 z-10 !bg-white">
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
							/>
							<canvas
								ref={canvasRef}
								className="hidden"
							></canvas>
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
