import type InspectionItem from "../interfaces/inspection-item.interface";
import formatInspectionItem from "./format-inspection-item";

export const flattenInspectionItems = (items: InspectionItem[]): InspectionItem[] =>
  items.flatMap((item) => [item, ...flattenInspectionItems(item.details ?? [])]);

export function restoreInspectionItems(incoming: InspectionItem[], saved: InspectionItem[]): InspectionItem[] {
  const byCode = new Map(flattenInspectionItems(saved).map((item) => [item.code, item]));
  const restore = (item: InspectionItem): InspectionItem => {
    const restored = formatInspectionItem(item, byCode.get(item.code));
    if (restored.details.length) {
      restored.details = restored.details.map(restore);
      restored.checked = restored.details.every((detail) => detail.checked);
      restored.reviewed = restored.details.every((detail) => detail.reviewed);
    }
    return restored;
  };
  return incoming.map(restore);
}
