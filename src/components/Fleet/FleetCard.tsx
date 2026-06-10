import { Button, Divider, IconButton } from "@mui/material";
import { FC } from "react";
import Plate from "../shared/DataGrid/Plate";
import { UndefinedToEmptyString } from "../../utilities/Helper";
import { Edit, Trash } from "iconsax-reactjs";

interface iprops {
	data: any;
	isDialog?: boolean;
	onEditButtonClick: (id: number) => void;
	onRemoveButtonClick: (id: number) => void;
	onSelfStatmentButtonClick: (id: number) => void;
}

const FleetCard: FC<iprops> = ({ data, isDialog, onEditButtonClick, onRemoveButtonClick, onSelfStatmentButtonClick }) => {
	return (
		<div className="w-full rounded-2xl p-4 bg-gray-50 flex flex-col gap-2">
			<div className="flex justify-between items-center gap-2">
				{!isDialog ? (
					<div>
						<IconButton
							title="ویرایش"
							onClick={() => onEditButtonClick(data.id)}
						>
							<Edit
								size="24"
								className="text-amber-400"
							/>
						</IconButton>
						<IconButton
							title="حذف"
							onClick={() => onRemoveButtonClick(data.id)}
						>
							<Trash
								size="24"
								color="#ef4444"
							/>
						</IconButton>
					</div>
				) : (
					<p className="text-gray-500">پلاک</p>
				)}
				<div>
					<Plate
						firstChar={UndefinedToEmptyString(data?.truck?.first_number)}
						fourthChar={UndefinedToEmptyString(data?.truck?.fourth_number)}
						secondChar={UndefinedToEmptyString(data?.truck?.third_character)}
						thirdChar={UndefinedToEmptyString(data?.truck?.second_number)}
					/>
				</div>
			</div>
			<Divider />
			<div className="flex justify-between items-center">
				<p className="text-gray-500">نوع بارگیر</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.truck.loader.name)}</p>
			</div>
			<div className="flex justify-between items-center">
				<p className="text-gray-500">هوشمند</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.truck.smart_number)}</p>
			</div>
			<div className="flex justify-between items-center">
				<p className="text-gray-500">همراه مالک</p>
				<p className="text-gray-900">{UndefinedToEmptyString(data?.truck_info.owner_phone_number)}</p>
			</div>
			{isDialog && (
				<Button
					fullWidth
					variant="contained"
					className="w-full font-semibold text-center"
					size="large"
					onClick={() => {
						onSelfStatmentButtonClick(data);
					}}
				>
					انتخاب خودرو
				</Button>
			)}
		</div>
	);
};

export default FleetCard;
