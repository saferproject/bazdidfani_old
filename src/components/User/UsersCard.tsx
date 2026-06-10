import { Divider, Switch } from "@mui/material";
import { FC } from "react";
import { UndefinedToEmptyString } from "../../utilities/Helper";

interface iprops {
	data: any;
	onStatusChange: (data: any) => void;
	isDialog?: boolean;
}
const UsersCard: FC<iprops> = ({ data, onStatusChange }) => {
	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="flex items-center justify-between">
				<p className="text-gray-900">{UndefinedToEmptyString(data?.full_name)}</p>
				<Switch
					checked={data?.status === "active"}
					onChange={() => onStatusChange(data)}
				/>
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.national_code)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره تماس</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.phone)}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نام پدر</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.father_name)}</p>
			</div>
		</div>
	);
};

export default UsersCard;
