import InspectionItem from "../interfaces/inspection-item.interface";

export default (item: InspectionItem, data?: InspectionItem) => {
  if (!data)
    return {
      ...item,
      details: item.details ?? [],
      checked: null,
      images: [],
      driverDescription: "",
      inspectorDescription: "",
      reviewed: false,
    };

  const { id, ...rest } = data;

  return {
    ...item,
    ...rest,
    details: rest.details ?? item.details ?? [],
    images: rest.images ?? item.images ?? [],
    reviewed: false,
  };
};
