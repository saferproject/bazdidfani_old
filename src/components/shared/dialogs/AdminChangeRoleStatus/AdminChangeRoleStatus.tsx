import { FC, useEffect } from "react";
import AdminChangeRoleStatusProps from "./interfaces/admin-change-role-status-props.interface";
import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, IconButton, Switch } from "@mui/material";
import { CloseCircle } from "iconsax-reactjs";
import { useAdminChangeRoleStatusMutation, useGetRoleStatesQuery } from "./api/change-role-status.api";
import SweetAlertToast from "../../Functions/SweetAlertToast";

const AdminChangeRoleStatus: FC<AdminChangeRoleStatusProps> = ({ isOpen, user, onClose }) => {
	const roleStates = useGetRoleStatesQuery(user.id);

	const [changeStatusFn, changeStatusResult] = useAdminChangeRoleStatusMutation();

	const handleChangeStatus = ({ role_id, status, role }) => {
		changeStatusFn({
			role_id,
			user_id: user.id,
			status:
				role === "company"
					? status === 2
						? 1
						: status === 3
						? 0
						: undefined
					: role === "user_company"
					? status === "active"
						? 0
						: status === "inActive"
						? 1
						: undefined
					: status === 1
					? 0
					: 1,
		});
	};

	useEffect(() => {
		if (changeStatusResult.isSuccess)
			SweetAlertToast.fire({
				icon: "success",
				text: changeStatusResult.data.message,
			});
	}, [changeStatusResult.isSuccess]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<div className="p-2 lg:p-4">
				<div className="w-full flex items-center justify-between">
					<DialogTitle className="shrink text-xl font-semibold font-Yekan-Bakh">تغییر وضعیت نقش ها</DialogTitle>
					<IconButton onClick={onClose}>
						<CloseCircle
							size="24"
							className="text-red-500"
						/>
					</IconButton>
				</div>
				<DialogContent className="flex flex-col gap-4 mb-2">
					<FormGroup>
						{roleStates.data &&
							Object.values(roleStates.data?.data.roles)
								.filter(({ status }) => status !== null)
								.map(({ role, status, title, role_id }) => (
									<FormControlLabel
										label={title}
										control={
											<Switch
												checked={
													role === "company"
														? status === 2
															? false
															: status === 3
															? true
															: false
														: role === "user_company"
														? status === "active"
															? true
															: status === "inActive"
															? false
															: false
														: status === 1
														? true
														: false
												}
												onChange={() => handleChangeStatus({ role, role_id, status })}
											/>
										}
									/>
								))}
					</FormGroup>
				</DialogContent>
				<div className="flex items-center gap-2">
					<Button
						variant="outlined"
						color="secondary"
						onClick={onClose}
					>
						بازگشت
					</Button>
				</div>
			</div>
		</Dialog>
	);
};

export default AdminChangeRoleStatus;
