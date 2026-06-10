import { Button, CircularProgress, Divider, Switch, Typography, useTheme } from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { UndefinedToEmptyString } from "../../utilities/Helper";
import { GetShamsiDate } from "../../utilities/DateTime";
import { useChangeDriverStatusMutation } from "../../api/Driver/Driver";
import { EmptyCustomDialoProps } from "../shared/Dialog/CustomeDialog";

interface iprops {
	data: any;
	isDialog?: boolean;
	setCustomDialogProps?: (data: any) => void;
	onSuccess?: (data: any) => void;
}
const DriverCard: FC<iprops> = ({ data, isDialog, setCustomDialogProps, onSuccess }) => {
	const [changeDriverStatusfn, changeDriverStatusResult] = useChangeDriverStatusMutation();

	const handleActiveOrInActiveUser = useCallback(
		(userId: number, status: 0 | 1) => {
			changeDriverStatusfn({
				userId,
				body: {
					status,
				},
			});
		},
		[changeDriverStatusfn]
	);

	useEffect(() => {
		if (changeDriverStatusResult.isSuccess || !changeDriverStatusResult.isLoading) {
			setCustomDialogProps({ ...EmptyCustomDialoProps });
			// SweetAlertToast.fire({
			// 	title: changeDriverStatusResult?.data?.message,
			// 	icon: "success",
			// });
		}
	}, [changeDriverStatusResult]);

	const handleTaggleButton = (e: any, userId: number) => {
		if (e.target.checked) {
			setCustomDialogProps({
				children: (
					<div className="flex flex-col items-stretch lg:items-center justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
						<p className="font-semibold text-sm lg:text-lg">آیا از فعال کردن این راننده مطمئن هستید ؟</p>
						<div className="flex items-center justify-around w-full gap-4">
							<Button
								loading={changeDriverStatusResult.isLoading}
								variant="contained"
								className="px-10"
								onClick={() => {
									handleActiveOrInActiveUser(userId, 1);
								}}
							>
								بله
							</Button>
							<Button
								variant="outlined"
								className="px-10"
								onClick={() => {
									setCustomDialogProps({ ...EmptyCustomDialoProps });
								}}
								sx={{ color: "red", borderColor: "red" }}
							>
								خیر
							</Button>
						</div>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialogProps({ ...EmptyCustomDialoProps });
				},
				show: true,
			});
		} else {
			setCustomDialogProps({
				children: (
					<div className="flex flex-col items-stretch justify-between space-y-20 border-2 border-solid border-green-800 px-10 py-10">
						<p className="font-semibold text-sm lg:text-lg">آیا از غیر فعال کردن این راننده مطمئن هستید ؟</p>
						<div className="flex items-center justify-around w-full gap-4">
							<Button
								loading={changeDriverStatusResult.isLoading}
								variant="contained"
								className="px-10"
								onClick={() => {
									handleActiveOrInActiveUser(userId, 0);
								}}
							>
								بله
							</Button>
							<Button
								variant="outlined"
								className="px-10"
								onClick={() => {
									setCustomDialogProps({ ...EmptyCustomDialoProps });
								}}
								sx={{ color: "red", borderColor: "red" }}
							>
								خیر
							</Button>
						</div>
					</div>
				),
				hasOnClose: true,
				onClose: () => {
					setCustomDialogProps({ ...EmptyCustomDialoProps });
				},
				show: true,
			});
		}
	};

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="flex items-center justify-between">
				<p className="text-gray-900">{UndefinedToEmptyString(data?.full_name)}</p>
				{changeDriverStatusResult.isLoading && changeDriverStatusResult.originalArgs.userId == data.id ? (
					<CircularProgress color="primary" />
				) : (
					<Switch
						className="rotate-180"
						checked={data?.status === "1"}
						onChange={(e) => {
							handleTaggleButton(e, data.id);
						}}
					/>
				)}
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.drivers_info?.national_code)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نام پدر</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.drivers_info?.father_name)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">تاریخ تولد</p>
				<p className="text-gray-900">{GetShamsiDate(data?.drivers_info?.birthdate)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره همراه</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.phone_number)}</p>
			</div>
			{isDialog && (
				<>
					<Divider />
					<Button
						onClick={() => onSuccess(data)}
						variant="contained"
						className="w-full"
					>
						انتخاب راننده
					</Button>
				</>
			)}
		</div>
	);
};

export default DriverCard;
