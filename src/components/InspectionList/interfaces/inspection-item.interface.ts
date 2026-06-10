export default interface InspectionItem {
  id: string;
  code: number;
  name: string;
  description: null | string;
  requiredImage: boolean;
  isImage: boolean;
  minImageCount: number;
  maxImageCount: number;
  detailCount: number;
  details: Array<InspectionItem>;
  images: Array<string>; // ? For sending data to API convert it to file
  checked: boolean;
  driverDescription: string;
  inspectorDescription: string;
  reviewed: boolean;
  checkListId?: string;
  is_new?: boolean;
  image_data?: Record<string, string>;
  is_rejected?: boolean;
  isDetail?: number;
  bazdidfani_id?: number;
  uuid?: string;
  technical_inspection_id?: number;
  self_statement?: number;
  bazdidfani_status?: number;
}
