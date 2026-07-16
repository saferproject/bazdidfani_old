import { FaExclamationCircle } from "react-icons/fa";
import { useGetSelfStatementChecklistQuery } from "../../api/Checklist/Checklist";
import { useAddDriverCheckListMutation, useEndOfUploadInspectionImagesMutation, useUploadInspectionImageMutation } from "../../api/Driver/Driver";
import { useAddTechnicalManagerChecklistMutation, useGetSelfStatementInspectionItemsQuery, useGetTechnicalManagerInspectionItemsQuery, useGetTechnicalManagerRejectedInspectionItemsMutation, useSubmitTechnicalVisitChecklistMutation } from "../../api/TechnicalManager/CheckList";
import QRWrapper from "../../assets/images/QRCode.png";
import { InspectionModel } from "../../database/models/inspection.model";
import { useAppDispatch, useAppSelector } from "../../Stores/hooks";
import { activateExpressInspection, deactivateExpressInspection } from "../../Stores/slices/express-inspection.slice";
import { clearInspectionData } from "../../Stores/slices/inspection-data.slice";
import { clearInspectionType } from "../../Stores/slices/inspection-type.slice";
import { clearSelfStatementData } from "../../Stores/slices/self-statement-data.slice";
import { closeTextDialog, setTextDialogData } from "../../Stores/slices/text-dialog.slice";
import useIsPhone from "../../utilities/custom-hooks/use-is-phone";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import GroupInspectionItem from "./InspectionItem/GroupInspectionItem";
import SingleInspectionItem from "./InspectionItem/SingleInspectionItem";
import InspectionItemDialog from "./InspectionItemDialog/InspectionItemDialog";
import InspectionItem from "./interfaces/inspection-item.interface";
import InspectionProps from "./interfaces/inspection-props.interface";
import createImageFormData from "./utilities/create-image-form-data";
import formatInspectionItem from "./utilities/format-inspection-item";
import formatOrganizationData from "./utilities/format-organization-data";
import proccessInspectionPhotos from "./utilities/proccess-inspection-photos";
import validateInspectionItems from "./utilities/validate-inspection-items";
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Box, Button, CircularProgress } from "@mui/material";
import { Check, Play } from "iconsax-reactjs";
import { motion } from "motion/react";
import { FC, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeftLong, FaChevronDown, FaX } from "react-icons/fa6";
import { useBlocker, useNavigate, useSearchParams } from "react-router-dom";

const QRCode = lazy(() => import("react-qr-code"));

const flattenInspectionItems = (items: InspectionItem[]) =>
  items.flatMap((item) => [item, ...(item.details ?? [])]);

const Inspection: FC<InspectionProps> = ({ loaderTypeCode }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isPhone = useIsPhone();
  const [searchParams] = useSearchParams();

  const selfStatementData = useAppSelector((state) => state.selfStatementData);
  const inspectionData = useAppSelector((state) => state.inspectionData);
  const inspectionType = useAppSelector((state) => state.inspectionType);

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [currentInspectionItem, setCurrentInspectionItem] =
    useState<InspectionItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isNavigationBlocked, setNavigationBlocked] = useState(true);
  const [progress, setProgress] = useState({
    visible: false,
    value: 0,
    maxSteps: 0,
    title: "",
  });
  const [isInspectionDataSent, setInspectionDataSent] = useState(false);

  const uploadQueueRef = useRef<FormData[]>([]);
  const isUploadingRef = useRef(false);
  const blocker = useBlocker(isNavigationBlocked);

  const selfStatementInspectionItemsData =
    useGetSelfStatementInspectionItemsQuery(
      {
        TrailerTypeCode: loaderTypeCode,
        selfStatement: true,
      },
      { skip: inspectionType !== "SELF_STATEMENT" },
    );

  const technicalManagerInspectionItemsData =
    useGetTechnicalManagerInspectionItemsQuery(
      {
        TrailerTypeCode: String(loaderTypeCode),
        with_last_rejected_checklist: "true"
      },
      {
        skip:
          inspectionType !== "TECHNICAL_FREIGHTER" &&
          inspectionType !== "TECHNICAL_PASSENGER",
      },
    );

  const selfStatement = useGetSelfStatementChecklistQuery(
    {
      smart_number: inspectionData?.truck_info?.smart_number ?? "",
      national_code: inspectionData?.driver_national_code ?? "",
      bazdidfani_id: inspectionData?.id ?? 0,
    },
    { skip: inspectionType !== "REVIEW_SELF_STATEMENT" || !inspectionData },
  );

  const [endOfUploadInspectionImagesFn, endOfUploadInspectionImagesResult] =
    useEndOfUploadInspectionImagesMutation();
  const [uploadInspectionImageFn] = useUploadInspectionImageMutation();
  const [addChecklistFn, addChecklistResult] = useAddDriverCheckListMutation();
  const [addTechnicalCheckListFn, addTechnicalChecklistResult] =
    useAddTechnicalManagerChecklistMutation();
  const [submitTechnicalVisitChecklistFn, submitTechnicalVisitChecklistResult] =
    useSubmitTechnicalVisitChecklistMutation();
  const [
    getTechnicalManagerRejectedInspectionItemsFn,
    technicalManagerRejectedInspectionItemsResult,
  ] = useGetTechnicalManagerRejectedInspectionItemsMutation();

  const queryInspectionId = Number(searchParams.get("inspectionId") ?? 0);

  const inspectionId = useMemo(() => {
    if (inspectionType === "RETAKE_IMAGES")
      return Number(
        technicalManagerRejectedInspectionItemsResult.data?.data?.[0]
          ?.technical_inspection_id ?? 0,
      );

    if (queryInspectionId > 0) return queryInspectionId;
    if (inspectionType === "SELF_STATEMENT")
      return Number(selfStatementData?.id ?? 0);

    return Number(inspectionData?.id ?? 0);
  }, [
    inspectionType,
    technicalManagerRejectedInspectionItemsResult.data,
    queryInspectionId,
    selfStatementData?.id,
    inspectionData?.id,
  ]);

  const inspectionPersistMeta = useMemo(() => {
    if (inspectionType === "SELF_STATEMENT")
      return {
        inspectorId: 0,
        driverNationalCode: selfStatementData?.driver?.national_code ?? null,
      };

    return {
      inspectorId: inspectionData?.technical_manager?.id ?? 0,
      driverNationalCode: inspectionData?.driver_national_code ?? null,
    };
  }, [
    inspectionType,
    selfStatementData?.driver?.national_code,
    inspectionData?.technical_manager?.id,
    inspectionData?.driver_national_code,
  ]);

  const isChecklistLoading =
    (inspectionType === "SELF_STATEMENT" &&
      (selfStatementInspectionItemsData.isLoading ||
        selfStatementInspectionItemsData.isFetching)) ||
    ((inspectionType === "TECHNICAL_FREIGHTER" ||
      inspectionType === "TECHNICAL_PASSENGER") &&
      (technicalManagerInspectionItemsData.isLoading ||
        technicalManagerInspectionItemsData.isFetching)) ||
    (inspectionType === "REVIEW_SELF_STATEMENT" &&
      (selfStatement.isLoading || selfStatement.isFetching)) ||
    (inspectionType === "RETAKE_IMAGES" &&
      technicalManagerRejectedInspectionItemsResult.isLoading);

  const navigateBackToList = () => {
    setNavigationBlocked(false);
    navigate(-1);
  };

  const handleCloseTextDialog = () => dispatch(closeTextDialog());

  const refreshInspectionState = async (selectedCode?: number) => {
    if (!inspectionId) {
      setInspectionItems([]);
      setCurrentInspectionItem(null);
      return;
    }

    const items = await InspectionModel.getAllItems(inspectionId);
    setInspectionItems(items);

    const codeToRefresh = selectedCode ?? currentInspectionItem?.code;

    if (!codeToRefresh) {
      setCurrentInspectionItem(null);
      return;
    }

    const refreshedItem = await InspectionModel.getItem(
      codeToRefresh,
      inspectionId,
    );
    setCurrentInspectionItem(refreshedItem);
  };

  const buildInspectionTree = async (data: InspectionItem[]) => {
    const savedInspection = await InspectionModel.getInspection(inspectionId);
    const savedItems = savedInspection
      ? flattenInspectionItems(savedInspection.items)
      : [];

    return data.map((inspectionItem) => {
      const restoredInspectionItem = savedItems.find(
        (item) => item.code === inspectionItem.code,
      );
      const newInspectionItem = restoredInspectionItem
        ? formatInspectionItem(inspectionItem, restoredInspectionItem)
        : formatInspectionItem(inspectionItem);

      if (!newInspectionItem.details?.length) return newInspectionItem;

      newInspectionItem.details = newInspectionItem.details.map((detail) => {
        const restoredDetailItem = savedItems.find(
          (item) => item.code === detail.code,
        );

        return restoredDetailItem
          ? formatInspectionItem(detail, restoredDetailItem)
          : formatInspectionItem(detail);
      });

      newInspectionItem.checked = newInspectionItem.details?.every(
        (detail) => detail.checked,
      );
      newInspectionItem.reviewed = newInspectionItem.details?.every(
        (detail) => detail.reviewed,
      );

      return newInspectionItem;
    });
  };

  const persistInspectionItems = async (items: InspectionItem[]) => {
    if (!inspectionId) return;

    await InspectionModel.insertInspection({
      inspectionId,
      inspectorId: inspectionPersistMeta.inspectorId,
      driverNationalCode: inspectionPersistMeta.driverNationalCode,
      isSelfStatement: inspectionType === "SELF_STATEMENT",
      trailerCode: loaderTypeCode,
      dateStarted: new Date(),
      items,
    });

    await refreshInspectionState();
  };

  const openInspectionItemDialog = (inspectionItem: InspectionItem) => {
    setCurrentInspectionItem(inspectionItem);
    setIsItemDialogOpen(true);
  };

  const handleItemSelection = (item: InspectionItem) => {
    openInspectionItemDialog(item);
  };

  const openNextItem = async () => {
    if (!inspectionId) return;

    const nextItem = await InspectionModel.getFirstUnreviewedItem(inspectionId);

    if (!nextItem) {
      SweetAlertToast.fire({
        icon: "success",
        text: "تمام موارد با موفقیت بررسی شد.",
      });
      setCurrentInspectionItem(null);
      dispatch(deactivateExpressInspection());
      openConfirmInspection();
      return;
    }

    handleItemSelection(nextItem);
  };

  const handleToggleInspectionItem = async (item: InspectionItem) => {
    if (!inspectionId) return;

    if (!item.reviewed) {
      handleItemSelection(item);
      return;
    }

    const storedItem = await InspectionModel.getItem(item.code, inspectionId);

    if (!storedItem) return;

    storedItem.checked = !storedItem.checked;
    storedItem.reviewed = true;

    await InspectionModel.updateItem(item.code, inspectionId, storedItem);
    await refreshInspectionState();
  };

  const handleEditInspectionItem = (item: InspectionItem) => {
    handleItemSelection(item);
  };

  const calculateProgressSteps = (items: InspectionItem[]) =>
    items.reduce((total, item) => {
      if (item.details.length)
        return (
          total +
          item.details.reduce(
            (detailTotal, detail) => detailTotal + detail.images.length,
            0,
          )
        );

      return total + item.images.length;
    }, 0) + 2;

  const saveInspectionImages = async () => {
    setProgress((currentValue) => ({
      ...currentValue,
      visible: true,
      value: 1,
      title: "آماده سازی عکس ها برای ارسال ...",
    }));

    try {
      if (!inspectionId) throw new Error("شناسه بازدید نامعتبر است.");

      const isSelfStatement = inspectionType === "SELF_STATEMENT" ? 1 : 0;
      const inspectionImages = await proccessInspectionPhotos(
        await InspectionModel.getAllItems(inspectionId),
        inspectionId,
        isSelfStatement,
      );
      const imageData = createImageFormData(inspectionImages);

      uploadQueueRef.current = imageData;
      setProgress((cur) => ({
        ...cur,
        maxSteps: imageData.length + 2,
        title: `عکس های ارسال شده: 0 از ${imageData.length}`,
      }));

      await processUploadQueue();
    } catch (err: any) {
      setProgress({ visible: false, value: 0, maxSteps: 0, title: "" });
      SweetAlertToast.fire({
        icon: "error",
        text: err?.message ?? "خطا در آماده سازی عکس ها",
      });
    }
  };

  const saveInspectionData = async () => {
    try {
      handleCloseTextDialog();

      if (!inspectionId) throw new Error("شناسه بازدید نامعتبر است.");

      if (!isInspectionDataSent) {
        const currentInspectionItems =
          await InspectionModel.getAllItems(inspectionId);

        setProgress({
          visible: true,
          value: 0,
          maxSteps: calculateProgressSteps(currentInspectionItems),
          title: "ارسال اطلاعات چک لیست ...",
        });

        if (!validateInspectionItems(currentInspectionItems))
          throw new Error(
            "لطفا سلامت تمامی موارد را تایید نمایید و عکس های لازم را ذخیره کنید.",
          );

        const sendableItems = currentInspectionItems.map((item) => ({
          ...item,
          images: [],
          details: item.details.map((detail) => ({ ...detail, images: [] })),
        }));

        const sendableData = {
          inspectionItems: sendableItems,
          inspectionId,
          isSelfStatement: inspectionType === "SELF_STATEMENT" ? 1 : 0,
        };

        if (inspectionType === "SELF_STATEMENT")
          await addChecklistFn(sendableData).unwrap();
        else if (inspectionType === "DIRECT_TECHNICAL_VISIT")
          await submitTechnicalVisitChecklistFn(sendableData).unwrap();
        else await addTechnicalCheckListFn(sendableData).unwrap();
      } else await saveInspectionImages();
    } catch (error: any) {
      setProgress({ visible: false, value: 0, maxSteps: 0, title: "" });

      if (error?.data)
        SweetAlertToast.fire({
          icon: "error",
          text: error.data?.message ?? "خطای نامشخص در ارسال چک لیست",
        });
      else
        SweetAlertToast.fire({ icon: "error", text: (error as Error).message });
    }
  };

  const processUploadQueue = async () => {
    if (isUploadingRef.current) return;

    isUploadingRef.current = true;

    try {
      const total = uploadQueueRef.current.length;
      let failedCount = 0;
      let sentCount = 0;

      for (let idx = 0; idx < total; idx++) {
        const formData = uploadQueueRef.current[idx];
        let success = false;

        try {
          await uploadInspectionImageFn(formData).unwrap();
          success = true;
        } catch {
          failedCount += 1;
          SweetAlertToast.fire({
            icon: "warning",
            text: "ارسال عکس ناموفق بود",
          });
        }

        if (success) sentCount += 1;

        setProgress((cur) => ({
          ...cur,
          value: sentCount + 1,
          title: `عکس های ارسال شده: ${sentCount} از ${total}`,
        }));
      }

      if (!inspectionId) throw new Error("شناسه بازدید نامعتبر است.");

      const isSelfStatement = inspectionType === "SELF_STATEMENT" ? 1 : 0;

      setTimeout(
        () =>
          setProgress((cur) => ({
            ...cur,
            value: cur.maxSteps - 1,
            title: "بررسی نهایی عکس ها ...",
          })),
        500,
      );

      if (failedCount > 0 && inspectionType !== "REVIEW_SELF_STATEMENT") {
        SweetAlertToast.fire({
          icon: "warning",
          text: `${failedCount} عکس ارسال نشد. پس از ثبت نهایی لطفا بررسی و در صورت نیاز مجدد ارسال کنید.`,
        });
      } else
        await endOfUploadInspectionImagesFn({
          inspectionId,
          isSelfStatement,
        }).unwrap();
    } catch (err: any) {
      setProgress({ visible: false, value: 0, maxSteps: 0, title: "" });
      SweetAlertToast.fire({
        icon: "error",
        text: err?.message ?? "خطا در ارسال عکس ها",
      });
    } finally {
      setProgress({ visible: false, value: 0, maxSteps: 0, title: "" });
      isUploadingRef.current = false;
      uploadQueueRef.current = [];
    }
  };

  const handleSubmitRejectVehicleHealth = async () => {
    try {
      if (!inspectionId) throw new Error("شناسه بازدید نامعتبر است.");

      const currentInspectionItems =
        await InspectionModel.getAllItems(inspectionId);

      setProgress({
        visible: true,
        value: 0,
        maxSteps: calculateProgressSteps(currentInspectionItems),
        title: "ارسال اطلاعات چک لیست ...",
      });

      const sendableItems = currentInspectionItems.map((item) => ({
        ...item,
        images: [],
        details: item.details.map((detail) => ({ ...detail, images: [] })),
      }));

      const sendableData = {
        inspectionItems: sendableItems,
        inspectionId,
        isSelfStatement: inspectionType === "SELF_STATEMENT" ? 1 : 0,
      };

      if (inspectionType === "SELF_STATEMENT")
        await addChecklistFn(sendableData).unwrap();
      else if (inspectionType === "DIRECT_TECHNICAL_VISIT")
        await submitTechnicalVisitChecklistFn(sendableData).unwrap();
      else await addTechnicalCheckListFn(sendableData).unwrap();
    } catch (error: any) {
      setProgress({ visible: false, value: 0, maxSteps: 0, title: "" });

      if (error?.data)
        SweetAlertToast.fire({
          icon: "error",
          text: error.data?.message ?? "خطای نامشخص در ارسال چک لیست",
        });
      else
        SweetAlertToast.fire({ icon: "error", text: (error as Error).message });
    }
  };

  const handleCloseItemDialog = () => {
    setIsItemDialogOpen(false);
    dispatch(deactivateExpressInspection());
  };

  const handleCancelInspection = async () => {
    if (inspectionType === "SELF_STATEMENT") dispatch(clearSelfStatementData());
    else dispatch(clearInspectionData()); // covers TECHNICAL_*, DIRECT_TECHNICAL_VISIT, RETAKE_IMAGES
    dispatch(clearInspectionType());

    setCurrentInspectionItem(null);
    if (inspectionId) await InspectionModel.removeInspection(inspectionId);
    handleCloseTextDialog();
    navigateBackToList();
  };

  const handleCancelNavigation = () => {
    blocker.reset();
    handleCloseTextDialog();
  };

  const handleStartExpressInspection = () => {
    dispatch(activateExpressInspection());
    openNextItem();
  };

  const openCancelInspection = () => {
    const visitLabel =
      inspectionType === "SELF_STATEMENT" ? "خوداظهاری" : "بازدید فنی";
    dispatch(
      setTextDialogData({
        isOpen: true,
        title: `انصراف ${visitLabel}`,
        description: `با انصراف از ${visitLabel} تمام اطلاعات ثبت شده پاک می شود.`,
        fullWidth: true,
        buttons: (
          <>
            <Button
              onClick={handleCancelNavigation}
              color="info"
              variant="contained"
              className="self-center grow basis-1/2"
            >
              بازگشت
            </Button>
            <Button
              onClick={handleCancelInspection}
              variant="contained"
              color="error"
              className="self-center grow basis-1/2"
            >
              انصراف می دهم
            </Button>
          </>
        ),
      }),
    );
  };

  const openConfirmInspection = () => {
    const isSelfStatement = inspectionType === "SELF_STATEMENT";
    dispatch(
      setTextDialogData({
        isOpen: true,
        title: isSelfStatement ? "ثبت نهایی خوداظهاری" : "ثبت نهایی بازدید",
        description: `آیا از تایید کل موارد ${isSelfStatement ? "خود اظهاری" : "بازدید فنی"} مطمئن هستید ؟`,
        persist: true,
        buttons: (
          <>
            <Button
              onClick={handleCloseTextDialog}
              variant="contained"
              className="self-center grow basis-1/2"
              color="info"
              size="large"
            >
              بازگشت
            </Button>
            <Button
              onClick={saveInspectionData}
              color="primary"
              variant="contained"
              className="self-center grow basis-1/2"
              size="large"
            >
              تایید و ثبت
            </Button>
          </>
        ),
      }),
    );
  };

  const handleCheckRemainingItems = async () => {
    if (!inspectionId) return;

    const items = await InspectionModel.getAllItems(inspectionId);

    const updatePromises: Promise<any>[] = [];

    const updateItem = async (item: InspectionItem) => {
      if (item.checked) return;
      if (item.requiredImage) return;

      const stored = await InspectionModel.getItem(item.code, inspectionId);
      if (!stored) return;

      stored.checked = true;
      stored.reviewed = true;

      updatePromises.push(
        InspectionModel.updateItem(item.code, inspectionId, stored)
      );
    };

    for (const item of items) {
      if (item.details?.length) {
        for (const detail of item.details) {
          await updateItem(detail);
        }

        const parent = await InspectionModel.getItem(item.code, inspectionId);
        if (parent) {
          parent.checked = parent.details.every((d) => d.checked);
          parent.reviewed = parent.details.every((d) => d.reviewed);

          updatePromises.push(
            InspectionModel.updateItem(item.code, inspectionId, parent)
          );
        }
      } else {
        await updateItem(item);
      }
    }

    await Promise.all(updatePromises);
    await refreshInspectionState();
  };

  useEffect(() => {
    const eventFn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      navigateBackToList();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", eventFn);

    return () => {
      window.removeEventListener("beforeunload", eventFn);
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(deactivateExpressInspection());
    };
  }, []);

  useEffect(() => {
    if (isNavigationBlocked && blocker.state === "blocked")
      openCancelInspection();
    else if (!isNavigationBlocked && blocker.state === "blocked")
      blocker.proceed();
  }, [isNavigationBlocked, blocker.state]);

  useEffect(() => {
    if (inspectionType === "RETAKE_IMAGES")
      getTechnicalManagerRejectedInspectionItemsFn({
        bazdidfani_id: inspectionData.id,
        company_id: inspectionData.company_id,
        technical_manager_id: inspectionData.technical_manager.id,
      });
  }, [inspectionType]);

  useEffect(() => {
    if (!inspectionId) return;

    refreshInspectionState();
  }, [inspectionId]);

  useEffect(() => {
    (async () => {
      if (!selfStatementInspectionItemsData.isSuccess || !inspectionId) return;

      await persistInspectionItems(
        await buildInspectionTree(selfStatementInspectionItemsData.data.data),
      );
    })();
  }, [selfStatementInspectionItemsData.isSuccess, inspectionId]);

  useEffect(() => {
    (async () => {
      if (!technicalManagerInspectionItemsData.isSuccess || !inspectionId)
        return;

      await persistInspectionItems(
        await buildInspectionTree(
          technicalManagerInspectionItemsData.data.data?.checkList,
        ),
      );
    })();
  }, [technicalManagerInspectionItemsData.isSuccess, inspectionId]);

  useEffect(() => {
    (async () => {
      if (!selfStatement.isSuccess || !inspectionId) return;

      await persistInspectionItems(
        formatOrganizationData(
          selfStatement.data.data.dtaP_CheckLists,
          selfStatement.data.data.images,
        ),
      );
    })();
  }, [selfStatement.isSuccess, inspectionId]);

  useEffect(() => {
    (async () => {
      if (
        !technicalManagerRejectedInspectionItemsResult.isSuccess ||
        !technicalManagerRejectedInspectionItemsResult.data ||
        !inspectionId
      )
        return;

      await persistInspectionItems(
        await buildInspectionTree(
          technicalManagerRejectedInspectionItemsResult.data.data,
        ),
      );
      setInspectionDataSent(true);
    })();
  }, [
    technicalManagerRejectedInspectionItemsResult.isSuccess,
    technicalManagerRejectedInspectionItemsResult.data,
    inspectionId,
  ]);

  useEffect(() => {
    if (
      (inspectionType === "SELF_STATEMENT" && addChecklistResult.isSuccess) ||
      (inspectionType === "DIRECT_TECHNICAL_VISIT" &&
        submitTechnicalVisitChecklistResult.isSuccess) ||
      (inspectionType !== "SELF_STATEMENT" &&
        inspectionType !== "DIRECT_TECHNICAL_VISIT" &&
        addTechnicalChecklistResult.isSuccess)
    ) {
      setInspectionDataSent(true);
      saveInspectionImages();
    }
  }, [
    addChecklistResult.isSuccess,
    addTechnicalChecklistResult.isSuccess,
    submitTechnicalVisitChecklistResult.isSuccess,
  ]);

  useEffect(() => {
    if (!endOfUploadInspectionImagesResult.isSuccess) return;

    if (inspectionType === "SELF_STATEMENT") dispatch(clearSelfStatementData());
    else dispatch(clearInspectionData()); // covers TECHNICAL_*, DIRECT_TECHNICAL_VISIT, RETAKE_IMAGES
    dispatch(clearInspectionType());

    setCurrentInspectionItem(null);
    if (inspectionId) InspectionModel.removeInspection(inspectionId);
    navigateBackToList();
  }, [endOfUploadInspectionImagesResult.isSuccess]);

  const inspectionProgress = useMemo(
    () =>
      inspectionItems.reduce(
        (acc, item) => {
          if (item.details?.length) {
            item.details.forEach((detail) => {
              acc.total += 1;
              if (detail.checked) acc.checked += 1;
            });
          } else {
            acc.total += 1;
            if (item.checked) acc.checked += 1;
          }

          return acc;
        },
        { checked: 0, total: 0 },
      ),
    [inspectionItems],
  );

  const inspectionList = useMemo(() => {
    if (!inspectionItems.length) return null;

    return inspectionItems.map((item, index) => (
      <motion.li
        key={item.code}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      >
        {item.details?.length ? (
          <GroupInspectionItem
            item={item}
            onToggleItem={handleToggleInspectionItem}
            onEditItem={handleEditInspectionItem}
          />
        ) : (
          <SingleInspectionItem
            item={item}
            onToggleItem={handleToggleInspectionItem}
            onEditItem={handleEditInspectionItem}
          />
        )}
      </motion.li>
    ));
  }, [inspectionItems]);

  const previousRejected = useMemo(() => {
    if (!technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems?.length) return null;

    return technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems?.map((item, index) => (
      <motion.li
        key={item.code}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      >
        {item.details?.length ? (
          <GroupInspectionItem
            item={item}
            onToggleItem={handleToggleInspectionItem}
            onEditItem={handleEditInspectionItem}
          />
        ) : (
          <SingleInspectionItem
            item={item}
            onToggleItem={handleToggleInspectionItem}
            onEditItem={handleEditInspectionItem}
          />
        )}
      </motion.li>
    ));
  }, [technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems]);

  const allRequiredImagesDone = useMemo(() => {
    const flat = flattenInspectionItems(inspectionItems);

    return flat.every(item =>
      item.requiredImage ? item.checked : true
    );
  }, [inspectionItems]);

  if (!isPhone)
    return (
      <div className="mx-auto flex min-h-full max-w-225 w-full flex-col items-center justify-center gap-6 overflow-hidden">
        <div
          className="flex h-56 w-56 flex-row items-center justify-center"
          style={{
            backgroundImage: `url(${QRWrapper})`,
            backgroundClip: "border-box",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundOrigin: "border-box",
          }}
        >
          <Suspense fallback={null}>
            <QRCode
              className="mt-10"
              size={135}
              value={window.location.href}
              fgColor="#00eb93"
            />
          </Suspense>
        </div>
        <p className="text-center text-4xl">
          برای ثبت چک لیست ها باید با موبایل وارد شوید!
        </p>
        <p className="text-center text-2xl">
          با اسکن کردن کد بالا وارد سامانه بازدید فنی از طریق گوشی شوید.
        </p>
      </div>
    );

  return (
    <div className="mx-auto mt-[45%] min-h-fit max-w-225 w-full overflow-hidden sm:mt-[40%] md:mt-[30%] lg:mt-[20%]">
      {isItemDialogOpen && currentInspectionItem && inspectionId > 0 && (
        <InspectionItemDialog
          isOpen={isItemDialogOpen}
          currentInspectionItem={currentInspectionItem}
          inspectionId={inspectionId}
          inspectionType={inspectionType}
          checkedCount={inspectionProgress.checked}
          totalCount={inspectionProgress.total}
          handleCloseDialog={handleCloseItemDialog}
          onItemUpdated={refreshInspectionState}
          onOpenItem={handleItemSelection}
          onItemsFinished={openConfirmInspection}
        />
      )}
      <Backdrop sx={{ color: "#fff", zIndex: 100 }} open={progress.visible}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <h4>{progress.title}</h4>
          <CircularProgress
            value={Math.ceil((progress.value * 100) / progress.maxSteps)}
            variant="determinate"
            color="primary"
            size={48}
          />
        </div>
      </Backdrop>
      {isChecklistLoading && !inspectionItems.length ? (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4">
          <CircularProgress size={48} color="primary" />
          <p className="text-sm text-gray-500">
            در حال دریافت آیتم های بازدید...
          </p>
        </div>
      ) : (
        <>
          {!!technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems && technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems?.length >= 0 && (
            <Accordion className="mb-2 bg-rose-100!">
              <AccordionSummary expandIcon={<FaChevronDown className="text-secondary" />} slotProps={{
                content: {
                  className: "flex flex-row justify-start gap-2"
                }
              }} className="w-full!">
                <FaExclamationCircle className="text-2xl! text-rose-600" />
                <Box>
                  {Intl.NumberFormat("fa-IR").format(technicalManagerInspectionItemsData?.data?.data?.previousRejectedItems?.length)}{" "} 
                  مورد قبلا دارای مشکل بوده!!
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {previousRejected}
              </AccordionDetails>
            </Accordion>
          )}
          {!inspectionItems?.every((item) => item.checked) && (
            <Button
              endIcon={<Play className="rotate-180" size="32" />}
              variant="contained"
              color="primary"
              onClick={handleStartExpressInspection}
              className="mb-4 grow flex-row justify-between text-lg text-black shadow-xl"
              fullWidth
            >
              شروع بازدید
            </Button>
          )}
          {
            allRequiredImagesDone && (
              <Button
                endIcon={<Check className="" size="32" />}
                variant="contained"
                color="primary"
                onClick={handleCheckRemainingItems}
                className="mb-4 grow flex-row justify-between text-lg text-black shadow-xl"
                fullWidth
              >
                تیک زدن تمامی آیتم های باقی مانده
              </Button>
            )
          }
          <ul className="flex flex-col gap-4">{inspectionList}</ul>
          <div className="mt-4 flex flex-row gap-2">
            {inspectionType === "SELF_STATEMENT" ? (
              <>
                <Button
                  className="w-1/2"
                  variant="outlined"
                  color="error"
                  onClick={openCancelInspection}
                >
                  انصراف
                </Button>
                <Button
                  className="w-1/2"
                  type="submit"
                  variant="contained"
                  endIcon={<FaArrowLeftLong />}
                  onClick={openConfirmInspection}
                >
                  ثبت
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  endIcon={<FaX className="text-sm md:text-lg" />}
                  color="error"
                  onClick={handleSubmitRejectVehicleHealth}
                  className="flex items-center justify-between"
                  disabled={inspectionType === "RETAKE_IMAGES"}
                >
                  رد بازدید
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<FaArrowLeftLong className="text-sm md:text-lg" />}
                  onClick={openConfirmInspection}
                >
                  تایید و ارسال
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Inspection;
