import { FC } from "react";

import InspectionItemContent from "./InspectionItemContent";

import InspectionItemProps from "./interfaces/inspection-item-props.interface";

const GroupInspectionItem: FC<InspectionItemProps> = ({
	item,
	onToggleItem,
	onEditItem,
}) => {
	return (
		<div className="flex flex-col p-2 rounded-md border border-gray-200 bg-white">
			<h3 className="w-full font-Yekan-Bakh font-semibold mb-2">{item.name}</h3>
			<p className="w-full text-gray-500 font-Yekan-Bakh">{item.description}</p>
			<div className="w-full p-4 flex flex-col gap-4">
				{item.details.map((detail) => (
					<div
						className="flex flex-col p-2 rounded-md border border-gray-300 bg-gray-100"
						key={detail.code}
					>
						<InspectionItemContent
							item={detail}
							onToggleItem={onToggleItem}
							onEditItem={onEditItem}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default GroupInspectionItem;
