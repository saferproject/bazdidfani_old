import { useGetCompanyTechnicalManagersQuery } from "../../api/Categories/TechnicalManager";
import { useRedirectInspectionMutation } from "../../api/Company/NewRequest";
import SabafCode from "../../pages/dashboard/reports/SabafCode";
import { GetShamsiDateTime } from "../../utilities/DateTime";
import { UndefinedToEmptyString } from "../../utilities/Helper";
import { useGetInspectionStates } from "../../utilities/Inspection-Status/InspectionStatus";
import Plate from "../shared/DataGrid/Plate";
import SaferTextDialogProps from "../shared/dialogs/TextDialog/interfaces/text-dialog-props.interface";
import SaferTextDialog from "../shared/dialogs/TextDialog/TextDialog";
import { Autocomplete, Button, Divider, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";



































interface iprops {
	data: any;
	isDialog?: boolean;
	isReportPage?: boolean;
	onGetSabafSuccess: () => void;
	onCopyRequest: (data) => void;
}

const RequestCard: FC<iprops> = ({ data, isDialog, onGetSabafSuccess, onCopyRequest }) => {
	const { states, getStatus } = useGetInspectionStates();

	useEffect(() => {}, [states]);

	const { control, getValues } = useForm();

	const [saferDialogData, setSaferDialogData] = useState<SaferTextDialogProps>({
		isOpen: false,
		title: "",
		description: "",
		maxWidth: "md",
		fullWidth: true,
		fullScreen: false,
		contentDividers: true,
		buttons: <></>,
	});
	const handleCloseDialog = () => setSaferDialogData((prevData) => ({ ...prevData, isOpen: false }));

	const { data: TMData } = useGetCompanyTechnicalManagersQuery({ status: 1 });
	const [redirectInspectionFn, { isLoading: RILoading, isSuccess: RISuccess }] = useRedirectInspectionMutation();

	const handleRedirectInspection = () => {
		const formValues = getValues();

		redirectInspectionFn({
			bazdidfani_id: data.id,
			technical_manager_id: formValues.technicalManager.personal.id,
			technical_manager_national_code: formValues.technicalManager.personal.national_code,
		});
	};

	useEffect(() => {
		if (RISuccess) handleCloseDialog();
	}, [RISuccess]);

	const handleOpenInspectionRedirectDialog = () => {
		setSaferDialogData({
			isOpen: true,
			title: "ارجاع مجدد درخواست",
			description: "مدیر فنی راانتخاب کنید",
			children: (
				<Controller
					name="technicalManager"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							options={TMData.data.data ?? []}
							getOptionLabel={(option: any) => option.personal.full_name}
							isOptionEqualToValue={(option, value) => option?.id === value?.id}
							value={value}
							onChange={(_event, newValue) => {
								onChange(newValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="مدیر فنی"
									placeholder="مدیر فنی را انتخاب کنید"
								/>
							)}
						/>
					)}
				/>
			),
			buttons: (
				<>
					<Button
						className="grow"
						variant="outlined"
						color="error"
						onClick={handleCloseDialog}
					>
						لغو
					</Button>
					<Button
						className="grow"
						variant="contained"
						color="primary"
						loading={RILoading}
						onClick={handleRedirectInspection}
					>
						تایید
					</Button>
				</>
			),
		});
	};

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<SaferTextDialog {...saferDialogData}></SaferTextDialog>
			<div className="w-full flex justify-around items-center gap-2">
				<Plate
					firstChar={UndefinedToEmptyString(data?.truck?.first_number)}
					fourthChar={UndefinedToEmptyString(data?.truck?.fourth_number)}
					secondChar={UndefinedToEmptyString(data?.truck?.third_character)}
					thirdChar={UndefinedToEmptyString(data?.truck?.second_number)}
				/>
				<p className="font-semibold text-gray-900 text-left">{getStatus(data?.status)?.technical_inspection_title}</p>
			</div>
			<Divider />
			<div className="w-full flex items-center justify-between">
				<p className="text-gray-700">شماره هوشمند</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.truck.smart_number)}</p>
			</div>
			<div className="w-full flex items-center justify-between">
				<p className="text-gray-700">رهگیری</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.code)}</p>
			</div>
			<div className="w-full flex items-center justify-between">
				<p className="text-gray-700">کاربری</p>
				<p className="text-gray-900">{data?.bazdidfani?.truck_info?.truck?.usage === "passenger" ? "مسافری" : "باری"}</p>
			</div>
			<div className="w-full flex items-center justify-between">
				<p className="text-gray-700">زمان درخواست</p>
				<p className="text-gray-900">{GetShamsiDateTime(data.created_at)}</p>
			</div>
			<Divider />
			<div className={`w-full flex gap-2 justify-center items-center ${isDialog ? "hidden" : "block"}`}>
				{data.status === 7 || data.status === 13 || data.status === 14 ? (
					<SabafCode
						data={data}
						onSuccess={onGetSabafSuccess}
					/>
				) : data.status === 3 ? (
					<Button
						variant="contained"
						color="warning"
						onClick={() => handleOpenInspectionRedirectDialog()}
						fullWidth
					>
						ارجاع مجدد
					</Button>
				) : (
					<Button
						onClick={() => onCopyRequest(data)}
						variant="contained"
						color="primary"
						fullWidth
					>
						کپی
					</Button>
				)}
			</div>
		</div>
	);
};

export default RequestCard;
