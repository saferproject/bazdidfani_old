import { InspectionModel } from "../../../database/models/inspection.model";
import { useAppDispatch, useAppSelector } from "../../../Stores/hooks";
import { deactivateExpressInspection } from "../../../Stores/slices/express-inspection.slice";
import SweetAlertToast from "../../shared/Functions/SweetAlertToast";
import ImageComponent from "../../shared/Image/Image";
import InspectionItem from "../interfaces/inspection-item.interface";
import InspectionItemDialogProps from "./interfaces/inspection-item-dailog-props.interface";
import InspectionItemDialogForm from "./interfaces/inspection-item-dialog-form.interface";
import { Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton } from "@mui/material";
import TextField from "../../shared/Inputs/SaferTextField";
import { Camera, CloseCircle, Refresh, Trash } from "iconsax-reactjs";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Webcam from "react-webcam";





































const InspectionItemDialog: FC<InspectionItemDialogProps> = ({
  isOpen,
  currentInspectionItem,
  inspectionId,
  inspectionType,
  checkedCount,
  totalCount,
  handleCloseDialog,
  onItemUpdated,
  onOpenItem,
  onItemsFinished,
}) => {
  const dispatch = useAppDispatch();
  const isExpressInspectionActive = useAppSelector(
    (state) => state.expressInspection,
  );
  const webcamRef = useRef<Webcam>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<InspectionItemDialogForm>({
    defaultValues: {
      description:
        inspectionType === "SELF_STATEMENT"
          ? (currentInspectionItem?.driverDescription ?? "")
          : (currentInspectionItem?.inspectorDescription ?? ""),
    },
  });

  const openNextUnreviewedItem = async () => {
    const nextItem = await InspectionModel.getFirstUnreviewedItem(inspectionId);

    if (nextItem) onOpenItem(nextItem as InspectionItem);
    else {
      SweetAlertToast.fire({
        icon: "success",
        text: "تمام موارد با موفقیت بررسی شد.",
      });

      dispatch(deactivateExpressInspection());
      handleCloseDialog();
      onItemsFinished();
    }
  };

  const syncCurrentItem = async (code = currentInspectionItem?.code) => {
    await onItemUpdated(code);
  };

  const onSubmitForm = async ({ description }: InspectionItemDialogForm) => {
    if (!currentInspectionItem) return;

    if (
      currentInspectionItem.isImage &&
      currentInspectionItem.images.length < currentInspectionItem.minImageCount
    ) {
      SweetAlertToast.fire({
        icon: "warning",
        title: "لطفا حداقل تعداد عکس های لازم را ثبت کنید.",
      });

      return;
    }

    const item = await InspectionModel.getItem(
      currentInspectionItem.code,
      inspectionId,
    );

    if (!item) return;

    item.reviewed = true;
    item.checked = true;

    if (description)
      inspectionType === "SELF_STATEMENT"
        ? (item.driverDescription = description)
        : (item.inspectorDescription = description);

    await InspectionModel.updateItem(
      currentInspectionItem.code,
      inspectionId,
      item,
    );
    await syncCurrentItem();

    if (isExpressInspectionActive) await openNextUnreviewedItem();
    else handleCloseDialog();
  };

  const handleTakePhoto = () => {
    setIsCameraVisible(true);
  };

  const handleCaptureImage = async () => {
    if (!currentInspectionItem) return;

    if (
      currentInspectionItem.images.length >= currentInspectionItem.maxImageCount
    ) {
      SweetAlertToast.fire({
        icon: "warning",
        text: "تعداد عکس های این آیتم به حداکثر رسیده است.",
      });
      return;
    }

    const capturedImage = webcamRef.current?.getScreenshot();

    if (!capturedImage) {
      SweetAlertToast.fire({
        icon: "error",
        text: "دریافت تصویر از دوربین انجام نشد.",
      });
      return;
    }

    setIsCapturing(true);

    try {
      const item = await InspectionModel.getItem(
        currentInspectionItem.code,
        inspectionId,
      );

      if (!item) return;

      item.images.push(capturedImage);

      await InspectionModel.updateItem(
        currentInspectionItem.code,
        inspectionId,
        item,
      );
      await syncCurrentItem();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRejectItem = async () => {
    if (!currentInspectionItem) return;

    const description = getValues("description");
    const item = await InspectionModel.getItem(
      currentInspectionItem.code,
      inspectionId,
    );

    if (!item) return;

    item.reviewed = true;
    item.checked = false;

    if (description) item.inspectorDescription = description;

    await InspectionModel.updateItem(
      currentInspectionItem.code,
      inspectionId,
      item,
    );
    await syncCurrentItem();

    if (isExpressInspectionActive) await openNextUnreviewedItem();
    else handleCloseDialog();
  };

  const handleRemoveImage = async (imageIndex: number) => {
    if (!currentInspectionItem) return;

    const item = await InspectionModel.getItem(
      currentInspectionItem.code,
      inspectionId,
    );

    if (!item) return;

    if (Array.isArray(item.images) && imageIndex < item.images.length) {
      item.images.splice(imageIndex, 1);

      await InspectionModel.updateItem(
        currentInspectionItem.code,
        inspectionId,
        item,
      );
      await syncCurrentItem();
      setIsCameraVisible(item.images.length < item.maxImageCount);
    }
  };

  useEffect(() => {
    if (!currentInspectionItem) return;

    const nextFacingMode = currentInspectionItem.name.includes("سلفی")
      ? "user"
      : "environment";

    setFacingMode(nextFacingMode);
    setIsCameraVisible(
      currentInspectionItem.isImage &&
        currentInspectionItem.images.length <
          currentInspectionItem.maxImageCount,
    );

    reset({
      description:
        inspectionType === "SELF_STATEMENT"
          ? (currentInspectionItem.driverDescription ?? "")
          : (currentInspectionItem.inspectorDescription ?? ""),
    });
  }, [currentInspectionItem, inspectionType, reset]);

  if (!currentInspectionItem) return null;

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth={true}>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmitForm)}>
        <div className="flex min-h-128 flex-col justify-between p-2">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between gap-2">
              <DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">
                {currentInspectionItem.name}
              </DialogTitle>
              <div className="flex shrink-0 items-center gap-1">
                <IconButton onClick={handleCloseDialog}>
                  <CloseCircle size="24" className="text-red-500" />
                </IconButton>
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 mx-4 text-sm font-Yekan-Bakh text-gray-700">
              بررسی شده: {checkedCount} از {totalCount}
            </span>
          </div>
          <DialogContent dividers={false} className="mb-2 flex flex-col gap-4">
            {currentInspectionItem.description && (
              <p className="text-sm font-Yekan-Bakh text-gray-500">
                {currentInspectionItem.description}
              </p>
            )}
            {currentInspectionItem.isImage && (
              <div className="flex flex-col gap-4 pb-4">
                {isCameraVisible && (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black">
                    <Webcam
                      onClick={handleCaptureImage}
                      ref={webcamRef}
                      audio={false}
                      mirrored={facingMode === "user"}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      videoConstraints={{ facingMode }}
                      onUserMediaError={() =>
                        SweetAlertToast.fire({
                          icon: "error",
                          text: "دسترسی به دوربین برقرار نشد. لطفا مجوز دوربین را بررسی کنید.",
                        })
                      }
                      className="max-h-80 w-full object-cover"
                    />
                    <IconButton
                      type="button"
                      onClick={handleCaptureImage}
                      disabled={
                        isCapturing ||
                        currentInspectionItem.images.length >=
                          currentInspectionItem.maxImageCount
                      }
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-500"
                    >
                      {isCapturing ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Camera size="32" variant="Bold" />
                      )}
                    </IconButton>
                    <IconButton
                      type="button"
                      size="small"
                      onClick={() =>
                        setFacingMode((currentValue) =>
                          currentValue === "user" ? "environment" : "user",
                        )
                      }
                      className="absolute bottom-3 left-3/4 -translate-x-1/2 bg-yellow-500"
                    >
                      <Refresh size="24" />
                    </IconButton>
                  </div>
                )}
                <div className="flex w-full items-center gap-4 overflow-x-auto pt-3">
                  {Array.from({
                    length: currentInspectionItem.maxImageCount,
                  }).map((_item, index) =>
                    currentInspectionItem.images[index] ? (
                      <div
                        className="flex flex-col gap-2 overflow-visible"
                        key={index}
                      >
                        <Badge
                          badgeContent={
                            index + 1 <= currentInspectionItem.minImageCount
                              ? "لازم"
                              : "اختیاری"
                          }
                          color={
                            index + 1 <= currentInspectionItem.minImageCount
                              ? "error"
                              : "success"
                          }
                        >
                          <ImageComponent
                            width="w-16"
                            height="h-16"
                            borderRadius="rounded-md"
                            image={currentInspectionItem.images[index]}
                            alt={"تصویر " + (index + 1)}
                          />
                        </Badge>
                        <Button
                          type="button"
                          color="error"
                          variant="outlined"
                          className="rounded-md"
                          onClick={() => handleRemoveImage(index)}
                          fullWidth
                        >
                          <Trash size="16" />
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        badgeContent={
                          index + 1 <= currentInspectionItem.minImageCount
                            ? "لازم"
                            : "اختیاری"
                        }
                        color={
                          index + 1 <= currentInspectionItem.minImageCount
                            ? "error"
                            : "success"
                        }
                        key={index}
                      >
                        <button
                          type="button"
                          className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-2"
                          onClick={handleTakePhoto}
                        >
                          <Camera size="32" className="text-gray-400" />
                        </button>
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}
            {currentInspectionItem.driverDescription && (
              <div className="rounded-lg bg-gray-200 p-2">
                <p className="indent-2 text-gray-900">
                  توضیحات راننده: {currentInspectionItem.driverDescription}
                </p>
              </div>
            )}
            <TextField
              {...register("description", {
                maxLength: {
                  value: 500,
                  message: "توضیحات نباید بیشتر از 500 حرف باشد",
                },
              })}
              className="col-span-3"
              id="outlined-required"
              fullWidth
              placeholder="توضیحات (اختیاری)"
              multiline
              rows={5}
              type="text"
              error={!!errors.description}
              helperText={
                errors.description
                  ? errors.description.message
                  : `${watch("description").length} / 500`
              }
              disabled={inspectionType === "RETAKE_IMAGES"}
              sx={{
                borderColor: "#f4f2f2",
              }}
            />
          </DialogContent>
          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              color="error"
              className="w-1/2 text-lg font-semibold"
              onClick={handleRejectItem}
              type="button"
            >
              رد
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="w-1/2 text-lg font-semibold"
            >
              تایید
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default InspectionItemDialog;
