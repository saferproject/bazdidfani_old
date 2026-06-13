import { Divider, IconButton } from "@mui/material";
import { Edit, Login, SecurityUser } from "iconsax-reactjs";
import { FC } from "react";
import { formatJalaliDate } from "../../utilities/DateTime";

interface iprops {
	data: any;
	onEditUser: (data: any) => void;
	onLoginAs: (userId: number, fullName: string) => void;
	onChangeRolesStatus: (user: any) => void;
}

const AUsersCard: FC<iprops> = ({ data, onEditUser, onLoginAs, onChangeRolesStatus }) => {
	const fullName = data.personal?.full_name ?? "";
	const roles = data.roles
		?.filter((r: any) => r.role.name !== "user")
		.map((r: any) => r.role.description)
		.join("، ") ?? "";

	return (
		<div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
			<div className="w-full flex items-center justify-between">
				<p className="font-semibold">{fullName}</p>
				<div className="flex items-center">
					<IconButton size="small" onClick={() => onEditUser(data)}>
						<Edit size="20" className="text-amber-400" />
					</IconButton>
					<IconButton size="small" onClick={() => onChangeRolesStatus(data)}>
						<SecurityUser size="20" className="text-blue-400" />
					</IconButton>
					<IconButton size="small" onClick={() => onLoginAs(data.id, fullName)}>
						<Login size="20" className="text-primary" />
					</IconButton>
				</div>
			</div>
			<Divider />
			<div className="flex items-center justify-between">
				<p className="text-gray-500">کد ملی</p>
				<p className="text-gray-900">{data.personal?.national_code ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">شماره همراه</p>
				<p className="text-gray-900">{data.personal?.phone ?? ""}</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">وضعیت</p>
				<p className={data.personal?.status === 1 ? "text-green-500" : "text-gray-500"}>
					{data.personal?.status === 1 ? "فعال" : "غیر فعال"}
				</p>
			</div>
			<div className="flex items-center justify-between">
				<p className="text-gray-500">نقش ها</p>
				<p className="text-gray-900">{roles}</p>
			</div>
			{data.company?.name && (
				<div className="flex items-center justify-between">
					<p className="text-gray-500">نام شرکت</p>
					<p className="text-gray-900">{data.company.name}</p>
				</div>
			)}
			<div className="flex items-center justify-between">
				<p className="text-gray-500">زمان ثبت نام</p>
				<p className="text-gray-900">
					{data.created_at ? formatJalaliDate(data.created_at, "yyyy/MM/dd") : ""}
				</p>
			</div>
		</div>
	);
};

export default AUsersCard;
