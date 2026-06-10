import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { FC, useEffect } from "react";
import DatePickerComponent from "../../../../components/shared/DatePicker/DatePickerComponent";
import EditTechnicalManagerDataDialogProps from "../interfaces/edit-technical-manager-data-dialog-props.interface";
import { useForm } from "react-hook-form";
import { useEditTechnicalManagerMutation } from "../../../../api/TechnicalManager/TechnicalManager";

const EditTechnicalManagerDataDialog: FC<EditTechnicalManagerDataDialogProps> = ({ isOpen, data, onSuccess, onClose }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({ defaultValues: data });

	const [editTechnicalManagerFn, editTechnicalManagerResult] = useEditTechnicalManagerMutation();

	const onSubmit = (formData) => {
		editTechnicalManagerFn({ id: data.id, ...formData });
	};

	useEffect(() => {
		if (editTechnicalManagerResult.isSuccess) {
			onSuccess();
			onClose();
		}
	}, [editTechnicalManagerResult.isSuccess]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="md"
		>
			<div className="p-2 lg:p-4">
				<div className="w-full flex items-center justify-between">
					<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">ویرایش مدیر فنی</DialogTitle>
					<IconButton onClick={onClose}>
						<CloseCircle
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				</div>
				<DialogContent className="flex flex-col gap-4 mb-2">
					<form
						autoComplete="off"
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<div>
							<DatePickerComponent
								control={control}
								label="تاریخ شروع"
								name="start_cooperate"
								error={!!errors.start_cooperate}
								helperText={errors.start_cooperate?.message.toString() ?? ""}
							/>
						</div>
						<div>
							<DatePickerComponent
								control={control}
								label="تاریخ پایان"
								name="end_cooperate"
								error={!!errors.end_cooperate}
								helperText={errors.end_cooperate?.message.toString() ?? ""}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outlined"
								color="secondary"
								onClick={onClose}
								fullWidth
							>
								انصراف
							</Button>
							<Button
								variant="contained"
								type="submit"
								fullWidth
							>
								ثبت
							</Button>
						</div>
					</form>
				</DialogContent>
			</div>
		</Dialog>
	);
};

export default EditTechnicalManagerDataDialog;
