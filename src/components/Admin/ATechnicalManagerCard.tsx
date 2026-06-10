import { Divider, Switch, useTheme } from "@mui/material";
import { FC, useEffect } from "react";
import { UndefinedToEmptyString } from "../../utilities/Helper";
import { RoleType } from "../../types/RoleType";
import SweetAlertToast from "../shared/Functions/SweetAlertToast";
import { GetShamsiDate } from "../../utilities/DateTime";
import { useChangeTechnicalManagerStatusMutation } from "../../api/TechnicalManager/TechnicalManager";

interface iprops {
	data: any;
	isDialog?: boolean;
}

const ATechnicalManagerCard: FC<iprops> = ({ data }) => {
	const [changeTechnicalManagerStatusFn, changetechnicalManagerStatusResult] = useChangeTechnicalManagerStatusMutation();

	useEffect(() => {
		if (changetechnicalManagerStatusResult.isSuccess)
			SweetAlertToast.fire({
				title: changetechnicalManagerStatusResult.data.message,
				icon: "success",
			});
	}, [changetechnicalManagerStatusResult.isSuccess]);

	useEffect(() => {
		if (changetechnicalManagerStatusResult.isSuccess) {
			SweetAlertToast.fire({
				title: "وضعیت کاربر با موفقیت تغییر یافت",
				icon: "success",
			});
		}
	}, [changetechnicalManagerStatusResult]);

	const handleActive = (e: any, userId: number) => {
		if (e.target.checked)
			changeTechnicalManagerStatusFn({
				userId: userId,
				role: RoleType.technicalManager,
				status: 1,
			});
		else
			changeTechnicalManagerStatusFn({
				userId: userId,
				role: RoleType.technicalManager,
				status: 0,
			});
	};

	return (
		<div className="w-full rounded-2xl p-4 bg-gray-50 flex flex-col gap-2">
			<div className="flex justify-between items-center gap-2">
				<h4 className="font-semibold">{UndefinedToEmptyString(data?.full_name)}</h4>
				<Switch
					className="rotate-180"
					checked={data?.status === 1}
					onChange={(e) => {
						handleActive(e, data.id);
					}}
				/>
			</div>
			<Divider />
			<div className="flex items-center justify-between w-full">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.national_code)}</p>
			</div>
			<div className="flex items-center justify-between w-full">
				<p className="text-gray-500">شماره تماس</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.phone)}</p>
			</div>
			<div className="flex items-center justify-between w-full">
				<p className="text-gray-500">پایان قرارداد</p>
				<p className="text-gray-900">{GetShamsiDate(data?.end_cooperate)}</p>
			</div>
			{/* <Divider /> */}
			{/* {changetechnicalManagerStatusResult.isLoading && changetechnicalManagerStatusResult.originalArgs.userId == data.id ? (
				<CircularProgress color="primary" />
			) : (
				<div className="flex items-center justify-center w-full">
					<p>غیرفعال</p>
					<Switch
						checked={data?.status === 1}
						onChange={(e) => {
							handleActive(e, data.id);
						}}
					/>
					<p>فعال</p>
				</div>
			)} */}
		</div>
	);
};

export default ATechnicalManagerCard;
