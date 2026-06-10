import InspectionItem from "../interfaces/inspection-item.interface";

// NOTE all items must be checked and all items that need photo must have photos equal to minImageCount 
export default (items: Array<InspectionItem>): boolean =>
	items.every((item) => {
		if (item.details?.length)
			return item.details.every(
				(detail) =>
					detail.checked &&
					(!detail.isImage || ((detail.images?.length ?? 0) >= detail.minImageCount && (detail.images?.length ?? 0) <= detail.maxImageCount))
      );

		return item.checked && (!item.isImage || ((item.images?.length ?? 0) >= item.minImageCount && (item.images?.length ?? 0) <= item.maxImageCount));
	});
