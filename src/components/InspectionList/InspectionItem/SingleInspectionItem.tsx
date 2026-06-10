import { FC } from "react";

import InspectionItemContent from "./InspectionItemContent";

import InspectionItemProps from "./interfaces/inspection-item-props.interface";

const SingleInspectionItem: FC<InspectionItemProps> = ({
	item,
	onToggleItem,
	onEditItem,
}) => {
	return (
		<div className="flex flex-col p-2 rounded-lg border border-gray-200">
			<InspectionItemContent
				item={item}
				onToggleItem={onToggleItem}
				onEditItem={onEditItem}
			/>
		</div>
	);
};

export default SingleInspectionItem;
