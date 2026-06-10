import { FC } from "react";
import { Camera, Edit, Image } from "iconsax-reactjs";
import { Badge, Checkbox, FormControlLabel, IconButton } from "@mui/material";

import ImageComponent from "../../shared/Image/Image";
import SweetAlertToast from "../../shared/Functions/SweetAlertToast";
import InspectionItem from "../interfaces/inspection-item.interface";
import InspectionItemProps from "./interfaces/inspection-item-props.interface";

const InspectionItemContent: FC<InspectionItemProps> = ({
  item,
  onToggleItem,
  onEditItem,
}) => {
  const handleInspectionItemToggle = (inspectionItem: InspectionItem) => {
    onToggleItem(inspectionItem);
  };

  const handleEditItem = () => {
    if (item.reviewed) onEditItem(item);
    else
      SweetAlertToast.fire({
        icon: "warning",
        text: "این آیتم بررسی نشده قابل ویرایش نیست",
      });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <FormControlLabel
          control={
            <Checkbox
              color="success"
              value={item.checked}
              checked={item.checked}
              onChange={() => handleInspectionItemToggle(item)}
            />
          }
          label={item.name}
          className="font-Yekan-Bakh font-semibold"
        />
        <div className="mr-2 flex items-center gap-2">
          {item.isImage && (
            <div
              className={
                "flex gap-2 rounded-full px-2 py-1 text-nowrap text-white shadow-none " +
                (item.images?.length > 0
                  ? item.images.length >= item.minImageCount
                    ? "bg-green-700"
                    : "bg-yellow-500"
                  : "bg-inherit")
              }
            >
              <Image
                size="24"
                className={
                  item.images?.length > 0 ? "text-green-400" : "text-gray-500"
                }
              />
              {item.images?.length > 0 && (
                <p>
                  <span>{item.images.length}</span> از{" "}
                  <span>{item.maxImageCount}</span>
                </p>
              )}
            </div>
          )}
          <IconButton onClick={handleEditItem}>
            <Edit
              size="24"
              className={item.reviewed ? "text-amber-400" : "text-gray-500"}
            />
          </IconButton>
        </div>
      </div>
      {item.driverDescription && (
        <div className="my-2 rounded-lg bg-gray-200 p-2">
          <p className="indent-2 text-gray-900">
            توضیحات راننده: {item.driverDescription}
          </p>
        </div>
      )}
      {item.inspectorDescription && (
        <div className="my-2 rounded-lg bg-gray-200 p-2">
          <p className="indent-2 text-gray-900">
            توضیحات مدیر فنی: {item.inspectorDescription}
          </p>
        </div>
      )}
      {item.images?.length > 0 && (
        <div className="flex w-full items-center gap-4 overflow-x-auto py-4">
          {item.images.map((image, index) =>
            image ? (
              <Badge
                badgeContent={
                  index + 1 <= item?.minImageCount ? "لازم" : "اختیاری"
                }
                color={index + 1 <= item?.minImageCount ? "error" : "success"}
                key={index}
              >
                <ImageComponent
                  width="w-16"
                  height="h-16"
                  borderRadius="rounded-md"
                  image={image}
                  alt={"تصویر " + (index + 1)}
                />
              </Badge>
            ) : (
              <Badge
                badgeContent={
                  index + 1 <= item?.minImageCount ? "لازم" : "اختیاری"
                }
                color={index + 1 <= item?.minImageCount ? "error" : "success"}
                key={index}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-2">
                  <Camera className="text-gray-400" size="32" />
                </div>
              </Badge>
            ),
          )}
        </div>
      )}
    </>
  );
};

export default InspectionItemContent;
