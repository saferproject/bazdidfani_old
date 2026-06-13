import { Button, Switch, TextField } from "@mui/material";
import { FC, useEffect } from "react";
import { useChangeAdminSettingMutation, useGetAdminSettingsQuery } from "./api/admin-settings.api";
import Setting from "./interfaces/setting.interface";
import { useForm } from "react-hook-form";
import SweetAlertToast from "../../../components/shared/Functions/SweetAlertToast";
import { Setting2 } from "iconsax-reactjs";

const AdminSettings: FC = () => {
	const settings = useGetAdminSettingsQuery();

	const [changeSettingFn, changeSettingResult] = useChangeAdminSettingMutation();

	const { register, getValues, reset } = useForm();

	const handleSettingStatusChange = (setting: Setting) => {
		changeSettingFn({ id: setting.id, status: setting.status === 1 ? 0 : 1, value: setting.value });
	};

	const handleSettingValueChange = (setting: Setting) => {
		changeSettingFn({ id: setting.id, status: setting.status, value: getValues(setting.key) });
	};

	useEffect(() => {
		if (changeSettingResult.isSuccess)
			SweetAlertToast.fire({
				icon: "success",
				text: changeSettingResult.data.message,
			});
	}, [changeSettingResult.isSuccess]);

	useEffect(() => {
		if (settings.isSuccess)
			reset(
				settings.data
					.filter((setting) => setting.value)
					.map((setting) => ({ [setting.key]: setting.value }))
					.reduce((acc, obj) => ({ ...acc, ...obj }), {})
			);
	}, [settings.isSuccess]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<Setting2 size="32" className="text-primary" />
				<h2 className="font-bold text-xl">تنظیمات</h2>
			</div>
			<div className="flex flex-col gap-2">
				{settings.data?.map((setting) => (
					<div
						key={setting.id}
						className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-xl"
					>
						<div className="flex items-center gap-3">
							<Switch
								className="rotate-180"
								id={setting.id.toString()}
								checked={!!setting.status}
								onChange={() => handleSettingStatusChange(setting)}
							/>
							<label htmlFor={setting.id.toString()} className="text-sm font-medium cursor-pointer">
								{setting.title}
							</label>
						</div>
						{setting.value !== null && (
							<div className="flex items-center gap-2 sm:shrink-0">
								<TextField
									{...register(setting.key, { valueAsNumber: true })}
									onChange={(event) => {
										if (event.target.value === "" || event.target.value === null)
											event.target.value = "0";
									}}
									slotProps={{ inputLabel: { shrink: true } }}
									type="number"
									label="مقدار"
									size="small"
									className="w-32"
								/>
								<Button
									variant="contained"
									size="small"
									onClick={() => handleSettingValueChange(setting)}
								>
									ثبت
								</Button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminSettings;
