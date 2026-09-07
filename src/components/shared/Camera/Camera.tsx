import { useState, useEffect, FC } from "react";
import CustomDialog from "../Dialog/CustomeDialog";
import { FaCamera } from "react-icons/fa";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";
import SweetAlertToast from "../Functions/SweetAlertToast";
import useCamera from "../../../utilities/custom-hooks/use-camera";

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
  const { videoRef, capture: capturePhoto, error, isReady, stopCamera } = useCamera({
    active: showWebcamDialog,
    facingMode,
  });

  useEffect(() => {
    if (error) SweetAlertToast.fire({ title: "خطا در دسترسی به دوربین", icon: "error", text: error });
  }, [error]);

  const capture = () => {
    const imageSrc = capturePhoto();
    if (imageSrc) {
      setImgSrc(imageSrc);
      SweetAlertToast.fire({ title: "عکس با موفقیت گرفته شد", icon: "success" });
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => prevMode === "user" ? "environment" : "user");
  };

  return (
    <CustomDialog
      show={showWebcamDialog}
      fullWidth={true}
      title="گرفتن تصویر"
      hasOnClose
      onClose={() => {
        stopCamera();
        setImgSrc(null);
        setShowWebcamDialog(false);
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
          <video
            ref={videoRef}
            className="block w-full"
            autoPlay
            muted
            playsInline
          />
          <CameraOverlay
            inspectionItemCode={inspectionItemCode}
            inspectionItemName={inspectionItemName}
          />
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            disabled={!isReady}
            onClick={capture}
            className="bg-blue-500 justify-between gap-x-1 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center"
          >
            <FaCamera />
            <p className="text-[2vw] md:text-[1vw]">گرفتن عکس</p>
          </button>
          <button
            type="button"
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
