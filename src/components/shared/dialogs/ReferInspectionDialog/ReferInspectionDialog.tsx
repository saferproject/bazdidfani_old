import { FC, useEffect } from "react";
import ReferInspectionDialogProps from "./interfaces/refer-inspection-dialog-props.interface";
import { Autocomplete, Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { Controller, useForm } from "react-hook-form";
import { useRedirectInspectionMutation } from "../../../../api/Company/NewRequest";
import { useGetTechnicalManagerQuery } from "../../../../api/Categories/TechnicalManager";

const ReferInspectionDialog: FC<ReferInspectionDialogProps> = ({ isOpen, data, onClose, onSuccess }) => {
	const { control, getValues } = useForm();

	const { data: TMData } = useGetTechnicalManagerQuery({ status: 1 });

	const [redirectInspectionFn, { isLoading: RILoading, isSuccess: RISuccess }] = useRedirectInspectionMutation();

	const handleRedirectInspection = () => {
		const formValues = getValues();

		redirectInspectionFn({
			bazdidfani_id: data.id,
			technical_manager_id: formValues.technicalManager.personal.technical_manager_id,
			technical_manager_national_code: formValues.technicalManager.personal.national_code,
		});
	};

	useEffect(() => {
		if (RISuccess) onSuccess();
	}, [RISuccess]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth={true}
		>
			<div className="p-2 lg:p-4">
				<div className="w-full flex items-center justify-between">
					<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">ارجاع مجدد درخواست</DialogTitle>
					<IconButton onClick={onClose}>
						<CloseCircle
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				</div>
				<DialogContent className="flex flex-col gap-4 h-64 mt-16 w-1/2 mx-auto">
					<p>مدیر فنی راانتخاب کنید</p>
					<Controller
						name="technicalManager"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Autocomplete
								options={TMData?.data.data ?? []}
								getOptionLabel={(option: any) => option.personal.full_name}
								isOptionEqualToValue={(option, value) => option?.id === value?.id}
								value={value}
								onChange={(_event, newValue) => {
									onChange(newValue);
								}}
								className=""
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
				</DialogContent>
				<div className="flex items-center gap-2">
					<Button
						className="grow"
						variant="outlined"
						color="error"
						onClick={onClose}
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
				</div>
			</div>
		</Dialog>
	);
};

export default ReferInspectionDialog;
