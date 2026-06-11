import { useChangeTechnicalVisitStatusMutation } from "../../api/TechnicalManager/TechnicalVisit";
import InspectionData from "../../pages/dashboard/do-technical-visit/interfaces/inspection-data.interface";
import { useAppSelector } from "../../Stores/hooks";
import { setInspectionData } from "../../Stores/slices/inspection-data.slice";
import { setInspectionType } from "../../Stores/slices/inspection-type.slice";
import { GetShamsiDateTime } from "../../utilities/DateTime";
import { UndefinedToEmptyString } from "../../utilities/Helper";
import { useGetInspectionStates } from "../../utilities/Inspection-Status/InspectionStatus";
import Plate from "../shared/DataGrid/Plate";
import GetLocationDialog from "./GetLocationDialog";
import { Button, Dialog, Divider } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface iprops {
  data: InspectionData;
  isDialog?: boolean;
  isReportsPage: boolean;
  isLoading: boolean;
  onStartInspection: (data: any, location: Record<string, number>) => void;
  handleGetSabafCode?: (data: any) => void;
}

const TechnicalCard: FC<iprops> = ({
  data,
  isReportsPage,
  onStartInspection,
  isLoading,
}) => {
  const navigate = useNavigate();

  const [changeStatusMutation, changeStatusResult] =
    useChangeTechnicalVisitStatusMutation();
  const [openGetLocationDialog, setOpenGetLocationDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Record<
    string,
    number
  > | null>(null);

  const inspectionType = useAppSelector((state) => state.inspectionType);

  const handleAfterGettingLocation = useCallback(() => {
    if (inspectionType !== "RETAKE_IMAGES")
      onStartInspection(data, currentLocation);
    else {
      dispatch(setInspectionData(data));
      dispatch(setInspectionType("RETAKE_IMAGES"));
      navigate(
        `/dashboard/do-technical-visit/checklist/${data.truck_info.loader_code}`,
      );
    }
  }, [inspectionType, currentLocation]);

  useEffect(() => {
    if (!!currentLocation?.latitude) {
      setOpenGetLocationDialog(false);
      handleAfterGettingLocation();
    }
  }, [currentLocation]);

  const dispatch = useDispatch();
  const { states, getStatus } = useGetInspectionStates();

  useEffect(() => {}, [states]);

  return (
    <div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
      <div className="w-full flex items-center justify-between">
        <Plate
          firstChar={UndefinedToEmptyString(data?.plate_first_number)}
          secondChar={UndefinedToEmptyString(data?.plate_character)}
          thirdChar={UndefinedToEmptyString(data?.plate_second_number)}
          fourthChar={UndefinedToEmptyString(data?.plate_fourth_number)}
        />
        <p className="font-semibold text-gray-900 text-left">
          {getStatus(data.status)?.technical_inspection_title}
        </p>
      </div>
      <Divider />
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-700">شماره هوشمند</p>
        <p className="text-gray-900">
          {UndefinedToEmptyString(data?.truck_info.smart_number)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-700">کاربری</p>
        <p className="text-gray-900">
          {UndefinedToEmptyString(data?.truck_info.loader_name)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-700">نام شرکت</p>
        <p className="text-gray-900">
          {UndefinedToEmptyString(data?.company_name)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-700">زمان درخواست</p>
        <p className="text-gray-900">{GetShamsiDateTime(data.created_at)}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-gray-700">کد سباف</p>
        <p className="text-gray-900">
          {UndefinedToEmptyString(data.sabaf_code)}
        </p>
      </div>
      {/* <Divider />
			<div className="flex items-center justify-between">
			<p className="font-semibold">نام راننده :</p>
			<p className="font-semibold">{UndefinedToEmptyString(data?.driver_name)}</p>
			</div> */}
      {(data.status === 1 ||
        (data.status === 2 && data.self_statement === 0) ||
        (data.status === 2 && data.self_statement === 1) ||
        ((data.status === 4 || data.status === 10) &&
          data.self_statement === 0) ||
        data.status === 5) && <Divider />}
      <div className="flex gap-2 items-center">
        {!isReportsPage && data.status === 1 && (
          <>
            <Button
              className="w-1/2"
              variant="contained"
              onClick={() =>
                changeStatusMutation({
                  bazdidfani_id: data.id,
                  status: 2,
                })
              }
              loading={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 2
              }
              disabled={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 3
              }
            >
              پذیرش
            </Button>
            <Divider orientation="vertical" sx={{ height: "40%" }} />
            <Button
              className="w-1/2"
              variant="contained"
              color="error"
              loading={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 3
              }
              disabled={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 2
              }
              onClick={() =>
                changeStatusMutation({
                  bazdidfani_id: data.id,
                  status: 3,
                })
              }
            >
              رد درخواست
            </Button>
          </>
        )}
        {!isReportsPage && data.status === 2 && data.self_statement === 0 && (
          <Button
            variant="contained"
            onClick={() => setOpenGetLocationDialog(true)}
            loading={isLoading}
            className="w-full"
          >
            ثبت بازدید
          </Button>
        )}
        {!isReportsPage && data.status === 2 && data.self_statement === 1 && (
          <Button
            variant="contained"
            onClick={() => setOpenGetLocationDialog(true)}
            className="w-full"
            loading={isLoading}
          >
            بررسی خوداظهاری
          </Button>
        )}
        {!isReportsPage &&
          (data.status === 4 || data.status === 10) &&
          data.self_statement === 0 && (
            <Button
              variant="contained"
              onClick={() => setOpenGetLocationDialog(true)}
              loading={isLoading}
              className="w-full"
            >
              شروع دوباره بازدید
            </Button>
          )}
        {!isReportsPage &&
          (data.status === 4 || data.status === 10) &&
          data.self_statement === 1 && (
            <Button
              variant="contained"
              onClick={() => setOpenGetLocationDialog(true)}
              loading={isLoading}
              className="w-full"
            >
              شروع دوباره بررسی خوداظهاری
            </Button>
          )}
        {!isReportsPage && data.status === 5 && (
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenGetLocationDialog(true)}
            className="w-full"
          >
            رفع نواقص
          </Button>
        )}
        {data.status === 8 && (
          <>
            <Button
              className="w-1/2"
              variant="contained"
              onClick={() => {
                changeStatusMutation({
                  bazdidfani_id: data.id,
                  status: 2,
                });
              }}
              loading={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 2
              }
              disabled={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 3
              }
            >
              پذیرش
            </Button>
            <Button
              className="w-1/2"
              variant="contained"
              color="error"
              onClick={() => {
                changeStatusMutation({
                  bazdidfani_id: data.id,
                  status: 3,
                });
              }}
              loading={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 3
              }
              disabled={
                changeStatusResult.isLoading &&
                changeStatusResult.originalArgs.status === 2
              }
            >
              رد درخواست
            </Button>
          </>
        )}
      </div>
      <Dialog
        onClose={() => {
          setOpenGetLocationDialog(false);
        }}
        open={openGetLocationDialog}
        slotProps={{
          paper: {
            className:
              "bg-transparent! shadow-none! overflow-hidden! flex flex-row items-cetner justify-center w-screen! h-screen!",
          },
        }}
      >
        <GetLocationDialog setCurrentLocation={setCurrentLocation} />
      </Dialog>
    </div>
  );
};

export default TechnicalCard;
