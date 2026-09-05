import { useState, useRef, useEffect, useCallback, FC } from "react";
import CustomDialog from "../Dialog/CustomeDialog";
import { FaCamera } from "react-icons/fa";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import SweetAlertToast from "../Functions/SweetAlertToast";

interface iprops {
  showWebcamDialog: boolean;
  setShowWebcamDialog: (state: boolean) => void;
  inspectionItemCode?: number;
  inspectionItemName?: string;
}

interface CameraOverlayProps {
  inspectionItemCode?: number;
  inspectionItemName?: string;
}

export const CameraOverlay: FC<CameraOverlayProps> = ({
  inspectionItemCode,
  inspectionItemName,
}) => {
  const isTire = inspectionItemCode === 111 || inspectionItemCode === 112;
  const subject = isTire ? "لاستیک‌ها" : inspectionItemName;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="absolute inset-x-0 top-[24%] bottom-[18%] flex justify-center">
        <div
          className={`relative h-full bg-white/10 ${
            isTire
              ? "max-w-[70%] border border-white/50"
              : "w-4/5 rounded-2xl"
          }`}
          style={{
            aspectRatio: isTire ? "0.56" : undefined,
            // Wider shoulders give the tire guide broad, flatter ends.
            borderRadius: isTire ? "35% / 50%" : undefined,
            boxShadow: "0 0 0 100vmax rgb(0 0 0 / 30%)",
          }}
          aria-hidden="true"
        >
          {!isTire && (
            <>
              <span className="absolute top-0 left-0 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4 border-white" />
              <span className="absolute top-0 right-0 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4 border-white" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-white" />
              <span className="absolute right-0 bottom-0 h-8 w-8 rounded-br-2xl border-r-4 border-b-4 border-white" />
            </>
          )}
        </div>
      </div>
      <p
        dir="rtl"
        className="absolute inset-x-4 top-[6%] text-center text-xs leading-relaxed font-bold text-white drop-shadow-md sm:text-sm"
      >
        {subject
          ? `لطفا ${subject} را در محل مشخص شده بگیرید`
          : "لطفا عکس را در محل مشخص شده بگیرید"}
      </p>
    </div>
  );
};

const WebcamCapture: FC<iprops> = ({
  setShowWebcamDialog,
  showWebcamDialog,
  inspectionItemCode,
  inspectionItemName,
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      SweetAlertToast.fire({
        title: "خطا در دسترسی به دوربین",
        icon: "error",
        text: "لطفاً مطمئن شوید که مرورگر به دوربین دسترسی دارد.",
      });
    }
  }, [facingMode]);

  useEffect(() => {
    if (showWebcamDialog) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showWebcamDialog, startCamera]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        // Capture only the video; the guide is a separate DOM overlay.
        context.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvasRef.current.toDataURL("image/jpeg");
        setImgSrc(imageSrc);
        SweetAlertToast.fire({
          title: "عکس با موفقیت گرفته شد",
          icon: "success",
        });
      }
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => {
      const newMode = prevMode === "user" ? "environment" : "user";
      // فراخوانی startCamera بعد از تغییر state
      setTimeout(() => startCamera(), 0);
      return newMode;
    });
  };

  return (
    <CustomDialog
      show={showWebcamDialog}
      fullWidth={true}
      title="گرفتن تصویر"
      hasOnClose
      onClose={() => {
        setShowWebcamDialog(false);
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
          <video
            ref={videoRef}
            className="block w-full"
            autoPlay
            playsInline
          />
          <CameraOverlay
            inspectionItemCode={inspectionItemCode}
            inspectionItemName={inspectionItemName}
          />
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex items-center justify-between w-full">
          <button
            onClick={capture}
            className="bg-blue-500 justify-between gap-x-1 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
          >
            <FaCamera />
            <p className="text-[2vw] md:text-[1vw]">گرفتن عکس</p>
          </button>
          <button
            onClick={switchCamera}
            className="bg-green-500 justify-between gap-x-1 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
          >
            <MdOutlineFlipCameraAndroid />
            <p className="text-[2vw] md:text-[1vw]">تغییر دوربین</p>
          </button>
        </div>
        {imgSrc && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">عکس گرفته شده:</h2>
            <img
              src={imgSrc}
              alt="عکس گرفته شده"
              className="rounded-lg shadow-lg max-w-md"
            />
          </div>
        )}
      </div>
    </CustomDialog>
  );
};
export default WebcamCapture;
