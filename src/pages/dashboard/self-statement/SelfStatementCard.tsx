import Plate from "../../../components/shared/DataGrid/Plate";
import { GetShamsiDateTime } from "../../../utilities/DateTime";
import { UndefinedToEmptyString } from "../../../utilities/Helper";
import { useGetInspectionStates } from "../../../utilities/Inspection-Status/InspectionStatus";
import { Button, Divider } from "@mui/material";
import { useEffect } from "react";

export default function SelfStatementCard({
  data,
  onStartSelfStatement,
  isLoading,
}) {
  const { states, getStatus } = useGetInspectionStates();

  useEffect(() => {}, [states]);

  return (
    <div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <Plate
          firstChar={UndefinedToEmptyString(data?.truck?.first_number)}
          fourthChar={UndefinedToEmptyString(data?.truck?.fourth_number)}
          secondChar={UndefinedToEmptyString(data?.truck?.third_character)}
          thirdChar={UndefinedToEmptyString(data?.truck?.second_number)}
        />
        <p className="font-semibold text-gray-900 text-left">
          {getStatus(data.status).self_statement_title}
        </p>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <p className="text-gray-700">نام ماشین</p>
        <p className="text-gray-900">{data.truck.loader_type}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-700">شماره هوشمند</p>
        <p className="text-gray-900">{data.truck.smart_number}</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-700">تاریخ درخواست</p>
        <p className="text-gray-900">{GetShamsiDateTime(data.created_at)}</p>
      </div>
      {(data.status === 1 || data.status === 10) && <Divider />}
      <div>
        {(data.status === 1 || data.status === 10) && (
          <Button
            fullWidth
            variant="contained"
            loading={isLoading}
            onClick={() => onStartSelfStatement(data)}
          >
            انجام خوداظهاری
          </Button>
        )}
      </div>
    </div>
  );
}
